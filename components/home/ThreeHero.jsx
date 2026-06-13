'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { ArrowRight, MapPin, Loader2, Locate } from 'lucide-react';
import { CITIES } from '@/lib/constants';
import { SHIPPING_CITIES, haversineKm } from '@/lib/bikeShipping';

/* ─── Light-mode palette derived from the dark spec ─── */
const C_AMBER = '#f0a050';
const C_INK   = '#0f172a';
const C_MUTED = 'rgba(15,23,42,0.55)';
const C_FAINT = 'rgba(15,23,42,0.08)';

/* 4 floating cards anchored to the corners of the container-width stage. */
const CARD_SLOTS = [
  { className: 'top-[24px] left-0 w-[180px]',     anim: 'tlhFloat1 4s'   },
  { className: 'top-[24px] right-0 w-[180px]',    anim: 'tlhFloat2 4.6s' },
  { className: 'bottom-[24px] left-0 w-[180px]',  anim: 'tlhFloat3 4.5s' },
  { className: 'bottom-[24px] right-0 w-[180px]', anim: 'tlhFloat1 5.2s' },
];

function formatCard(ev) {
  const dateStr = ev.startDate
    ? new Date(ev.startDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : '';
  const city = ev.venue?.city || '';
  const category = ev.category
    ? ev.category.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Featured';
  // fc-top label — short hook above the title, derived from the
  // category in a human-friendly way.
  const HOOKS = {
    'Bike Ride':  'Adventure',
    Jagran:       'Devotional',
    Workshop:     'Hands-on',
    Festival:     'Multi-day',
    Food:         'Tasting',
    Concert:      'Live music',
    Comedy:       'Stand-up',
    Travel:       'Guided tour',
    Sports:       'Tournament',
    Exhibition:   'Gallery',
  };
  const top = HOOKS[category] || 'Featured';
  return {
    top,
    title: ev.title,
    sub: [dateStr, city].filter(Boolean).join(' · '),
    tag: category,
    image: ev.bannerImage || null,
    href: ev.slug ? `/events/${ev.slug}` : '#',
  };
}

function formatStatNumber(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '—';
  if (n >= 1000) return `${Math.floor(n / 1000)}K+`;
  if (n >= 10) return `${n}+`;
  return String(n);
}

/* ─── Sprite factory — each draws a white-on-transparent shape that
   vertex colors then tint to the per-particle palette. ─── */
function makeSpriteTexture(draw) {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function drawOrb(ctx, s) {
  const grd = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0,   'rgba(255,255,255,1)');
  grd.addColorStop(0.4, 'rgba(255,255,255,0.85)');
  grd.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, s, s);
}

function drawSparkle(ctx, s) {
  ctx.save();
  ctx.translate(s / 2, s / 2);
  const arm = s * 0.46;
  const waist = s * 0.07;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.shadowColor = 'rgba(255,255,255,0.8)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(0, -arm);
  ctx.quadraticCurveTo(waist, 0, 0, arm);
  ctx.quadraticCurveTo(-waist, 0, 0, -arm);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-arm, 0);
  ctx.quadraticCurveTo(0, waist, arm, 0);
  ctx.quadraticCurveTo(0, -waist, -arm, 0);
  ctx.fill();
  ctx.restore();
}

