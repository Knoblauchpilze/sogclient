
import '../../styles/session/FleetShip.css';
import React from 'react';

function FleetShip (props) {
  return (
    <div className="fleet_ship_layout">
      <img className="fleet_ship_icon" src={props.ship.icon} alt={props.ship.title} title={props.ship.title}/>
      <span className="fleet_ship_available_count">{props.ship.max}</span>
      <div className="fleet_ship_action">
        <form className="fleet_ship_count_form">
          <input className="fleet_ship_selector"
                 method="post"
                 type="number"
                 name="ship_count"
                 id="ship_count"
                 value={props.ship.selected}
                 onChange={e => props.selectShips(props.ship.id, e.target.value)}
                 />
        </form>
      </div>
    </div>
  );
}

export default FleetShip;
