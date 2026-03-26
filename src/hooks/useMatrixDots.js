import { useEffect } from 'react';

const SVG_NODE_SELECTOR = 'path,circle,rect,ellipse,line,polyline,polygon';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const randomBetween = (min, max) =>
  min >= max ? min : Math.random() * (max - min) + min;
const randomIntBetween = (min, max) => Math.round(randomBetween(min, max));

const prepareSvgNodes = (svg, baseOpacity) => {
  const nodes = Array.from(svg.querySelectorAll(SVG_NODE_SELECTOR));
  nodes.forEach((node) => {
    node.style.animation = 'none';
    node.style.animationName = 'none';
    node.style.animationDuration = '0s';
    node.style.transition = 'opacity 160ms linear';
    node.style.willChange = 'opacity';
    node.style.opacity = String(baseOpacity);
  });

  // Добавляем CSS contain на SVG для оптимизации рендеринга
  if (svg.style) {
    svg.style.contain = 'layout style paint';
  }

  return nodes;
};

const groupNodesByColumn = (nodes, bucketSize) => {
  const columns = new Map();
  nodes.forEach((node) => {
    if (typeof node.getBBox !== 'function') return;
    try {
      const { x, y } = node.getBBox();
      const key = Math.round(x / bucketSize) * bucketSize;
      const list = columns.get(key) || [];
      list.push({ el: node, y });
      columns.set(key, list);
    } catch {
      // Skip nodes that cannot provide a bounding box
    }
  });

  columns.forEach((items, key) => {
    columns.set(
      key,
      items.sort((a, b) => a.y - b.y)
    );
  });

  return Array.from(columns.values()).filter((items) => items.length > 0);
};

const createColumnState = ({
  nodes,
  baseOpacity,
  minTailLength,
  maxTailLength,
  minHeadOpacity,
  maxHeadOpacity,
  minDuration,
  maxDuration
}) => {
  // Longer tails for better matrix rain effect
  const tailLength = clamp(
    randomIntBetween(minTailLength, maxTailLength),
    3,
    Math.max(3, nodes.length)
  );
  
  // Brighter head for more visibility
  const headOpacity = clamp(
    randomBetween(minHeadOpacity, maxHeadOpacity),
    0.8,
    1
  );
  
  // Smoother fade with exponential curve for more natural look
  const fadeStep = (headOpacity - baseOpacity) / Math.max(tailLength - 1, 1);
  
  // Variable speed for each column
  const duration = Math.max(2000, randomBetween(minDuration, maxDuration));
  
  // Smaller gap for continuous rain effect
  const travelGap = Math.max(5, Math.round(nodes.length * 0.2));

  return {
    nodes,
    baseOpacity,
    tailLength,
    headOpacity,
    fadeStep,
    duration,
    travelDistance: nodes.length + tailLength + travelGap,
    offset: randomBetween(0, duration),
    prevPointer: null,
    activeIndices: []
  };
};

const updateColumn = (state, pointer) => {
  if (pointer === state.prevPointer) return;
  state.prevPointer = pointer;

  // Reset previously active nodes to base opacity
  state.activeIndices.forEach((idx) => {
    const item = state.nodes[idx];
    if (item) item.el.style.opacity = String(state.baseOpacity);
  });
  state.activeIndices = [];

  // Create the falling "rain drop" effect
  for (let offset = 0; offset < state.tailLength; offset += 1) {
    const index = pointer - offset;
    if (index >= 0 && index < state.nodes.length) {
      const { el } = state.nodes[index];
      
      // Exponential fade for more dramatic effect
      const fadeRatio = offset / (state.tailLength - 1);
      const exponentialFade = Math.pow(fadeRatio, 1.5); // Power curve for smoother fade
      
      const opacity = Math.max(
        state.baseOpacity,
        state.headOpacity - (state.headOpacity - state.baseOpacity) * exponentialFade
      );
      
      el.style.opacity = String(opacity);
      state.activeIndices.push(index);
    }
  }
};

export const useMatrixDots = ({
  sectionId = '#who-we-are',
  svgSelector = '.about-svg-dots-left, .about-svg-dots-right',
  disableBelowWidth = 768,
  bucketSize = 32,
  minTailLength = 5,
  maxTailLength = 11,
  minHeadOpacity = 0.82,
  maxHeadOpacity = 1,
  baseOpacity = 0.15,
  minDuration = 2200,
  maxDuration = 4200
} = {}) => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const prefersReduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return undefined;
    if (window.innerWidth <= disableBelowWidth) return undefined;

    const cleanupFns = [];
    const root = sectionId ? document.querySelector(sectionId) : document;
    if (!root) return undefined;

    const svgElements = root
      ? Array.from(root.querySelectorAll(svgSelector))
      : Array.from(document.querySelectorAll(svgSelector));

    // Флаг видимости секции
    let isVisible = false;
    // Callbacks to restart each SVG's animation loop when section re-enters view
    const restartFns = [];

    svgElements.forEach((svg) => {
      if (!svg) return;
      const nodes = prepareSvgNodes(svg, baseOpacity);
      if (!nodes.length) return;

      let rafId = null;

      const startAnimation = () => {
        const columns = groupNodesByColumn(nodes, bucketSize);
        if (!columns.length) return;

        const states = columns.map((columnNodes) =>
          createColumnState({
            nodes: columnNodes,
            baseOpacity,
            minTailLength,
            maxTailLength,
            minHeadOpacity,
            maxHeadOpacity,
            minDuration,
            maxDuration
          })
        );

        let lastUpdateTime = 0;
        const frameThrottle = 1000 / 30; // 30 FPS max

        const animate = (time) => {
          // Section not visible: stop the loop entirely (restart via observer)
          if (!isVisible) {
            rafId = null;
            return;
          }

          if (time - lastUpdateTime >= frameThrottle) {
            lastUpdateTime = time;

            states.forEach((state) => {
              const { duration, travelDistance, tailLength } = state;
              if (!duration || travelDistance <= 0) return;
              const localTime = (time + state.offset) % duration;
              const progress = localTime / duration;
              const headPosition = progress * travelDistance - tailLength;
              const pointer = Math.floor(headPosition);
              updateColumn(state, pointer);
            });
          }

          rafId = window.requestAnimationFrame(animate);
        };

        restartFns.push(() => {
          if (!rafId) rafId = window.requestAnimationFrame(animate);
        });

        rafId = window.requestAnimationFrame(animate);

        cleanupFns.push(() => {
          if (rafId) window.cancelAnimationFrame(rafId);
          rafId = null;
          states.forEach((state) => {
            state.nodes.forEach(({ el }) => {
              el.style.opacity = String(baseOpacity);
            });
            state.activeIndices = [];
          });
        });
      };

      // Defer getBBox() calls until after SVG is fully laid out
      const timerId = setTimeout(startAnimation, 0);
      cleanupFns.push(() => clearTimeout(timerId));
    });

    // IntersectionObserver: pause when section leaves view, restart when it re-enters
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible) {
            restartFns.forEach((fn) => fn());
          }
        });
      },
      { threshold: 0, rootMargin: '50px' }
    );

    observer.observe(root);

    cleanupFns.push(() => {
      observer.disconnect();
    });

    return () => {
      cleanupFns.forEach((fn) => {
        try {
          fn();
        } catch {
          /* noop */
        }
      });
    };
  }, [
    sectionId,
    svgSelector,
    bucketSize,
    minTailLength,
    maxTailLength,
    minHeadOpacity,
    maxHeadOpacity,
    baseOpacity,
    minDuration,
    maxDuration,
    disableBelowWidth
  ]);
};

export default useMatrixDots;
