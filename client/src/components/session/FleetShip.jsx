
import '../../styles/session/FleetShip.css';
import React from 'react';

function FleetShip (props) {
  return (
    <div className="fleet_ship_layout">
      <img className="fleet_ship_icon" src={props.icon} alt={props.alt} title={props.title}/>
      <span className="fleet_ship_available_count">{props.max}</span>
      <div className="fleet_ship_action">
        <form className="fleet_ship_count_form">
          <input className="fleet_ship_selector"
                 method="post"
                 type="number"
                 name="ship_count"
                 id="ship_count"
                 value={props.min}
                 min={props.min}
                 max={props.max}/>
        </form>
      </div>
    </div>
  );
}

export default FleetShip;
