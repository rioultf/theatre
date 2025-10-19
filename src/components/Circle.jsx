// Circle.jsx
import React, { useEffect, useRef } from 'react';

export default function Circle({ circleObj }) {
  const circleRef = useRef(null);

  useEffect(() => {
    const unsubscribe = circleObj.onValuesChange((values) => {
      if (circleRef.current) {
        const { cx, cy, r, fill } = values;
        circleRef.current.setAttribute('cx', cx);
        circleRef.current.setAttribute('cy', cy);
        circleRef.current.setAttribute('r', r);
        circleRef.current.setAttribute('fill', fill);
      }
    });
    return () => unsubscribe();
  }, [circleObj]);

  return (
    <circle ref={circleRef} cx="200" cy="200" r="50" fill="#ff0000" />
  );
}
