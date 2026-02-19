import { useEffect, useRef } from 'react';

/**
 * Particle "jellyfish" effect — white 4-pointed stars floating on canvas,
 * drifting toward the mouse cursor like a swarm.
 * Stars pulse opacity like the hero background stars layer.
 *
 * Uses Canvas 2D.
 */

// ── helpers ─────────────────────────────────────────────────────
const rand = (min, max) => Math.random() * (max - min) + min;

// ── draw a 4-pointed star (same shape as stars.svg symbol) ──────
//  M12 0  L12.8 10.5  L24 12  L12.8 13.5  L12 24  L11.2 13.5  L0 12  L11.2 10.5 Z
//  Normalized to unit size (-0.5 … +0.5), then scaled by `size`.
function drawStar(ctx, x, y, size) {
  const s = size / 2;
  const n = size * 0.033; // narrow arm width (0.8/24 ≈ 0.033)
  ctx.beginPath();
  ctx.moveTo(x, y - s);         // top
  ctx.lineTo(x + n, y - n * 1.2);
  ctx.lineTo(x + s, y);         // right
  ctx.lineTo(x + n, y + n * 1.2);
  ctx.lineTo(x, y + s);         // bottom
  ctx.lineTo(x - n, y + n * 1.2);
  ctx.lineTo(x - s, y);         // left
  ctx.lineTo(x - n, y - n * 1.2);
  ctx.closePath();
  ctx.fill();
}

// ── single particle ─────────────────────────────────────────────
function createParticle(w, h) {
  const angle = rand(0, Math.PI * 2);
  return {
    x: rand(0, w),
    y: rand(0, h),
    vx: Math.cos(angle) * rand(0.15, 0.45),
    vy: Math.sin(angle) * rand(0.15, 0.45),
    size: rand(4, 18),
    // pulsing opacity — each star has its own phase & period
    opacityBase: rand(0.15, 0.85),
    opacityAmp: rand(0.1, 0.35),
    pulseSpeed: rand(0.8, 2.0), // full cycles per ~2.5s
    pulsePhase: rand(0, Math.PI * 2)
  };
}

// ── component ───────────────────────────────────────────────────
const ParticleJellyfish = ({ className, particleCount = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduce =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deviceMemory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const isLowPower = deviceMemory <= 4 || cores <= 4;
    const isMobile =
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: coarse)').matches) ||
      window.innerWidth < 768;
    const isMobileViewport = () => window.innerWidth < 768;
    const qualityFactor = prefersReduce
      ? 0.2  // Reduced from 0.35
      : isMobile
        ? 0.4  // Reduced from 0.55
        : isLowPower
          ? 0.5  // Reduced from 0.7
          : 0.85;  // Reduced from 1.0
    const targetCount = Math.max(40, Math.round(particleCount * qualityFactor));
    const maxDpr = isLowPower || isMobile ? 1.25 : 1.5;

    const ctx = canvas.getContext('2d');
    let animId;
    let mouse = { x: -9999, y: -9999 };
    let particles = [];
    let startTime = performance.now();
    let isVisible = true;
    let observer;
    let renderDpr = 1;

    // ── resize ────────────────────────────────────────────────
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      renderDpr = dpr;
      const rect = parent.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || (isMobileViewport() ? window.innerHeight * 0.5 : window.innerHeight);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ── init particles ────────────────────────────────────────
    const init = () => {
      resize();
      const w = canvas.width / renderDpr;
      const h = canvas.height / renderDpr;
      particles = Array.from({ length: targetCount }, () =>
        createParticle(w, h)
      );
    };

    // ── mouse tracking ────────────────────────────────────────
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const drawOnce = () => {
      const w = canvas.width / renderDpr;
      const h = canvas.height / renderDpr;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.globalAlpha = Math.max(0.05, Math.min(1, p.opacityBase));
        drawStar(ctx, p.x, p.y, p.size);
      }
      ctx.globalAlpha = 1;
    };

    // ── draw one frame ────────────────────────────────────────
    const draw = (now) => {
      if (!isVisible) return;
      const elapsed = (now - startTime) / 1000;
      const w = canvas.width / renderDpr;
      const h = canvas.height / renderDpr;
      ctx.clearRect(0, 0, w, h);

      const mouseActive = mouse.x > -999;
      const attractRadius = 250;
      const attractStrength = 0.008;

      ctx.fillStyle = '#ffffff';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // ── attract toward cursor ───────────────────────────
        if (mouseActive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < attractRadius && dist > 1) {
            const force = (1 - dist / attractRadius) * attractStrength;
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        // ── drift + friction ────────────────────────────────
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;

        // ── wrap around edges ───────────────────────────────
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        // ── pulsing opacity (like CSS animation in stars.svg) ─
        const pulse = Math.sin(elapsed * p.pulseSpeed * Math.PI + p.pulsePhase);
        const opacity = p.opacityBase + pulse * p.opacityAmp;

        // ── draw 4-pointed star ─────────────────────────────
        ctx.globalAlpha = Math.max(0.05, Math.min(1, opacity));
        drawStar(ctx, p.x, p.y, p.size);
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (animId) return;
      animId = requestAnimationFrame(draw);
    };

    const stop = () => {
      if (!animId) return;
      cancelAnimationFrame(animId);
      animId = 0;
    };

    // ── bootstrap ─────────────────────────────────────────────
    init();
    if (prefersReduce) {
      drawOnce();
    } else {
      start();
    }

    const enableMouse =
      !prefersReduce &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: fine)').matches;
    if (enableMouse) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
    }

    window.addEventListener('resize', resize);

    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((entry) => entry.isIntersecting);
          if (prefersReduce) return;
          if (isVisible) start();
          else stop();
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    }

    return () => {
      stop();
      if (enableMouse) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
      }
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

export default ParticleJellyfish;
