import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "data.sqlite"));

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    trackId TEXT,
    trackTitle TEXT,
    price REAL,
    nombre TEXT,
    email TEXT,
    txHash TEXT,
    proofFilename TEXT,
    status TEXT DEFAULT 'pending',
    downloadLink TEXT DEFAULT '',
    createdAt TEXT
  );
`);

export default db;
