
import '../../styles/session/OverviewPlanetProp.css';
import React from 'react';

function OverviewPlanetProp (props) {
  return (
    <div className="overview_planet_prop_layout">
      <div className="overview_planet_prop_key">{props.title}:</div>
      {props.link === "" && <div className="overview_planet_prop_value">{props.value}</div>}
      {
        props.link !== "" &&
        <div className="overview_planet_prop_value overview_planet_prop_link" onClick={() => props.link()}>
          {props.value}
        </div>
      }
    </div>
  );
}

export default OverviewPlanetProp;
