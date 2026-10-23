import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { snapshot, encryptSnapshot, decryptSnapshot, restoreBackup } from './backup.mjs';
const [command, input, output] = process.argv.slice(2);
try {
  if (command === 'keygen' && input) {
    await fs.writeFile(input, crypto.randomBytes(32).toString('hex'), { flag: 'wx', mode: 0o600 });
    console.log('Recovery key saved. Keep an independent copy in your password manager.');
  } else {
    const key = process.env.BACKUP_KEY_FILE ? (await fs.readFile(process.env.BACKUP_KEY_FILE, 'utf8')).trim() : process.env.BACKUP_ENCRYPTION_KEY;
    if (command === 'create' && input && output) {
      const buffer = encryptSnapshot(await snapshot(input), key); decryptSnapshot(buffer, key);
      await fs.writeFile(output, buffer, { flag: 'wx', mode: 0o600 }); console.log('Encrypted backup created and verified.');
    } else if (command === 'verify' && input) {
      const value = decryptSnapshot(await fs.readFile(input), key); console.log(JSON.stringify({ createdAt: value.createdAt, files: value.entries.length }));
    } else if (command === 'restore' && input && output) {
      console.log(JSON.stringify(await restoreBackup(await fs.readFile(input), key, output)));
    } else throw new Error('Usage: backup-cli.mjs keygen KEY_FILE | create DATA_DIR OUTPUT | verify BACKUP | restore BACKUP NEW_DIR');
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
