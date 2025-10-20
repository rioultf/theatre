// CrownWedges.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";

export default function CrownWedges({
  id,
  motifConfig,
  circleObj,
}) {
  // couleur fixe
  const color = "black";
  // opacité selon l’id
  const opacity = 1 / (id + 1);

  // calculer inner & outer en fonction de id
  const innerRadius = 40 * id;
  const outerRadius = innerRadius + 40;

  const [animValues, setAnimValues] = useState({
    phaseShifted: false,
    division:     1,
    width:        1,
    period:       5,
  });

  // version entière arrondie de la période
  const periodRounded = useMemo(() => Math.round(animValues.period), [animValues.period]);

  const [theta, setTheta] = useState(0);
  const startRef = useRef(null);

  // écouter les valeurs animables (division, width, phaseShifted, period)
  useEffect(() => {
    if (!circleObj) return;
    const unsubscribe = circleObj.onValuesChange((values) => {
      const phaseShifted = !!values.phaseShifted;
      const division     = Math.max(1, Math.round(values.division || 1));
      const width        = Math.max(0.1, Math.min(1, values.width || 1));
      const period       = Math.max(0.1, values.period || 5);
      setAnimValues({ phaseShifted, division, width, period });
    });
    return () => unsubscribe();
  }, [circleObj]);

  // boucle d’animation pour theta, qui ne redémarre que quand periodRounded change
  useEffect(() => {
    const periodInt = Math.max(1, periodRounded);
    const currentTimestamp = performance.now();
    const currentTheta     = theta % (2 * Math.PI);
    // calculer un offset pour démarrer sans saut
    const startOffset = (currentTheta / (2 * Math.PI)) * (periodInt * 1000);
    startRef.current = currentTimestamp - startOffset;

    let rafId;
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const angle   = ((elapsed % (periodInt * 1000)) / (periodInt * 1000)) * 2 * Math.PI;
      setTheta(angle);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [periodRounded]);  // relancer seulement quand l’entier change

  const { phaseShifted, division, width } = animValues;

  // calcul rotation
  const phaseOffset  = phaseShifted ? Math.PI / division : 0;
  const rotationDeg  = ((theta + phaseOffset) * 180) / Math.PI;

  const toXY = (r, a) => ({
    x: r * Math.cos(a),
    y: r * Math.sin(a),
  });

  const sectorAngle = (2 * Math.PI) / division;
  const half        = (sectorAngle * width) / 2;

  const bars = [];
  for (let i = 0; i < division; i++) {
    const center = i * sectorAngle;
    const a1     = center - half;
    const a2     = center + half;

    const A = toXY(innerRadius, a1);
    const B = toXY(outerRadius, a1);
    const C = toXY(outerRadius, a2);
    const D = toXY(innerRadius, a2);

    const deltaAngle   = a2 - a1;
    const largeArcFlag = deltaAngle > Math.PI ? 1 : 0;
    const sweepFlag    = 1;
    const innerSweep   = 0;

    let d;
    if (innerRadius === 0) {
      const P1 = toXY(outerRadius, a1);
      const P2 = toXY(outerRadius, a2);
      d = `M 0 0 L ${P1.x} ${P1.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} ${sweepFlag} ${P2.x} ${P2.y} Z`;
    } else {
      d = `M ${A.x} ${A.y} L ${B.x} ${B.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} ${sweepFlag} ${C.x} ${C.y} L ${D.x} ${D.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} ${innerSweep} ${A.x} ${A.y} Z`;
    }

    bars.push(
      <path key={i} d={d} fill={color} fillOpacity={opacity} stroke="none" />
    );
  }

  return (
    <g transform={`rotate(${rotationDeg})`} style={{ pointerEvents: "none" }}>
      <circle
        cx={0}
        cy={0}
        r={outerRadius}
        fill="none"
        stroke={color}
        strokeWidth={0.5}
        opacity={opacity * 0.5}
      />
      {bars}
    </g>
  );
}
