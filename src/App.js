import React, { useEffect } from 'react';
import { getProject, types } from '@theatre/core';
import CrownWedges from './components/CrownWedges';
import projectState from './state.json';

function App() {
  const project = getProject('SVG-CrownProject', { state: projectState });
  const sheet = project.sheet('Main');

  const crownObj = sheet.object('MyCrown', {
    theta: types.number(0, { range: [0, 2 * Math.PI], nudgeMultiplier: 0.01 }),
    phaseShifted: types.boolean(false),
    division: types.number(6, { range: [1, 36], nudgeMultiplier: 1 }),
    width: types.number(0.5, { range: [0.1, 1], nudgeMultiplier: 0.1 }),
  }, { reconfigure: true });

  useEffect(() => {
    project.ready.then(() => {
      sheet.sequence.play({ iterationCount: Infinity });
    });
  }, [project, sheet]);

  return (
    <div className="App">
      <h1>Crown Wedges Animation avec Theatre.js</h1>
      <svg width="400" height="400" viewBox="-200 -200 400 400">
        <CrownWedges
          innerRadius={50}
          outerRadius={150}
          motifConfig={{ color: 'blue', opacity: 0.8, showRims: true }}
          circleObj={crownObj}
        />
      </svg>
    </div>
  );
}

export default App;
