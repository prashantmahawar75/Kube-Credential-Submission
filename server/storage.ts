import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import path from "path";

export interface StoredCredential {
  id: string;
  credentialHash: string;
  credentialData: string;
  workerId: string;
  issuedAt: string;
}

export interface IStorage {
  // Issuance operations
  getCredentialByHash(hash: string): StoredCredential | undefined;
  storeCredential(credentialHash: string, credentialData: string, workerId: string): StoredCredential;
  
  // Verification operations
  verifyCredential(credentialHash: string): StoredCredential | undefined;
}

export class SQLiteStorage implements IStorage {
  private db: Database.Database;

  constructor(dbPath: string = path.join(process.cwd(), "credentials.db")) {
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS credentials (
        id TEXT PRIMARY KEY,
        credentialHash TEXT UNIQUE NOT NULL,
        credentialData TEXT NOT NULL,
        workerId TEXT NOT NULL,
        issuedAt TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_credential_hash ON credentials(credentialHash);
    `);
  }

  getCredentialByHash(hash: string): StoredCredential | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM credentials WHERE credentialHash = ?
    `);
    return stmt.get(hash) as StoredCredential | undefined;
  }

  storeCredential(credentialHash: string, credentialData: string, workerId: string): StoredCredential {
    const id = randomUUID();
    const issuedAt = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO credentials (id, credentialHash, credentialData, workerId, issuedAt)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, credentialHash, credentialData, workerId, issuedAt);
    
    return {
      id,
      credentialHash,
      credentialData,
      workerId,
      issuedAt,
    };
  }

  verifyCredential(credentialHash: string): StoredCredential | undefined {
    return this.getCredentialByHash(credentialHash);
  }

  close(): void {
    this.db.close();
  }
}

export const storage = new SQLiteStorage();
