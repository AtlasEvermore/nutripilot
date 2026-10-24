import crypto from 'node:crypto';
const refused = message => Object.assign(new Error(message),{statusCode:429});
export function createSharedBudget(storage,{daily=50,monthly=500,concurrent=2,now=Date.now}={}){
 return {async reserve(){
  if(!daily||!monthly)throw refused('Les analyses sont momentanément en pause.');
  const id=crypto.randomUUID(),time=now(),day=new Date(time).toISOString().slice(0,10),month=day.slice(0,7);
  await storage.mutate('legacy','ai-usage.json',null,old=>{
   if(old && (old.format!==1 || !/^\d{4}-\d{2}-\d{2}$/.test(old.day) || old.month!==old.day.slice(0,7) || old.day>day || !Number.isSafeInteger(old.daily) || old.daily<0 || !Number.isSafeInteger(old.monthly) || old.monthly<old.daily))throw refused('Le suivi des analyses est indisponible.');
   if(old?.leases && (typeof old.leases!=='object'||Array.isArray(old.leases)||Object.values(old.leases).some(v=>!Number.isFinite(v))))throw refused('Le suivi des analyses est indisponible.');
   const leases=Object.fromEntries(Object.entries(old?.leases||{}).filter(([,expiry])=>expiry>time));
   if(Object.keys(leases).length>=concurrent)throw refused('Le service d’analyse est occupé. Réessayez dans quelques instants.');
   const value={format:1,day,month,daily:old?.day===day?old.daily:0,monthly:old?.month===month?old.monthly:0,leases};
   if(value.daily>=daily||value.monthly>=monthly)throw refused('La limite d’analyses est atteinte. Le code-barres et la saisie manuelle restent disponibles.');
   value.daily++;value.monthly++;value.leases[id]=time+300000;
   return {value};
  });
  let released=false;
  return async()=>{if(released)return;released=true;await storage.mutate('legacy','ai-usage.json',null,value=>{if(value?.leases)delete value.leases[id];return {value};});};
 }};
}
