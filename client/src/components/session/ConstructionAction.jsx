
import '../../styles/session/ConstructionAction.css';
import React from 'react';


function ConstructionAction (props) {
  let item = "No construction at the moment";
  if (props.action !== "") {
    item = props.action;
  }

  return (
    <div className="construction_action_layout">
      <div className="construction_action_title">
        <div>{props.title}</div>
      </div>
      <div className="construction_action_value">
        <div>{item}</div>
      </div>
    </div>
  );
}

export default ConstructionAction;
