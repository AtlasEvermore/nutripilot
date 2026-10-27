import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import os from 'node:os';import {gunzipSync,brotliDecompressSync} from 'node:zlib';
import {createStaticAssets,negotiateEncoding,matchesETag} from '../ops/static-assets.mjs';
test('Static encoding negotiation honors refusals, weights and wildcard exclusions',()=>{
 for(const [header,result] of [['','identity'],['gzip','gzip'],['gzip;q=0','identity'],['gzip;q=0, br;q=1','br'],['br;q=0.2, gzip;q=0.9','gzip'],['br;q=0, gzip;q=0, identity;q=0',null],['*;q=0',null],['*;q=0, identity;q=1','identity'],['GZIP; q=1','gzip'],['gzip;q=2','identity']])assert.equal(negotiateEncoding(header),result,header);
 assert.ok(matchesETag('"old", W/"new"','W/"new"'));assert.ok(matchesETag('*','W/"new"'));assert.equal(matchesETag('"old"','W/"new"'),false);
});
test('Concurrent static reads and compression share work, preserve bytes and invalidate changed assets',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'np-static-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));const file=path.join(root,'app.js');const original=Buffer.from('const example = 1;\n'.repeat(1000));await fs.writeFile(file,original);const assets=createStaticAssets();const stat=await fs.stat(file);
 const entries=await Promise.all(Array.from({length:12},()=>assets.entry(file,stat)));assert.ok(entries.every(e=>e===entries[0]));
 for(const [encoding,decode] of [['gzip',gunzipSync],['br',brotliDecompressSync]]){const reps=await Promise.all(entries.map(e=>assets.representation(e,encoding)));assert.ok(reps.every(r=>r.buf===reps[0].buf));assert.deepEqual(decode(reps[0].buf),original);assert.ok(reps[0].buf.length<original.length);}
 assert.equal((await assets.representation(entries[0],'gzip;q=0')).encoding,null);
 assert.equal(await assets.representation(entries[0],'*;q=0'),null);
 await fs.writeFile(file,Buffer.concat([original,Buffer.from('// edited')]));const changed=await assets.entry(file,await fs.stat(file));assert.notEqual(changed.etag,entries[0].etag);
 const binary=path.join(root,'picture.webp');await fs.writeFile(binary,'abc');const image=await assets.entry(binary,await fs.stat(binary));assert.equal((await assets.representation(image,'gzip')).encoding,null);assert.equal(await assets.representation(image,'identity;q=0,gzip'),null);
});
