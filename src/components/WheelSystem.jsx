import React, { useState, useEffect, useCallback } from "react";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import WheelLayer from "./WheelLayer";

export default function WheelSystem({
  width,
  height,
  layersConfig,
  speedOptions,
  resetTrigger,
  bpm,
  isRunning,
  flash,
  slowFactor,
  sheet
}) {
  const cx = width / 2;
  const cy = height / 2;

  const [layersState, setLayersState] = useState(
    layersConfig.map((cfg) => ({ ...cfg, theta: 0 }))
  );

  useEffect(() => {
    setLayersState((prev) =>
      layersConfig.map((cfg, idx) => ({
        ...cfg,
        theta: prev[idx]?.theta ?? 0
      }))
    );
  }, [layersConfig]);

  useEffect(() => {
    if (resetTrigger != null) {
      setLayersState((prev) =>
        prev.map((lay) => ({
          ...lay,
          theta: Math.PI / 2
        }))
      );
    }
  }, [resetTrigger]);

  const baseFactor = bpm / 60;

  const update = useCallback(
    (dt) => {
      if (!isRunning) return;
      setLayersState((prev) =>
        prev.map((lay) => {
          const speedEntry = speedOptions[lay.speedIndex];
          const speedBase = speedEntry?.value ?? speedEntry;
          const speedEffective = speedBase * baseFactor;
          const dTheta =
            speedEffective *
            2 *
            Math.PI *
            dt *
            slowFactor *
            (lay.direction || 1);
          return {
            ...lay,
            theta: (lay.theta + dTheta + 2 * Math.PI) % (2 * Math.PI)
          };
        })
      );
    },
    [speedOptions, baseFactor, isRunning, slowFactor]
  );

  useAnimationFrame(update);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${cx},${cy})`}>
        {layersState.map((lay, idx) => {
          const objectKey = `Wheel-${lay.id}`;
          return (
            <WheelLayer
              key={lay.id}
              sheet={sheet}
              objectKey={objectKey}
              layerConfig={{ ...lay, theta: lay.theta }}
              flash={flash}
              phaseShifted={lay.phaseShifted}
            />
          );
        })}
      </g>
    </svg>
  );
}
