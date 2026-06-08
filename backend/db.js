import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'copper_alley.db');

const db = new Database(dbPath);

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      guests TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      requests TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  // Seed demo if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM bookings').get().c;
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO bookings (id, name, email, phone, guests, date, time, requests, createdAt)
      VALUES (@id, @name, @email, @phone, @guests, @date, @time, @requests, @createdAt)
    `);
    const now = new Date().toISOString();
    const d1 = new Date(Date.now() + 86400000*2).toISOString().split('T')[0];
    const d2 = new Date(Date.now() + 86400000*5).toISOString().split('T')[0];
    insert.run({ id: 'CAB-DEMO1', name: 'Aoife Byrne', email: 'aoife@example.com', phone: '+353 87 123 4567', guests: '2', date: d1, time: '19:30', requests: 'Window seat', createdAt: now });
    insert.run({ id: 'CAB-DEMO2', name: 'Liam O\'Connor', email: 'liam@example.com', phone: '+353 86 987 6543', guests: '4', date: d2, time: '20:00', requests: '', createdAt: now });
  }
}

export function getAllBookings() {
  return db.prepare('SELECT * FROM bookings ORDER BY date ASC, time ASC').all();
}

export function createBooking(b) {
  const stmt = db.prepare(`
    INSERT INTO bookings (id, name, email, phone, guests, date, time, requests, createdAt)
    VALUES (@id, @name, @email, @phone, @guests, @date, @time, @requests, @createdAt)
  `);
  stmt.run({ ...b, createdAt: new Date().toISOString() });
}

export function deleteBooking(id) {
  db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
}