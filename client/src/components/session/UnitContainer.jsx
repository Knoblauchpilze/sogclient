
import '../../styles/session/UnitContainer.css';
import '../../styles/session/Game.css';
import React from 'react';

function UnitContainer (props) {
  function handleBuildUnit(e) {
    console.log("TODO: Handle value " + e.target.value);
  }

  return (
    <div className="unit_container_layout">
      <img className="unit_container_icon"
           src={props.icon}
           alt={props.alt}
           title={props.title}
           />
      <span className="unit_container_count">{props.count}</span>
      <div className="unit_container_actions">
        <form className="unit_container_selected_count">
          <input className="unit_container_selector"
                 method="post"
                 type="number"
                 name={"unit_container_" + props.title + "_count"}
                 id={"unit_container_" + props.title + "_count"}
                 defaultValue={props.min}
                 min={props.min}
                 max={props.max}
                 onChange={(e) => handleBuildUnit(e)}
                 />
        </form>
        <button className="unit_container_perform" type="button"></button>
      </div>
    </div>
  );
}

export default UnitContainer;
