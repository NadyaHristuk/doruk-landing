import { useEffect, useRef } from 'react';

/**
 * Hero stars — white N-pointed stars (3–6 rays) floating on canvas.
 * Near stars (high z) are larger, brighter, and react more to cursor.
 * Far stars (low z) are smaller, dimmer, and drift slowly — parallax depth.
 *
 * Uses Canvas 2D, no external libraries.
 */

// ── helpers ─────────────────────────────────────────────────────
const rand = (min, max) => Math.random() * (max - min) + min;

// ── draw an N-pointed star centered at origin, then translated ──
const INNER_RATIOS = { 3: 0.22, 4: 0.28, 5: 0.34, 6: 0.42 };

function drawStar(ctx, x, y, size, points, rotation) {
  const outer = size / 2;
  const inner = outer * (INNER_RATIOS[points] ?? 0.30);
  const step = Math.PI / points;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = i * step - Math.PI / 2; // start from top
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ── single particle ─────────────────────────────────────────────
function createParticle(w, h) {
  const angle = rand(0, Math.PI * 2);
  const z = Math.pow(Math.random(), 1.5); // 0=far, 1=near; biased toward far
  return {
    x: rand(0, w),
    y: rand(0, h),
    vx: Math.cos(angle) * rand(0.15, 0.45),
    vy: Math.sin(angle) * rand(0.15, 0.45),
    size: rand(5, 20),
    points: 3 + Math.floor(Math.random() * 4), // 3–6
    rot: rand(0, Math.PI * 2),
    rotSpeed: (Math.random() - 0.5) * 0.02,
    z,                          // depth: 0=far, 1=near
    opacityBase: rand(0.15, 0.85),
    opacityAmp: rand(0.1, 0.35),
    pulseSpeed: rand(0.8, 2.0),
    pulsePhase: rand(0, Math.PI * 2)
  };
}

// ── component ───────────────────────────────────────────────────
const HeroStars = ({ className, particleCount = 200 }) => {
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
      ? 0.2
      : isMobile
        ? 0.4
        : isLowPower
          ? 0.5
          : 0.85;
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
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      renderDpr = dpr;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
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
        const displaySize = p.size * (0.3 + p.z * 0.7);
        ctx.globalAlpha = Math.max(0.05, Math.min(1, p.opacityBase * (0.3 + p.z * 0.7)));
        drawStar(ctx, p.x, p.y, displaySize, p.points, p.rot);
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

        // ── attract toward cursor (near stars react more) ────
        if (mouseActive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < attractRadius && dist > 1) {
            const force = (1 - dist / attractRadius) * attractStrength * (0.4 + p.z * 0.6);
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        // ── drift + friction — near stars move faster (parallax) ─
        const speedScale = 0.4 + p.z * 0.6;
        p.x += p.vx * speedScale;
        p.y += p.vy * speedScale;
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.rot += p.rotSpeed;

        // ── wrap around edges ───────────────────────────────
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        // ── pulsing opacity — near stars brighter ───────────
        const pulse = Math.sin(elapsed * p.pulseSpeed * Math.PI + p.pulsePhase);
        const opacity = (p.opacityBase + pulse * p.opacityAmp) * (0.3 + p.z * 0.7);

        // ── draw N-pointed star, scaled by depth ─────────────
        const displaySize = p.size * (0.3 + p.z * 0.7);
        ctx.globalAlpha = Math.max(0.05, Math.min(1, opacity));
        drawStar(ctx, p.x, p.y, displaySize, p.points, p.rot);
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

export default HeroStars;
