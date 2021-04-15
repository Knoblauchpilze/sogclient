
import '../../styles/PlanetContainer.css';
import React from 'react';

import planet from '../../assets/planet1.png';
import moon from '../../assets/moon1.png';

function PlanetContainer (props) {
  let classes = "planet_container_layout";
  if (props.active) {
    classes += " planet_container_layout_selected";
  }

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
      <div>
        <a className="planet_container_link" href="../overview/overview.html">{props.name}</a>
        <p className="planet_container_coordinates">
          {props.galaxy + ":" + props.solar_system + ":" + props.position}
        </p>
      </div>
    </div>
  );
}

export default PlanetContainer;
