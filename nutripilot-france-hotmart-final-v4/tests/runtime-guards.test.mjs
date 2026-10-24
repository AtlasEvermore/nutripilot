import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter, singleFlight } from '../ops/runtime-guards.mjs';

test('A full rate table cannot grow or evict another active identity, and recovers expired capacity', () => {
  let time = 0;
  const allow = createRateLimiter({maxBuckets:2,now:()=>time});
  assert.equal(allow('a',2,1000),true);assert.equal(allow('b',1,1000),true);
  for(let n=0;n<20000;n++) assert.equal(allow('new-'+n,1,1000),false);
  assert.equal(allow('a',2,1000),true);assert.equal(allow('a',2,1000),false);
  time=1000;assert.equal(allow('c',1,1000),true);assert.equal(allow('d',1,1000),true);assert.equal(allow('e',1,1000),false);
  assert.equal(allow('c',1,1000),false);
});

test('Invalid limits never create unlimited access', () => {
  const allow=createRateLimiter();
  for(const limit of [0,-1,Infinity,NaN,1.5]) assert.equal(allow('invalid',limit,1000),false);
  assert.throws(()=>createRateLimiter({maxBuckets:0}));
});

test('Concurrent work shares one operation and rejection never poisons subsequent work', async () => {
  let calls=0,release;
  const work=singleFlight(async()=>{calls++;await new Promise(resolve=>{release=resolve;});if(calls===1)throw new Error('temporary');return 42;});
  const waiting=Array.from({length:100},()=>work());await Promise.resolve();assert.equal(calls,1);
  release();const failures=await Promise.allSettled(waiting);assert.ok(failures.every(x=>x.status==='rejected'));
  const next=work();await Promise.resolve();assert.equal(calls,2);release();assert.equal(await next,42);
});
