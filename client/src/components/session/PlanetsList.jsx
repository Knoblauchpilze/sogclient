
import '../../styles/session/PlanetsList.css';
import React from 'react';
import PlanetContainer from './PlanetContainer.jsx';

import { computePlanetsSlots } from '../game/rules.js';

function PlanetsList (props) {
  // Generate title.
  let count = props.planets.length + "/" + computePlanetsSlots(props.player.technologies) +  " planet(s)";

  return (
    <div className="planets_list_layout">
      <div className="planets_list_count">{count}</div>
      {
        props.planets.map((planet, id) => (
          <PlanetContainer key={`${planet.id}`}
                           planet={planet}
                           active={id === props.selected}
                           onClick={() => props.updateSelectedPlanet(id)}
                           />
        ))
      }
    </div>
  );
}

export default PlanetsList;
