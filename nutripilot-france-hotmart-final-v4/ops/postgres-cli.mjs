// Explicit offline operations only. Runtime never creates or migrates database tables.
import fs from 'node:fs/promises';
import { Pool } from 'pg';
import { PostgresStore, postgresOptions, initializePostgresSchema, importLegacySnapshot } from './postgres-store.mjs';
import { decryptSnapshot } from './backup.mjs';
const [command,input]=process.argv.slice(2);
let pool;
try {
 if(!['schema','import'].includes(command)||!process.argv.includes('--apply'))throw new Error('Use schema --apply, or import ENCRYPTED_BACKUP --apply --offline-backup-verified');
 if(command==='import'&&(!input||!process.argv.includes('--offline-backup-verified')))throw new Error('Verified independent backup and offline cutover acknowledgement required');
 const options=postgresOptions();if(options.ssl&&process.env.DATABASE_CA_FILE)options.ssl.ca=await fs.readFile(process.env.DATABASE_CA_FILE,'utf8');
 pool=new Pool(options);pool.on('error',()=>{});
 if(command==='schema'){await initializePostgresSchema(pool);console.log('Schema prepared; storage has not been switched.');}
 else {
  const key=process.env.BACKUP_KEY_FILE?(await fs.readFile(process.env.BACKUP_KEY_FILE,'utf8')).trim():process.env.BACKUP_ENCRYPTION_KEY;
  const value=decryptSnapshot(await fs.readFile(input),key);const store=new PostgresStore(pool);await store.checkSchema();
  console.log(JSON.stringify(await importLegacySnapshot(store,value)));
 }
}catch {console.error('Database operation refused or failed. Check flags, TLS, schema, verified backup and an empty destination. Credentials and customer data are not logged.');process.exitCode=1;}
finally {if(pool)await pool.end();}
