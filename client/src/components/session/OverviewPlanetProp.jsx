
import '../../styles/OverviewPlanetProp.css';
import React from 'react';

function OverviewPlanetProp (props) {
  return (
    <div className="overview_planet_prop_layout">
      <div className="overview_planet_prop_key">{props.title}:</div>
      {props.link === "" && <div className="overview_planet_prop_value">{props.value}</div>}
      {
        props.link !== "" &&
        <div className="overview_planet_prop_value">
          <a href={props.link}>{props.value}</a>
        </div>
      }
    </div>
  );
}

export default OverviewPlanetProp;
