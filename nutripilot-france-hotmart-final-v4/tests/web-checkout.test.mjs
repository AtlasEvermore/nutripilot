import {test} from 'node:test';import assert from 'node:assert/strict';
import {webCheckouts} from '../ops/web-checkout.mjs';
const sample='https://pay.hotmart.com/R107884011S?off=r3ueswug';
test('Web purchases require explicit enablement and a specific verified period',()=>{
 assert.deepEqual(webCheckouts({HOTMART_CHECKOUT_COMPLETE_MONTHLY:sample}),{});
 assert.deepEqual(webCheckouts({WEB_CHECKOUT_ENABLED:'true',HOTMART_CHECKOUT_COMPLETE_MONTHLY:sample}),{complete_monthly:sample});
});
test('Checkout configuration refuses redirects to arbitrary hosts or URLs containing credentials',()=>{
 for(const url of ['http://pay.hotmart.com/R107884011S','https://evil.invalid/R107884011S','https://pay.hotmart.com.evil.invalid/X','https://user:password@pay.hotmart.com/X','javascript:alert(1)','https://pay.hotmart.com/X#token','https://pay.hotmart.com:8443/X'])assert.deepEqual(webCheckouts({WEB_CHECKOUT_ENABLED:'true',HOTMART_CHECKOUT_COMPLETE_MONTHLY:url}),{});
});
