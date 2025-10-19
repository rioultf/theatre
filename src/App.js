import React, { useEffect } from 'react';
import { getProject, types } from '@theatre/core';
import CrownWedges from './components/CrownWedges';
import projectState from './state.json';

function App() {
  const project = getProject('SVG-CrownProject', { state: projectState });
  const sheet = project.sheet('Main');

  // Configuration de plusieurs couronnes
  const crownsConfig = [
    {
      name: 'Crown1',
      innerRadius: 40,
      outerRadius: 80,
      motifConfig: { color: 'blue',  opacity: 0.8, showRims: true },
      initial: { division: 6, width: 0.5, phaseShifted: false, theta: 0 },
    },
    {
      name: 'Crown2',
      innerRadius: 90,
      outerRadius: 130,
      motifConfig: { color: 'red',   opacity: 0.6, showRims: true },
      initial: { division: 8, width: 0.4, phaseShifted: true,  theta: 0 },
    },
    {
      name: 'Crown3',
      innerRadius: 140,
      outerRadius: 180,
      motifConfig: { color: 'green', opacity: 0.7, showRims: true },
      initial: { division: 12, width: 0.3, phaseShifted: false, theta: 0 },
    },
  ];

  const crownObjects = crownsConfig.map(cfg => {
    return sheet.object(cfg.name, {
      theta:        types.number(cfg.initial.theta,        { range: [0, 2 * Math.PI],       nudgeMultiplier: 0.01 }),
      phaseShifted: types.boolean(cfg.initial.phaseShifted),
      division:     types.number(cfg.initial.division,     { range: [1, 36],               nudgeMultiplier: 1 }),
      width:        types.number(cfg.initial.width,        { range: [0.1, 1],              nudgeMultiplier: 0.1 }),
    }, { reconfigure: true });
  });

  useEffect(() => {
    project.ready.then(() => {
      sheet.sequence.play({ iterationCount: Infinity });
    });
  }, [project, sheet]);

  return (
    <div className="App">
      <h1>Crown Wedges Animation Multicouronnes avec Theatre.js</h1>
      <svg width="500" height="500" viewBox="-250 -250 500 500">
        {crownsConfig.map((cfg, i) => (
          <CrownWedges
            key={i}
            innerRadius={cfg.innerRadius}
            outerRadius={cfg.outerRadius}
            motifConfig={cfg.motifConfig}
            circleObj={crownObjects[i]}
          />
        ))}
      </svg>
    </div>
  );
}

export default App;
