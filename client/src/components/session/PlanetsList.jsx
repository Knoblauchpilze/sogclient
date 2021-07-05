
import '../../styles/session/PlanetsList.css';
import React from 'react';
import PlanetContainer from './PlanetContainer.jsx';

import { computePlanetsSlots } from '../game/rules.js';

function PlanetsList(props) {
  // Generate title.
  let count = props.planets.length + "/" + computePlanetsSlots(props.player.technologies) +  " planet(s)";

  return (
    <div className="planets_list_layout">
      <div className="planets_list_count">{count}</div>
      {
        props.planets.map(function(planet, id) {
          // Check whether this planet has a moon associated to it.
          const moonId = props.moons.findIndex(m => m.planet === planet.id);

          if (moonId < 0) {
            return <PlanetContainer key={`${planet.id}`}
                                    planet={planet}
                                    active={id === props.selected}
                                    hasMoon={false}
                                    updateSelectedPlanet={() => props.updateSelectedPlanet(id)}
                                    updateSelectedMoon={() => {}}
                                    viewSystem={(galaxy, system) => props.viewSystem(galaxy, system)}
                                    />;
          }

          return <PlanetContainer key={`${planet.id}`}
                                  planet={planet}
                                  active={id === props.selected}
                                  hasMoon={true}
                                  updateSelectedPlanet={() => props.updateSelectedPlanet(id)}
                                  updateSelectedMoon={() => props.updateSelectedMoon(moonId)}
                                  viewSystem={(galaxy, system) => props.viewSystem(galaxy, system)}
                                  />;
        })
      }
    </div>
  );
}

export default PlanetsList;
