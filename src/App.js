import React, { useEffect } from 'react';
import { getProject, types } from '@theatre/core';
import CrownWedges from './components/CrownWedges';
import projectState from './state.json';

function App() {
  const project = getProject('SVG-CrownProject', { state: projectState });
  const sheet = project.sheet('Main');

  const crownsConfig = [
    {
      name: 'Crown1',
      motifConfig: {},
      initial: { division: 1, width: 0.5, phaseShifted: false, period: 5 },
    },
    {
      name: 'Crown2',
      motifConfig: {},
      initial: { division: 1, width: 0.5, phaseShifted: true, period: 8 },
    },
    {
      name: 'Crown3',
      motifConfig: {},
      initial: { division: 1, width: 0.5, phaseShifted: false, period: 12 },
    },
  ];

  const crownObjects = crownsConfig.map(cfg =>
    sheet.object(cfg.name, {
      phaseShifted: types.boolean(cfg.initial.phaseShifted),
      division: types.number(cfg.initial.division, { range: [1, 12], nudgeMultiplier: 1 }),
      width: types.number(cfg.initial.width, { range: [0.1, 1], nudgeMultiplier: 0.05 }),
      period: types.number(cfg.initial.period, { range: [1, 32], nudgeMultiplier: 1 }),
    }, { reconfigure: true })
  );

  useEffect(() => {
    project.ready.then(() => {
      /*sheet.sequence.attachAudio({ source: '/audio/BWV_555.mp3' })
        .then(() => {
          console.log('Audio loaded!');
          // maintenant on peut jouer la sequence
          sheet.sequence.play({ iterationCount: Infinity });
        });
          sheet.sequence.play({ iterationCount: Infinity });
          });*/
      sheet.sequence.play({ iterationCount: Infinity });
    });
  }, [project, sheet]);

  return (
    <div className="App">
      <h1>Crown Wedges Animation Multicouronnes avec période animable</h1>
      <svg width="500" height="500" viewBox="-250 -250 500 500">
        {crownsConfig.map((cfg, i) => (
          <CrownWedges
            key={i}
            id={i}
            motifConfig={cfg.motifConfig}
            circleObj={crownObjects[i]}
          />
        ))}
      </svg>
    </div>
  );
}

export default App;