function drawTicket(ctx, s) {
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.rotate(-0.18);
  const w = s * 0.62;
  const h = s * 0.32;
  const r = h * 0.32;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.shadowColor = 'rgba(255,255,255,0.55)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(-w / 2 + r, -h / 2);
  ctx.lineTo(w / 2 - r, -h / 2);
  ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  ctx.lineTo(w / 2, h / 2 - r);
  ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  ctx.lineTo(-w / 2 + r, h / 2);
  ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  ctx.lineTo(-w / 2, -h / 2 + r);
  ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(-w / 2 + w * 0.22, 0, h * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w / 2 - w * 0.22, 0, h * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNote(ctx, s) {
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.shadowColor = 'rgba(255,255,255,0.55)';
  ctx.shadowBlur = 8;
  ctx.save();
  ctx.rotate(-0.4);
  ctx.beginPath();
  ctx.ellipse(-s * 0.12, s * 0.20, s * 0.14, s * 0.10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillRect(s * 0.03, -s * 0.30, s * 0.06, s * 0.55);
  ctx.beginPath();
  ctx.moveTo(s * 0.09, -s * 0.30);
  ctx.quadraticCurveTo(s * 0.32, -s * 0.16, s * 0.18, s * 0.02);
  ctx.quadraticCurveTo(s * 0.20, -s * 0.10, s * 0.09, -s * 0.15);
  ctx.fill();
  ctx.restore();
}

/* Match NearbyBar's geolocation logic. */
function nearestCity(lat, lng) {
  let best = null;
  let bestDist = Infinity;
  for (const c of SHIPPING_CITIES) {
    if (!CITIES.includes(c.name) && c.name !== 'Gurugram' && c.name !== 'Noida') continue;
    const d = haversineKm({ lat, lng }, c);
    if (d < bestDist) {
      bestDist = d;
      best = c.name;
    }
  }
  if (best === 'Gurugram' || best === 'Noida') best = 'Delhi';
  return best;
}

/* NearbyBar that sits inside the hero gradient. */
function HeroNearbyBar() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

  const detect = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not available in this browser.');
      return;
    }
    setBusy(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const c = nearestCity(coords.latitude, coords.longitude);
        setBusy(false);
        if (!c) {
          setError('Couldn’t match a city near you.');
          return;
        }
        setCity(c);
        router.push(`/explore?city=${encodeURIComponent(c)}`);
      },
      () => {
        setBusy(false);
        setError('Location permission denied.');
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div
      className="flex flex-col items-start justify-between gap-3 rounded-2xl border bg-white/85 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:p-5"
      style={{ borderColor: C_FAINT, pointerEvents: 'auto' }}
    >
      <div className="flex items-start gap-3">
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
          style={{ background: 'rgba(240,160,80,0.14)', color: C_AMBER }}
        >
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-base font-bold" style={{ color: C_INK }}>
            What&apos;s happening near you?
          </p>
          <p className="mt-0.5 text-sm" style={{ color: C_MUTED }}>
            {city
              ? `Showing events near ${city}.`
              : 'Use your location for an instant feed of nearby events.'}
          </p>
          {error ? (
            <p className="mt-1 text-xs" style={{ color: '#dc2626' }}>
              {error}
            </p>
          ) : null}
        </div>
      </div>
      <button
        onClick={detect}
        disabled={busy}
        className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-60"
        style={{ background: C_AMBER, color: C_INK }}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Locate className="h-4 w-4" />}
        {busy ? 'Locating…' : 'Find near me'}
      </button>
    </div>
  );
}

