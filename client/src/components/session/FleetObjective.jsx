
import '../../styles/session/FleetObjective.css';
import '../../styles/session/Game.css';
import React from 'react';

function FleetObjective (props) {
  // Generate class name from icon.
  const iconClass = "fleet_objective_" + props.icon;

  return (
    <div className="fleet_objective_layout">
      <button className={"fleet_objective_mission " + iconClass}></button>
      <p className="fleet_objective_mission_label">{props.label}</p>
    </div>
  );
}

export default FleetObjective;
