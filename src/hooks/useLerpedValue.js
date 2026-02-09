import { useEffect, useRef, useState } from "react";

const useLerpedValue = (targetValue, factor = 0.1) => {
  const [lerpedValue, setLerpedValue] = useState(targetValue);
  const previousValueRef = useRef(targetValue);
  const requestRef = useRef();

  useEffect(() => {
    const lerp = (start, end, f) => start + (end - start) * f;

    const animate = () => {
      const current = previousValueRef.current;
      const next = lerp(current, targetValue, factor);
      previousValueRef.current = next;
      setLerpedValue(next);

      if (Math.abs(next - targetValue) > 0.1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, [targetValue, factor]);

  return lerpedValue;
};

export default useLerpedValue;
