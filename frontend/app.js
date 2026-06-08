// Mobile menu
document.getElementById('menuBtn').onclick = () => {
  document.getElementById('mobileMenu').classList.toggle('open');
};

// Reveal
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('in');
}), { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Nav btn show on scroll
const navBtn = document.getElementById('navBtn');
window.addEventListener('scroll', () => {
  navBtn.style.display = window.scrollY > 400 ? 'inline-flex' : 'none';
});

// Date min
const dateInput = document.querySelector('input[name="date"]');
dateInput.min = new Date().toISOString().split('T')[0];

// API
const API = '/api/bookings';
const form = document.getElementById('bookingForm');
const successBox = document.getElementById('successBox');
const upcomingList = document.getElementById('upcomingList');
const adminTable = document.getElementById('adminTable');
const adminPanel = document.getElementById('adminPanel');
document.getElementById('adminToggle').onclick = () => {
  adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
};

async function fetchBookings() {
  const res = await fetch(API);
  const { data } = await res.json();
  return data || [];
}

function renderBookings(list) {
  const now = new Date();
  const upcoming = list.filter(b => new Date(b.date + 'T' + b.time) >= now).slice(0, 3);
  upcomingList.innerHTML = upcoming.length ? upcoming.map(b => `
    <div class="upcoming-item">
      <div><div style="font-weight:600">${b.name} • ${b.guests} guests</div><div style="font-size:.85rem;color:rgba(248,245,240,.6)">${new Date(b.date).toLocaleDateString('en-IE',{weekday:'short',month:'short',day:'numeric'})} at ${b.time}</div></div>
      <span class="badge">${b.id}</span>
    </div>`).join('') : '<p style="color:rgba(248,245,240,.5)">No upcoming bookings</p>';

  adminTable.innerHTML = list.map(b => `
    <tr>
      <td style="font-family:monospace;font-size:.8rem">${b.id}</td>
      <td>${b.name}<br><span style="color:rgba(248,245,240,.5);font-size:.8rem">${b.email}</span></td>
      <td style="font-size:.85rem">${b.date} ${b.time}</td>
      <td>${b.guests}</td>
      <td style="text-align:right"><button data-del="${b.id}">Delete</button></td>
    </tr>`).join('');
}

async function load() {
  const data = await fetchBookings();
  renderBookings(data);
}
load();

adminTable.addEventListener('click', async e => {
  const btn = e.target.closest('[data-del]');
  if (!btn) return;
  await fetch(`${API}/${btn.dataset.del}`, { method: 'DELETE' });
  load();
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  document.querySelectorAll('.error').forEach(el => el.classList.remove('show'));
  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());

  let ok = true;
  if (!payload.name || payload.name.length < 2) {
    document.querySelector('[data-error="name"]').textContent = 'Name required';
    document.querySelector('[data-error="name"]').classList.add('show');
    ok = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    document.querySelector('[data-error="email"]').textContent = 'Valid email required';
    document.querySelector('[data-error="email"]').classList.add('show');
    ok = false;
  }
  if (!ok) return;

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const { data } = await res.json();
  successBox.innerHTML = `<strong>Reservation confirmed!</strong><br>Your booking ID is <b>${data.id}</b>. Confirmation sent to ${data.email}.`;
  successBox.classList.add('show');
  form.reset();
  load();
});
