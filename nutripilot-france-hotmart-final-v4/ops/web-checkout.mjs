export function webCheckouts(env=process.env) {
 const result={};if(env.WEB_CHECKOUT_ENABLED!=='true')return result;
 for(const period of ['monthly','annual']) {
  const raw=env[`HOTMART_CHECKOUT_COMPLETE_${period.toUpperCase()}`];if(!raw)continue;
  try {
   const url=new URL(raw);
   if(url.protocol==='https:' && url.hostname==='pay.hotmart.com' && !url.port && !url.username && !url.password && !url.hash && /^\/[A-Za-z0-9]+$/.test(url.pathname))result[`complete_${period}`]=url.href;
  }catch{}
 }
 return result;
}
