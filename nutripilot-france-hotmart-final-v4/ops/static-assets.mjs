import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { gzip, brotliCompress, constants } from 'node:zlib';
const zip = promisify(gzip), brotli = promisify(brotliCompress);

// q=0 is a refusal, including for identity. No header means the conservative raw representation.
export function negotiateEncoding(header = '') {
  const values = new Map();
  for (const item of String(header).slice(0,4096).toLowerCase().split(',')) {
    const [name,...params] = item.trim().split(';'); if (!name) continue;
    const param = params.map(s=>s.trim()).find(s=>s.startsWith('q='));
    const q = param ? (/^q=(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(param) ? Number(param.slice(2)) : 0) : 1;
    values.set(name,q);
  }
  const quality = name => values.has(name) ? values.get(name) : values.get('*') || 0;
  const br = quality('br'), gz = quality('gzip');
  if (br > 0 && br >= gz) return 'br';
  if (gz > 0) return 'gzip';
  return (values.get('identity') === 0 || (!values.has('identity') && values.get('*') === 0)) ? null : 'identity';
}
export function matchesETag(header, etag) {
  return String(header || '').split(',').some(value => value.trim() === '*' || value.trim().replace(/^W\//,'') === etag.replace(/^W\//,''));
}
export function createStaticAssets({ maxBytes = 32*1024*1024, maxEntries = 128 } = {}) {
  const cache = new Map(), pending = new Map();
  const trim = () => {
    let bytes=0; for(const e of cache.values()) bytes+=e.bytes;
    for(const [key,e] of cache){if(cache.size<=maxEntries && bytes<=maxBytes)break;cache.delete(key);bytes-=e.bytes;}
  };
  async function entry(filePath, stat) {
    const key=`${filePath}:${stat.mtimeMs}:${stat.size}`;
    const hit=cache.get(filePath);
    if(hit?.key===key){cache.delete(filePath);cache.set(filePath,hit);return hit;}
    if(pending.has(key))return pending.get(key);
    const task=(async()=>{
      const buf=await fs.readFile(filePath);
      const value={key,buf,bytes:buf.length,etag:`W/"${crypto.createHash('sha256').update(buf).digest('base64url').slice(0,24)}"`,compressible:/\.(js|css|html|json|svg|webmanifest)$/.test(filePath) && buf.length>1024,variants:new Map()};
      cache.set(filePath,value);trim();return value;
    })();
    pending.set(key,task);try{return await task;}finally{pending.delete(key);}
  }
  async function representation(value, acceptEncoding) {
    const selected=negotiateEncoding(acceptEncoding);
    if(selected===null)return null;
    // Binary assets never need a second compressed copy; honor an explicit identity refusal.
    if(!value.compressible){
      if(negotiateEncoding(String(acceptEncoding).replace(/(?:^|,)\s*(?:br|gzip)\s*(?:;[^,]*)?/gi,''))===null)return null;
      return {buf:value.buf,encoding:null};
    }
    if(selected==='identity')return {buf:value.buf,encoding:null};
    if(!value.variants.has(selected)){
      const work=(selected==='br'?brotli(value.buf,{params:{[constants.BROTLI_PARAM_QUALITY]:5}}):zip(value.buf,{level:6})).then(buf=>{value.bytes+=buf.length;trim();return buf;}).catch(error=>{value.variants.delete(selected);throw error;});
      value.variants.set(selected,work);
    }
    return {buf:await value.variants.get(selected),encoding:selected};
  }
  return { entry, representation };
}
