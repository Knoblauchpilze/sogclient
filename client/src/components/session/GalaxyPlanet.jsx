
import '../../styles/session/GalaxyPlanet.css';
import React from 'react';

import empty from '../../assets/empty.png';
import planet from '../../assets/planet1.png';
import moon from '../../assets/moon.png';
import wreckfield from '../../assets/wreckfield.png';

// Defines the number of milliseconds below which the
// planet is considered as 'active'. The amount is
// computed from converting 15 minutes to milliseconds.
const PLANET_ACTIVE_INTERVAL = 15 * 60 * 1000;

// Defines the number of milliseconds above which the
// planet is considered as 'inactive'. The amount is
// computed from converting 60 minutes to milliseconds.
const PLANET_INACTIVE_INTERVAL = 60 * 60 * 1000;

function generateActivityString(planet) {
  // Parse the last activity.
  const activity = Date.parse(planet.last_activity);
  const now = Date.now();
  const elapsed = now - activity;

  // We display an asterisk in case the activity is more
  // recent than 15 minutes.
  if (elapsed < PLANET_ACTIVE_INTERVAL) {
    return {
      text: "*",
      class: "galaxy_planet_activity",
    };
  }
  if (elapsed > PLANET_INACTIVE_INTERVAL) {
    return {
      text: "",
      class: "",
    };
  }

  // Compute the number of minutes elapsed since the last
  // activity.
  const minutes = Math.floor(elapsed / (1000 * 60));

  return {
    text: "" + minutes,
    class: "galaxy_planet_distant_activity",
  };
}

function GalaxyPlanet (props) {
  let activity = {
    text: "",
    class: "",
  };
  let classes = "galaxy_planet_base galaxy_planet_5";

  if (props.planet.name !== "") {
    activity = generateActivityString(props.planet);
    if (activity.class !== "") {
      classes += (" " + activity.class);
    }
  }

  return (
    <div className="galaxy_planet_layout">
      <span className="galaxy_planet_base galaxy_planet_1 galaxy_planet_label">{props.planet.coordinate.position + 1}</span>
      <img className="galaxy_planet_base galaxy_planet_2"
           src={props.planet.name !== "" ? planet : empty}
           alt={"planet_" + props.planet.coordinate.position}
           />
      <span className="galaxy_planet_base galaxy_planet_3 galaxy_planet_label">{props.planet.name}</span>
      <img className="galaxy_planet_base galaxy_planet_4"
           src={moon}
           alt="moon"
           />
      <span className={classes}>{activity.text}</span>
      <img className="galaxy_planet_base galaxy_planet_6"
           src={wreckfield}
           alt="debris"
           />
      <span className="galaxy_planet_base galaxy_planet_7 galaxy_planet_label">{props.planet.player_name}</span>
      <span className="galaxy_planet_base galaxy_planet_8 galaxy_planet_label">{props.guild}</span>
      <button className="galaxy_planet_base galaxy_planet_9 galaxy_planet_action galaxy_planet_spy"></button>
      <button className="galaxy_planet_base galaxy_planet_10 galaxy_planet_action galaxy_planet_friend"></button>
      <button className="galaxy_planet_base galaxy_planet_11 galaxy_planet_action galaxy_planet_message"></button>
      <button className="galaxy_planet_base galaxy_planet_12 galaxy_planet_action galaxy_planet_mip"></button>
    </div>
  );
}

export default GalaxyPlanet;
