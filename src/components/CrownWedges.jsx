// CrownWedges.jsx
import React, { useEffect, useState } from "react";

export default function CrownWedges({
  innerRadius,
  outerRadius,
  motifConfig,
  circleObj,
}) {
  const {
    color = "black",
    opacity = 1,
    showRims = true,
  } = motifConfig;

  const [animValues, setAnimValues] = useState({
    theta: 0,
    phaseShifted: false,
    division: 1,
    width: 1,
  });

  useEffect(() => {
    if (!circleObj) return;
    const unsubscribe = circleObj.onValuesChange((values) => {
      const theta       = values.theta || 0;
      const phaseShifted= !!values.phaseShifted;
      const division    = Math.max(1, Math.round(values.division || 1));
      const width       = Math.max(0.1, Math.min(1, values.width || 1));

      setAnimValues({ theta, phaseShifted, division, width });
    });
    return () => unsubscribe();
  }, [circleObj]);

  const { theta, phaseShifted, division, width } = animValues;

  // Calculs
  const phaseOffset = phaseShifted ? Math.PI / division : 0;
  const rotationDeg = ((theta + phaseOffset) * 180) / Math.PI;

  const toXY = (r, a) => ({
    x: r * Math.cos(a),
    y: r * Math.sin(a),
  });

  const sectorAngle = (2 * Math.PI) / division;
  const half = (sectorAngle * width) / 2;

  const bars = [];
  for (let i = 0; i < division; i++) {
    const center = i * sectorAngle;
    const a1 = center - half;
    const a2 = center + half;

    const A = toXY(innerRadius, a1);
    const B = toXY(outerRadius, a1);
    const C = toXY(outerRadius, a2);
    const D = toXY(innerRadius, a2);

    const deltaAngle = a2 - a1;
    const largeArcFlag = deltaAngle > Math.PI ? 1 : 0;
    const sweepFlag = 1;
    const innerSweepFlag = 0;

    let d;
    if (innerRadius === 0) {
      const P1 = toXY(outerRadius, a1);
      const P2 = toXY(outerRadius, a2);
      d = `M 0 0 L ${P1.x} ${P1.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} ${sweepFlag} ${P2.x} ${P2.y} Z`;
    } else {
      d = `M ${A.x} ${A.y} L ${B.x} ${B.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} ${sweepFlag} ${C.x} ${C.y} L ${D.x} ${D.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} ${innerSweepFlag} ${A.x} ${A.y} Z`;
    }

    bars.push(
      <path key={i} d={d}
        fill={color}
        fillOpacity={opacity}
        stroke="none"
      />
    );
  }

  return (
    <g transform={`rotate(${rotationDeg})`} style={{ pointerEvents: "none" }}>
      {showRims && innerRadius > 0 && (
        <circle
          cx={0}
          cy={0}
          r={innerRadius}
          fill="none"
          stroke={color}
          strokeWidth={0.5}
          opacity={opacity * 0.5}
        />
      )}
      {showRims && (
        <circle
          cx={0}
          cy={0}
          r={outerRadius}
          fill="none"
          stroke={color}
          strokeWidth={0.5}
          opacity={opacity * 0.5}
        />
      )}
      {bars}
    </g>
  );
}
