
import '../../styles/PlanetContainer.css';
import React from 'react';

import planet from '../../assets/planet1.png';
import moon from '../../assets/moon1.png';

function PlanetContainer (props) {
  let classes = "planet_container_layout";
  if (props.active) {
    classes += " planet_container_layout_selected";
  }

  let coords = "[" + props.planet.coordinate.galaxy;
  coords += ":";
  coords += props.planet.coordinate.system;
  coords += ":";
  coords += props.planet.coordinate.position;
  coords += "]";

  // See here for how to attach the on click to elements
  // defined for the planet container.
  // https://stackoverflow.com/questions/28268835/react-onclick-event-on-component
  return (
    <div className={classes}>
      <div className="planet_container_icons">
        <a href="../overview/overview.html">
          <img className="planet_container_planet_icon"
               src={planet}
               alt="Planet visual"
               />
        </a>
        <a href="../overview/overview.html">
          <img className="planet_container_moon_icon"
               src={moon}
               alt="Moon visual"
               />
        </a>
      </div>
      <div className="planet_container_active_area" onClick={props.onClick}>
        {props.planet.name}
        <p className="planet_container_coordinates">{coords}</p>
      </div>
    </div>
  );
}

export default PlanetContainer;
