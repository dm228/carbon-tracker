import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../data/carbon-log.json');
const adapter = new JSONFile(file);
const db = new Low(adapter,{users: []});

// Initial load + default schema setup
await db.read();

// Setup default structure if file is empty
db.data ||= {
  users: []
};

await db.write();

export default db;
