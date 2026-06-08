import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB, getAllBookings, createBooking, deleteBooking } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Init DB
initDB();

// API Routes
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/bookings', (req, res) => {
  try {
    const { name, email, phone, guests, date, time, requests } = req.body;
    if (!name || !email || !phone || !guests || !date || !time) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const id = 'CAB-' + Math.random().toString(36).slice(2,7).toUpperCase();
    const booking = { id, name, email, phone, guests, date, time, requests: requests || '' };
    createBooking(booking);
    res.status(201).json({ success: true, data: booking });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.delete('/api/bookings/:id', (req, res) => {
  try {
    deleteBooking(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Serve frontend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Copper Alley Bistro running at http://localhost:${PORT}`);
});