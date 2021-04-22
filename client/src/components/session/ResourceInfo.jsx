
import '../../styles/session/ResourceInfo.css';
import React from 'react';

function ResourceInfo (props) {
  return (
    <div className="resource_info_layout">
      <img src={props.icon} alt={props.alt_text} title={props.title} />
      <p>{props.amount}</p>
    </div>
  );
}

export default ResourceInfo;
