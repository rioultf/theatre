// components/WheelLayer.jsx

import CrownWedges from "./CrownWedges";
import React, { useRef, useEffect } from "react";

export default function WheelLayer({
  sheet,
  objectKey,
  layerConfig,
  flash,
  phaseShifted
}) {
  const groupRef = useRef(null);

  useEffect(() => {
    const obj = sheet.object(objectKey);

    const unsubscribe = obj.onValuesChange((values) => {
      const { arcs, period, direction, phase } = values;
      if (!groupRef.current) return;

      // Exemple : appliquer la phase → rotation initiale
      const theta0 = phase * 2 * Math.PI;

      // stocker dans le DOM pour ton hook d’animation ou ton update
      groupRef.current.dataset.arcs = arcs;
      groupRef.current.dataset.period = period;
      groupRef.current.dataset.direction = direction;
      groupRef.current.dataset.phase = phase;
      groupRef.current.dataset.theta0 = theta0;

      // tu peux aussi appliquer directement un transform si tu veux
      groupRef.current.setAttribute(
        "transform",
        `rotate(${(theta0 * 180) / Math.PI})`
      );
    });

    return () => {
      unsubscribe();
    };
  }, [sheet, objectKey]);

  // On assume que `layerConfig` contient innerRadius, outerRadius, motifConfig
  const { innerRadius, outerRadius, theta, motifConfig } = layerConfig;
  return (
    <CrownWedges
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      theta={theta}
      motifConfig={motifConfig}
      flash={flash}
      phaseShifted={phaseShifted} // ✅ transmis ici
    />
  );
}
