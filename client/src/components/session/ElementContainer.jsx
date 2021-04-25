
import '../../styles/session/ElementContainer.css';
import '../../styles/session/Game.css';
import React from 'react';

function ElementContainer (props) {
  return (
    <div className="element_container_layout" onClick={() => props.selectElement(props.id)}>
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
