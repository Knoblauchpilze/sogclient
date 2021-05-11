
import '../../styles/session/ElementContainer.css';
import '../../styles/session/Game.css';
import React from 'react';

function ElementContainer (props) {
  let classes = "element_container_layout";
  if (props.selected && props.selected === true) {
    classes += " element_container_layout_selected";
  }

  return (
    <div className={classes} onClick={() => props.selectElement(props.id)}>
      <img className="element_container_icon"
           src={props.icon}
           alt={props.alt}
           title={props.title}
           />
      <span className="element_container_level">{props.level}</span>
    </div>
  );
}

export default ElementContainer;
