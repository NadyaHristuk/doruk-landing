import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// ── constants ─────────────────────────────────────────────────────
const GRAVITY       = 2.5;
const SPEED_COEFF   = 80;
const ORBIT_FORCE   = 0.002;   // perpendicular kick → stars orbit cursor
const FRICTION      = 0.992;
const MAX_SPEED     = 6;
const TWINKLE_SPEED = 0.015;
const ATTRACT_R     = 200;     // px — cursor attraction radius
const LOD_THRESHOLD = 0.3;     // z below this → dot instead of crystal

// ── helpers ───────────────────────────────────────────────────────
const rand = (min, max) => Math.random() * (max - min) + min;

const INNER_RATIOS = { 3: 0.22, 4: 0.28, 5: 0.34, 6: 0.42 };

function drawStar(ctx, x, y, size, points, rotation) {
  const outer = size / 2;
  const inner = outer * (INNER_RATIOS[points] ?? 0.30);
  const step  = Math.PI / points;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r     = i % 2 === 0 ? outer : inner;
    const angle = i * step - Math.PI / 2;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else         ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function createParticle(w, h) {
  const z     = Math.pow(Math.random(), 1.5); // 0=far … 1=near, biased toward far
  const angle = rand(0, Math.PI * 2);
  return {
    x:          rand(0, w),
    y:          rand(0, h),
    vx:         Math.cos(angle) * rand(0.15, 0.45),
    vy:         Math.sin(angle) * rand(0.15, 0.45),
    size:       rand(5, 20),
    r:          rand(0.4, 0.8),            // radius for LOD dot
    points:     3 + Math.floor(Math.random() * 4),
    rot:        rand(0, Math.PI * 2),
    rotSpeed:   (Math.random() - 0.5) * 0.02,
    tw:         rand(0, Math.PI * 2),      // twinkle phase
    z,
    opacityBase: rand(0.15, 0.85),
    opacityAmp:  rand(0.10, 0.35),
  };
}

// ── component ────────────────────────────────────────────────────
const HeroStars = ({ className, particleCount = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── quality / capability detection ──────────────────────────
    const prefersReduce =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const deviceMemory = navigator.deviceMemory || 4;
    const cores        = navigator.hardwareConcurrency || 4;
    const isLowPower   = deviceMemory <= 4 || cores <= 4;
    const isMobile     =
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: coarse)').matches) ||
      window.innerWidth < 768;

    const qualityFactor = prefersReduce ? 0.2 : isMobile ? 0.4 : isLowPower ? 0.5 : 0.85;
    const targetCount   = Math.max(40, Math.round(particleCount * qualityFactor));
    const maxDpr        = isLowPower || isMobile ? 1.25 : 1.5;

    const ctx = canvas.getContext('2d');
    let mouse      = { x: null, y: null };
    let particles  = [];
    let isVisible  = true;
    let observer;
    let renderDpr  = 1;

    // ── resize ──────────────────────────────────────────────────
    const resize = () => {
      const dpr  = Math.min(window.devicePixelRatio || 1, maxDpr);
      renderDpr  = dpr;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width  = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ── init particles ──────────────────────────────────────────
    const init = () => {
      resize();
      const w = canvas.width  / renderDpr;
      const h = canvas.height / renderDpr;
      particles = Array.from({ length: targetCount }, () => createParticle(w, h));
    };

    // ── static frame for reduced-motion ─────────────────────────
    const drawOnce = () => {
      const w = canvas.width  / renderDpr;
      const h = canvas.height / renderDpr;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      for (const p of particles) {
        ctx.globalAlpha = Math.max(0.05, p.opacityBase * (0.3 + p.z * 0.7));
        if (p.z < LOD_THRESHOLD) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(ctx, p.x, p.y, p.size * (0.3 + p.z * 0.7), p.points, p.rot);
        }
      }
      ctx.globalAlpha = 1;
    };

    // ── GSAP ticker callback ─────────────────────────────────────
    const tick = () => {
      if (!isVisible) return;

      const w = canvas.width  / renderDpr;
      const h = canvas.height / renderDpr;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';

      const mouseActive = mouse.x !== null;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // ── orbital cursor attraction ───────────────────────────
        if (mouseActive) {
          const dx     = mouse.x - p.x;
          const dy     = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < ATTRACT_R * ATTRACT_R) {
            const invDist = 1 / Math.sqrt(distSq + 1e-8);
            const force   = (GRAVITY * SPEED_COEFF) / (distSq + 80);
            // radial pull + perpendicular kick = orbit
            p.vx += dx * invDist * force - dy * invDist * ORBIT_FORCE;
            p.vy += dy * invDist * force + dx * invDist * ORBIT_FORCE;
          }
        }

        // ── friction + speed cap ─────────────────────────────────
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        const speedSq = p.vx * p.vx + p.vy * p.vy;
        if (speedSq > MAX_SPEED * MAX_SPEED) {
          const k = MAX_SPEED / Math.sqrt(speedSq);
          p.vx *= k;
          p.vy *= k;
        }

        // ── move with parallax depth ────────────────────────────
        const depthScale = 0.4 + p.z * 0.6;
        p.x  += p.vx * depthScale;
        p.y  += p.vy * depthScale;
        p.rot += p.rotSpeed;
        p.tw  += TWINKLE_SPEED;

        // ── wrap around canvas edges ────────────────────────────
        if (p.x < -30)    p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30)    p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        // ── opacity: far stars flicker, near stars pulse ─────────
        const base  = p.z < LOD_THRESHOLD
          ? 0.5 + Math.random() * 0.5          // far: random flicker
          : 0.5 + Math.sin(p.tw) * 0.5;       // near: smooth sine
        const alpha = base * (0.3 + p.z * 0.7);

        ctx.globalAlpha = Math.max(0.05, Math.min(1, alpha));

        // ── LOD: dot for far stars, crystal for near ─────────────
        if (p.z < LOD_THRESHOLD) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(ctx, p.x, p.y, p.size * depthScale, p.points, p.rot);
        }
      }

      ctx.globalAlpha = 1;
    };

    // ── mouse events (on window — canvas is covered by other layers) ──
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // ── bootstrap ────────────────────────────────────────────────
    init();

    if (prefersReduce) {
      drawOnce();
    } else {
      gsap.ticker.add(tick);
    }

    if (!prefersReduce) {
      window.addEventListener('mousemove',  onMouseMove);
      window.addEventListener('mouseleave', onMouseLeave);
    }

    window.addEventListener('resize', resize);

    // ── pause when off-screen ────────────────────────────────────
    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((e) => e.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    }

    // ── cleanup ──────────────────────────────────────────────────
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
};

export default HeroStars;
