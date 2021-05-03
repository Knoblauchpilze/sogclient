
import '../../styles/session/GalaxyPlanet.css';
import React from 'react';

import planet from '../../assets/planet1.png';
import moon from '../../assets/moon.png';
import wreckfield from '../../assets/wreckfield.png';

function GalaxyPlanet (props) {
  return (
    <div className="galaxy_planet_layout">
      <span className="galaxy_planet_base galaxy_planet_1 galaxy_planet_label">{props.position}</span>
      <img className="galaxy_planet_base galaxy_planet_2" src={planet} alt={"planet_" + props.position}/>
      <span className="galaxy_planet_base galaxy_planet_3 galaxy_planet_label">{props.planet}</span>
      <img className="galaxy_planet_base galaxy_planet_4" src={moon} alt="moon"/>
      <span className="galaxy_planet_base galaxy_planet_5 galaxy_planet_activity">*</span>
      <img className="galaxy_planet_base galaxy_planet_6" src={wreckfield} alt="debris_gone"/>
      <span className="galaxy_planet_base galaxy_planet_7 galaxy_planet_label">{props.player}</span>
      <span className="galaxy_planet_base galaxy_planet_8 galaxy_planet_label">{props.guild}</span>
      <button className="galaxy_planet_base galaxy_planet_9 galaxy_planet_action galaxy_planet_spy"></button>
      <button className="galaxy_planet_base galaxy_planet_10 galaxy_planet_action galaxy_planet_friend"></button>
      <button className="galaxy_planet_base galaxy_planet_11 galaxy_planet_action galaxy_planet_message"></button>
      <button className="galaxy_planet_base galaxy_planet_12 galaxy_planet_action galaxy_planet_mip"></button>
    </div>
  );
}

export default GalaxyPlanet;