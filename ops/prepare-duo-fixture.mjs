// CI-only offline visual fixture. Never used by the signing workflow or production.
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
if (process.env.CI !== 'true') throw Error('This synthetic simulator fixture is CI-only');
const native = path.join(root, 'native');
const source = path.join(root, 'nutripilot-france-hotmart-final-v4');
const destination = path.join(native, 'www');
await fs.rm(destination, {recursive:true, force:true});
await fs.mkdir(destination);
for (const entry of await fs.readdir(source, {withFileTypes:true})) {
  // Explicit public UI files only: no server, credentials, database, tests or documents.
  if ((entry.isFile() && /\.(?:html|css|js|png|svg|webmanifest)$/.test(entry.name)) ||
      (entry.isDirectory() && ['artwork','fonts','i18n','kit','vendor'].includes(entry.name))) {
    await fs.cp(path.join(source,entry.name),path.join(destination,entry.name),{recursive:true});
  }
}
const state={lang:'pt',basicsDone:true,helloSeen:true,onboarding:true,premium:false,accessToken:'',accountToken:'',profile:{name:'Duo Test',age:35,height:170,weight:70,target:70,goal:'maintain',sex:'other',activity:1.375,goalSet:true}};
const index=path.join(destination,'index.html');
await fs.writeFile(index,(await fs.readFile(index,'utf8')).replace('<script type="module"',`<script>localStorage.setItem('nutripilot_v7',${JSON.stringify(JSON.stringify(state))});location.hash='modules';</script>\n  <script type="module"`));
const configFile=path.join(native,'capacitor.config.json');
const config=JSON.parse(await fs.readFile(configFile,'utf8'));
delete config.server; // Capacitor's bundled localhost origin, no remote host or HTTP exception.
await fs.writeFile(configFile,JSON.stringify(config,null,2)+'\n');
console.log('Prepared bundled candidate UI with synthetic guest state; no account, backend or provider access granted. Not a distributable build.');
