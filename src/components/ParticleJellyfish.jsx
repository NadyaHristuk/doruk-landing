import { useEffect, useRef } from 'react';

const rand = (min, max) => Math.random() * (max - min) + min;

function drawStar(ctx, x, y, size) {
  const s = size / 2;
  const n = size * 0.033; 
  ctx.beginPath();
  ctx.moveTo(x, y - s);         
  ctx.lineTo(x + n, y - n * 1.2);
  ctx.lineTo(x + s, y);         
  ctx.lineTo(x + n, y + n * 1.2);
  ctx.lineTo(x, y + s);         
  ctx.lineTo(x - n, y + n * 1.2);
  ctx.lineTo(x - s, y);         
  ctx.lineTo(x - n, y - n * 1.2);
  ctx.closePath();
  ctx.fill();
}

function createParticle(w, h) {
  const angle = rand(0, Math.PI * 2);
  return {
    x: rand(0, w),
    y: rand(0, h),
    vx: Math.cos(angle) * rand(0.15, 0.45),
    vy: Math.sin(angle) * rand(0.15, 0.45),
    size: rand(4, 18),
    opacityBase: rand(0.15, 0.85),
    opacityAmp: rand(0.1, 0.35),
    pulseSpeed: rand(0.8, 2.0), 
    pulsePhase: rand(0, Math.PI * 2)
  };
}

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

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      renderDpr = dpr;
      const rect = parent.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = isMobileViewport()
        ? window.innerHeight * 0.5
        : (rect.height || window.innerHeight);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      resize();
      const w = canvas.width / renderDpr;
      const h = canvas.height / renderDpr;
      particles = Array.from({ length: targetCount }, () =>
        createParticle(w, h)
      );
    };

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

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;

        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        const pulse = Math.sin(elapsed * p.pulseSpeed * Math.PI + p.pulsePhase);
        const opacity = p.opacityBase + pulse * p.opacityAmp;

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
