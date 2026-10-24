import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
export function boundedLimit(value, fallback) {
  if (value === undefined || value === '') return fallback;
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 0 ? n : 0; // Invalid settings disable, never uncap spending.
}
function refused(message, statusCode = 429) { return Object.assign(new Error(message), {statusCode}); }
// Counts provider ATTEMPTS, including retries/failures, without storing prompts or personal data.
// Single process/volume: horizontal scaling requires a transactional shared counter.
export function createAIBudget(dir, {daily=50, monthly=500, concurrent=2, now=()=>new Date()} = {}) {
  const file = path.join(dir,'ai-usage.json'); let queue = Promise.resolve(), active=0;
  async function reserve() {
    if (active >= concurrent) throw refused('Le service d’analyse est occupé. Réessayez dans quelques instants.');
    active++;
    const job = queue.then(async () => {
      if (!daily || !monthly) throw refused('Les analyses sont momentanément en pause.');
      const day = now().toISOString().slice(0,10), month=day.slice(0,7);
      let old;
      try { old=JSON.parse(await fs.readFile(file,'utf8')); }
      catch (e) { if (e.code!=='ENOENT') throw refused('Le suivi des analyses est indisponible.',503); }
      if (old && (old.format!==1 || !/^\d{4}-\d{2}-\d{2}$/.test(old.day) || old.month!==old.day.slice(0,7) || old.day>day || !Number.isSafeInteger(old.daily) || old.daily<0 || !Number.isSafeInteger(old.monthly) || old.monthly<old.daily)) throw refused('Le suivi des analyses est indisponible.',503);
      if (old === null || (old !== undefined && typeof old!=='object')) throw refused('Le suivi des analyses est indisponible.',503);
      const value={format:1,day,month,daily:old?.day===day ? old.daily : 0,monthly:old?.month===month ? old.monthly : 0};
      if (value.daily>=daily || value.monthly>=monthly) throw refused('La limite d’analyses est atteinte. Le code-barres et la saisie manuelle restent disponibles.');
      value.daily++;value.monthly++;
      await fs.mkdir(dir,{recursive:true});
      const temp=`${file}.${crypto.randomBytes(8).toString('hex')}.tmp`;let handle;
      try {
        handle=await fs.open(temp,'wx',0o600);await handle.writeFile(JSON.stringify(value));await handle.sync();await handle.close();handle=null;await fs.rename(temp,file);
      } finally { if(handle) await handle.close();await fs.rm(temp,{force:true}); }
    });
    queue=job.catch(()=>{});
    try { await job; } catch(e) {active--;throw e;}
    let released=false;return ()=>{if(!released){released=true;active--;}};
  }
  return {reserve};
}
