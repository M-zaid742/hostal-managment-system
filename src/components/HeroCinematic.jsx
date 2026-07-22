import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/heroCinematic.css';
import { apiGet } from '../api/client.js';

const ROWS = 6;
const COLS = 8;
const TOTAL = ROWS * COLS;

function RoomGrid({ statuses }) {
  const cells = [];
  let idx = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const status = statuses[idx] || 'occupied';
      cells.push(
        <rect
          key={idx}
          className={`room room-${status}`}
          data-index={idx}
          x={c * 20}
          y={r * 14}
          rx={2}
          ry={2}
          width={18}
          height={12}
        />
      );
      idx++;
    }
  }

  return (
    <svg className="iso-svg" viewBox={`0 0 ${COLS * 20} ${ROWS * 14}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="iso-group" filter="url(#softGlow)">
        {cells}
        {/* character as svg circle - hidden until animate */}
        <circle id="hero-char" cx="0" cy="0" r="3" fill="#ffffff" opacity="0" />
      </g>
    </svg>
  );
}

export default function HeroCinematic() {
  const wrapper = useRef(null);
  const gridRef = useRef(null);
  const tlRef = useRef(null);

  const [statuses, setStatuses] = useState(() =>
    Array.from({ length: TOTAL }).map((_, i) => {
      if (i < 6) return 'available';
      if (i >= 44 && i < 47) return i === 46 ? 'checkout' : 'reserved';
      return 'occupied';
    })
  );

  const [stats, setStats] = useState({ total: TOTAL, available: 0, occupied: 0 });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const root = wrapper.current;
    const rooms = root.querySelectorAll('.room');
    const char = root.querySelector('#hero-char');
    const revenueEl = root.querySelector('.counter-revenue .card-value');
    const bookingBars = root.querySelectorAll('.booking-bar');

    // populate particles
    const particles = root.querySelector('.particles');
    if (particles && particles.childElementCount === 0) {
      for (let i = 0; i < 30; i++) {
        const d = document.createElement('div');
        d.className = 'p-dot';
        d.style.left = Math.random() * 100 + '%';
        d.style.top = Math.random() * 100 + '%';
        particles.appendChild(d);
      }
    }

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Respect reduced motion: set static final state
      rooms.forEach((r) => r.setAttribute('opacity', '1'));
      root.querySelectorAll('.ui-card').forEach((c) => { c.style.opacity = '1'; c.style.transform = 'none'; });
      if (revenueEl) revenueEl.textContent = '12,500';
      if (char) char.setAttribute('opacity', '0');
      return; // skip animations
    }

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } });
    tlRef.current = tl;

    // 0-2s: camera pullback (scale) + rooms light up one by one
    tl.to(root, { duration: 2, scale: 1, ease: 'power1.out' }, 0);
    rooms.forEach((r, i) => {
      const delay = (i / rooms.length) * 2; // spread over 2s
      tl.to(r, { attr: { opacity: 1 }, duration: 0.15 }, delay);
    });

    // 2-4s: popup UI cards
    tl.to(root.querySelectorAll('.ui-card'), { y: -10, autoAlpha: 1, stagger: 0.12, duration: 0.5 }, 2);

    // 4-6s: door-open + character walks + room turns red
    // pick a green room (first available)
    const firstAvailable = Array.from(rooms).find((n) => n.classList.contains('room-available'));
    if (firstAvailable) {
      // compute center of room in SVG coords
      const rx = parseFloat(firstAvailable.getAttribute('x')) + parseFloat(firstAvailable.getAttribute('width')) / 2;
      const ry = parseFloat(firstAvailable.getAttribute('y')) + parseFloat(firstAvailable.getAttribute('height')) / 2;

      // reveal and move character to room
      tl.to(char, { attr: { opacity: 1 }, duration: 0.12 }, 4.0);
      tl.to(char, { attr: { cx: rx, cy: ry }, duration: 0.9, ease: 'power2.inOut' }, 4.05);

      // room pulses and becomes occupied
      tl.to(firstAvailable, { attr: { opacity: 1 }, duration: 0.12 }, 4.05);
      tl.to(firstAvailable, { attr: { class: 'room room-occupied' }, duration: 0.2 }, 4.9);
      tl.to(char, { attr: { opacity: 0 }, duration: 0.3 }, 5.2);
    }

    // 6-8s: counters increase animation
    if (revenueEl) {
      const obj = { value: 0 };
      tl.to(obj, { value: 12500, duration: 1, onUpdate() { revenueEl.textContent = Math.floor(obj.value).toLocaleString(); } }, 6.1);
    }

    // booking graph bars animate
    if (bookingBars && bookingBars.length) {
      bookingBars.forEach((bar, i) => {
        const target = 20 + Math.round(Math.random() * 60);
        tl.to(bar, { height: target, duration: 0.8, ease: 'power2.out' }, 6.2 + i * 0.04);
      });
    }

    // 8-10s: orbit (rotate) + particles
    tl.to(root.querySelector('.iso-svg'), { rotation: 360, transformOrigin: '50% 50%', duration: 2, ease: 'none' }, 8);

    // notification ping
    const notif = root.querySelector('.notif-ping');
    if (notif) {
      tl.to(notif, { scale: 1.2, opacity: 1, duration: 0.12, yoyo: true, repeat: 3 }, 6.9);
    }

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  // keyboard shortcut: Space or 'P' toggles animation
  useEffect(() => {
    function onKey(e) {
      if (e.code === 'Space' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePause();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function togglePause() {
    const tl = tlRef.current;
    if (!tl) return;
    const newPaused = !tl.paused();
    tl.paused(newPaused);
    setIsPaused(newPaused);
  }

  // Fetch live room statuses and update grid
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await apiGet('/rooms');
        if (cancelled) return;
        // transform server rooms into grid statuses (simple mapping)
        const mapped = Array.from({ length: TOTAL }).map((_, i) => {
          const room = data[i];
          if (!room) return 'occupied';
          if (room.status) return room.status.toLowerCase();
          if (room.occupied) return 'occupied';
          return 'available';
        });
        setStatuses(mapped);
        const available = mapped.filter((s) => s === 'available').length;
        const occupied = mapped.filter((s) => s === 'occupied').length;
        setStats({ total: TOTAL, available, occupied });
      } catch (err) {
        // silent fail — keep default statuses
        // console.warn('Hero: failed to load rooms', err.message);
      }
    }

    load();
    const iv = setInterval(load, 30_000); // refresh every 30s
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, []);

  return (
    <section
      className="hero-cinematic"
      role="region"
      aria-label={`RoomFlow cinematic hero — ${stats.available || 0} available, ${stats.occupied || 0} occupied`}
    >
      <div className="hero-inner" ref={wrapper}>
        <div className="ui-overlay">
          <div className="brand">
            <h1>RoomFlow</h1>
            <p className="tag">Manage Smarter. Host Better.</p>
          </div>

          <div className="ui-cards">
            <div className="ui-card glass">
              <div className="card-title">Occupancy</div>
              <div className="card-value" aria-live="polite">{Math.round((stats.occupied / Math.max(1, stats.total)) * 100)}% Occupied</div>
            </div>
            <div className="ui-card glass">
              <div className="card-title">Rooms</div>
              <div className="card-value" aria-live="polite">{stats.total} total • {stats.available} available</div>
            </div>
            <div className="ui-card glass counter-revenue">
              <div className="card-title">Revenue</div>
              <div className="card-value" aria-live="polite">0</div>
            </div>
          </div>
          <div className="hero-controls" aria-hidden={false}>
            <button
              className="control-btn"
              onClick={() => togglePause()}
              aria-pressed={isPaused}
              aria-label={isPaused ? 'Resume hero animations' : 'Pause hero animations'}
            >
              {isPaused ? 'Play' : 'Pause'}
            </button>
            <a className="cta-btn" href="/hostels" aria-label="Explore Hostels">Explore Hostels</a>
          </div>
        </div>

        <div className="iso-wrap" ref={gridRef}>
          <RoomGrid statuses={statuses} />
          <div className="particles" aria-hidden />
        </div>
      </div>
    </section>
  );
}
