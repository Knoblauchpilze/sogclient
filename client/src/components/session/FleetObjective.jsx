
import '../../styles/session/FleetObjective.css';
import React from 'react';

function FleetObjective (props) {
  // Generate class name from icon.
  let iconClass = "fleet_objective_" + props.icon;
  if (props.selected) {
    iconClass += "_selected";
  }
  if (!props.selectable) {
    iconClass += " fleet_objective_disabled";
  }

  return (
    <div className="fleet_objective_layout">
      {
        props.selectable && <button className={"fleet_objective_mission " + iconClass} onClick={() => props.updateObjective(props.name)}></button>
      }
      {
        !props.selectable && <button className={"fleet_objective_mission " + iconClass}></button>
      }
      <p className="fleet_objective_mission_label">{props.label}</p>
    </div>
  );
}

export default FleetObjective;