export default function ThreeHero({ events = [], counts }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);

    /* Event-themed sprite swarms. */
    const orbTex     = makeSpriteTexture(drawOrb);
    const sparkleTex = makeSpriteTexture(drawSparkle);
    const ticketTex  = makeSpriteTexture(drawTicket);
    const noteTex    = makeSpriteTexture(drawNote);

    const cWhite  = new THREE.Color('#94a3b8');
    const cAmber  = new THREE.Color(C_AMBER);
    const cPurple = new THREE.Color('#a855f7');
    const cPink   = new THREE.Color('#ec4899');
    const cTeal   = new THREE.Color('#06b6d4');

    const swarms = [
      { tex: orbTex,     count: 320, size: 5,  opacity: 0.65, palette: [cWhite, cWhite, cAmber] },
      { tex: sparkleTex, count: 80,  size: 14, opacity: 0.85, palette: [cAmber, cAmber, cPink] },
      { tex: ticketTex,  count: 55,  size: 22, opacity: 0.70, palette: [cAmber, cPurple] },
      { tex: noteTex,    count: 48,  size: 18, opacity: 0.70, palette: [cPurple, cTeal] },
    ];

    const swarmObjs = swarms.map(({ tex, count, size, opacity, palette }) => {
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 0] = (Math.random() - 0.5) * 18;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
        const c = palette[Math.floor(Math.random() * palette.length)];
        col[i * 3 + 0] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({
        size,
        map: tex,
        alphaMap: tex,
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        sizeAttenuation: false,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, geo, mat, tex };
    });

    /* Three orbital rings — exactly as the spec describes, but their
       colors are kept subtle so they stay legible on a white canvas. */
    const ringConfigs = [
      { radius: 2.5, color: C_AMBER,  opacity: 0.28, speed: 0.0012 },
      { radius: 3.7, color: '#a855f7', opacity: 0.20, speed: 0.0019 },
      { radius: 4.9, color: '#94a3b8', opacity: 0.14, speed: 0.0026 },
    ];
    const rings = ringConfigs.map((cfg) => {
      const geo = new THREE.TorusGeometry(cfg.radius, 0.004, 16, 200);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(cfg.color),
        transparent: true,
        opacity: cfg.opacity,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2;
      scene.add(mesh);
      return { mesh, ...cfg };
    });

    /* Subtle grid at the bottom of the scene. */
    const grid = new THREE.GridHelper(20, 24, 0xcbd5e1, 0xe2e8f0);
    grid.position.y = -3.5;
    grid.material.transparent = true;
    grid.material.opacity = 0.55;
    scene.add(grid);

    /* Lighting. */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const pointLight = new THREE.PointLight(C_AMBER, 2, 10);
    pointLight.position.set(2, 1, 3);
    scene.add(pointLight);

    /* Mouse + resize. */
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    container.addEventListener('mousemove', onMove);

    const onResize = () => {
      width  = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    window.addEventListener('resize', onResize);

    let t = 0;
    let raf;
    const tick = () => {
      t += 0.008;
      swarmObjs.forEach((s, i) => {
        s.points.rotation.y = t * (0.04 + i * 0.012) + mouse.current.x * 0.05;
        s.points.rotation.x = mouse.current.y * 0.03 + Math.sin(t * 0.4 + i) * 0.02;
      });

      rings.forEach((r, i) => {
        r.mesh.rotation.z += r.speed;
        r.mesh.rotation.x = Math.PI / 2 + Math.sin(t * 0.3 + i) * 0.2;
      });

      pointLight.position.x = Math.sin(t * 0.5) * 3;
      pointLight.position.y = Math.cos(t * 0.3) * 2;

      camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.03;
      camera.position.y += (mouse.current.y * 0.2 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      swarmObjs.forEach((s) => {
        s.geo.dispose();
        s.mat.dispose();
        s.tex.dispose();
      });
      rings.forEach((r) => {
        r.mesh.geometry.dispose();
        r.mesh.material.dispose();
      });
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.dispose();
    };
  }, []);

  const cards = events.map(formatCard);
  const cornerCards = cards.slice(0, 4);

  const statValues = [
    { val: formatStatNumber(counts?.events), label: 'Events' },
    { val: formatStatNumber(counts?.cities), label: 'Cities' },
    { val: '< 2 min',                        label: 'To Book' },
  ];

  return (
    <section
      ref={containerRef}
      className="relative -mt-[68px] w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 80% at 50% 0%, #ffffff 0%, #fafaff 55%, #f4f0fb 100%)',
      }}
    >
      <style>{`
        @keyframes tlhFloat1  { 0%,100% { transform: translateY(0); }    50% { transform: translateY(-12px); } }
        @keyframes tlhFloat2  { 0%,100% { transform: translateY(-6px); } 50% { transform: translateY(8px); } }
        @keyframes tlhFloat3  { 0%,100% { transform: translateY(4px); }  50% { transform: translateY(-10px); } }
        @keyframes tlhPulse   { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.6); opacity: 0.3; } }
        @keyframes tlhMarquee { from { transform: translateX(0); }       to { transform: translateX(-50%); } }
      `}</style>

      {/* ── HERO STAGE (3D bg + corner cards + centred text) ── */}
      <div className="relative w-full" style={{ height: 560, paddingTop: 68 }}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Inner container keeps the corner cards inside the page width,
            instead of letting them stick to the viewport edges. */}
        <div className="container-page relative h-full">
        {/* Floating corner cards — 4 corners, container-width. */}
        {cornerCards.map((card, i) => {
          const slot = CARD_SLOTS[i];
          if (!slot) return null;
          return (
            <Link
              key={card.href + i}
              href={card.href}
              className={`absolute z-[5] block ${slot.className}`}
              style={{
                animation: `${slot.anim} ease-in-out infinite`,
                pointerEvents: 'auto',
              }}
            >
              <div
                className="overflow-hidden rounded-[14px] border bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md"
                style={{ borderColor: C_FAINT }}
              >
                {card.image ? (
                  <div className="relative h-[70px] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="px-3 py-2.5">
                  <p
                    className="text-[10px] font-semibold uppercase"
                    style={{ letterSpacing: '0.08em', color: 'rgba(15,23,42,0.45)' }}
                  >
                    {card.top}
                  </p>
                  <p
                    className="mt-0.5 line-clamp-1 text-[14px] font-semibold"
                    style={{ color: C_INK }}
                  >
                    {card.title}
                  </p>
                  {card.sub ? (
                    <p className="mt-0.5 line-clamp-1 text-[11px]" style={{ color: C_MUTED }}>
                      {card.sub}
                    </p>
                  ) : null}
                  {card.tag ? (
                    <span
                      className="mt-2 inline-block rounded-full border px-2 py-[2px] text-[10px] font-semibold"
                      style={{
                        background: 'rgba(240,160,80,0.18)',
                        color: C_AMBER,
                        borderColor: 'rgba(240,160,80,0.25)',
                      }}
                    >
                      {card.tag}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Centred hero content. */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ pointerEvents: 'none' }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
            style={{
              background: 'rgba(240,160,80,0.08)',
              borderColor: 'rgba(240,160,80,0.30)',
              color: C_AMBER,
            }}
          >
            <span
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: C_AMBER, animation: 'tlhPulse 1.8s ease-in-out infinite' }}
            />
            <span
              className="text-[11px] font-semibold uppercase"
              style={{ letterSpacing: '0.12em' }}
            >
              India&apos;s Premium Event Ecosystem
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-6 font-display text-[40px] font-bold leading-[1.1] sm:text-[48px]"
            style={{ color: C_INK }}
          >
            Discover &amp; Book
            <br />
            <span style={{ color: C_AMBER }}>Events in 2 min</span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-[15px]" style={{ color: C_MUTED }}>
            <span style={{ color: 'rgba(15,23,42,0.78)', fontWeight: 600 }}>No hassle</span>
            {' · '}
            <span style={{ color: 'rgba(15,23,42,0.78)', fontWeight: 600 }}>No paperwork</span>
            {' · QR entry'}
          </p>

          {/* CTAs */}
          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
            style={{ pointerEvents: 'auto' }}
          >
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-[13px] text-[14px] font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-800"
            >
              Explore Events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin-register"
              className="inline-flex items-center gap-2 rounded-full border px-7 py-[13px] text-[14px] font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.85)',
                color: C_INK,
                borderColor: 'rgba(15,23,42,0.20)',
                backdropFilter: 'blur(6px)',
              }}
            >
              Become Organizer
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-7 flex items-center">
            {statValues.map(({ val, label }, idx) => (
              <div
                key={label}
                className="px-5 text-center first:pl-0 last:pr-0 sm:px-7"
                style={{
                  borderColor: 'rgba(15,23,42,0.10)',
                  borderLeftWidth: idx === 0 ? 0 : 1,
                  borderLeftStyle: 'solid',
                }}
              >
                <p
                  className="font-display text-[22px] font-bold"
                  style={{ color: C_INK }}
                >
                  {val}
                </p>
                <p
                  className="mt-0.5 text-[10px] font-semibold uppercase"
                  style={{ letterSpacing: '0.10em', color: 'rgba(15,23,42,0.45)' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* ── Right-to-left marquee of real featured events. ── */}
      {cards.length > 0 ? (
        <div className="relative z-10 w-full overflow-hidden py-6">
          <div
            className="flex w-max gap-5"
            style={{
              animation: `tlhMarquee ${Math.max(28, cards.length * 8)}s linear infinite`,
            }}
          >
            {[...cards, ...cards].map((card, i) => (
              <Link
                key={`${card.href}-${i}`}
                href={card.href}
                className="block w-[280px] shrink-0 overflow-hidden rounded-2xl border bg-white/90 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition-transform hover:-translate-y-1"
                style={{ borderColor: C_FAINT }}
              >
                {card.image ? (
                  <div className="relative h-[150px] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span
                      className="absolute left-3 top-3 rounded-full px-2.5 py-[3px] text-[10px] font-semibold uppercase backdrop-blur-md"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        color: C_INK,
                        letterSpacing: '0.10em',
                      }}
                    >
                      {card.tag}
                    </span>
                  </div>
                ) : null}
                <div className="px-4 py-3">
                  <p
                    className="line-clamp-1 text-[15px] font-semibold"
                    style={{ color: C_INK }}
                  >
                    {card.title}
                  </p>
                  {card.sub ? (
                    <p className="mt-1 line-clamp-1 text-[12px]" style={{ color: C_MUTED }}>
                      {card.sub}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── NearbyBar lives inside the hero gradient. ── */}
      <div className="container-page relative">
        <div className="relative z-10 pb-10 pt-2">
          <HeroNearbyBar />
        </div>
      </div>
    </section>
  );
}
