import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createAIBudget,boundedLimit} from '../ops/ai-budget.mjs';
async function fixture(t){const dir=await fs.mkdtemp(path.join(os.tmpdir(),'np-ai-budget-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));return dir;}
test('Attempt caps survive a new budget instance, reset daily, and preserve monthly consumption',async t=>{
 const dir=await fixture(t);let date=new Date('2026-10-24T12:00:00Z');const options={daily:1,monthly:2,now:()=>date};
 (await createAIBudget(dir,options).reserve())();
 await assert.rejects(createAIBudget(dir,options).reserve(),{statusCode:429});
 date=new Date('2026-10-25T12:00:00Z');(await createAIBudget(dir,options).reserve())();
 date=new Date('2026-10-26T12:00:00Z');await assert.rejects(createAIBudget(dir,options).reserve(),{statusCode:429});
 date=new Date('2026-11-01T12:00:00Z');(await createAIBudget(dir,options).reserve())();
 assert.equal(JSON.parse(await fs.readFile(path.join(dir,'ai-usage.json'))).monthly,1);
});
test('Concurrent reservations never exceed the persisted cap',async t=>{
 const dir=await fixture(t);const budget=createAIBudget(dir,{daily:2,monthly:2,concurrent:20});
 const results=await Promise.allSettled(Array.from({length:10},()=>budget.reserve()));
 assert.equal(results.filter(r=>r.status==='fulfilled').length,2);assert.equal(JSON.parse(await fs.readFile(path.join(dir,'ai-usage.json'))).daily,2);
 for(const r of results)if(r.status==='fulfilled'){r.value();r.value();}
});
test('Only two provider calls may run together; releasing a slot allows the next request',async t=>{
 const dir=await fixture(t);const budget=createAIBudget(dir);const a=await budget.reserve(),b=await budget.reserve();
 await assert.rejects(budget.reserve(),{statusCode:429});a();a();const c=await budget.reserve();b();c();
});
test('Corrupt counters and clock rollback fail closed without overwriting evidence',async t=>{
 const dir=await fixture(t),file=path.join(dir,'ai-usage.json');
 for(const raw of ['{broken','null','[]','{"format":1,"day":"2099-01-01","month":"2099-01","daily":1,"monthly":1}']){
  await fs.writeFile(file,raw);await assert.rejects(createAIBudget(dir).reserve(),{statusCode:503});assert.equal(await fs.readFile(file,'utf8'),raw);
 }
});
test('Zero and malformed settings never mean unlimited; defaults remain bounded',async t=>{
 assert.equal(boundedLimit(undefined,50),50);for(const v of ['0','-1','NaN','Infinity','1.5'])assert.equal(boundedLimit(v,50),0);
 const dir=await fixture(t);await assert.rejects(createAIBudget(dir,{daily:0}).reserve(),{statusCode:429});
 await assert.rejects(fs.stat(path.join(dir,'ai-usage.json')),/ENOENT/);
});
