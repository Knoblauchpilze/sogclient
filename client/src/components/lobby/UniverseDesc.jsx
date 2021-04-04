
import '../../styles/UniverseDesc.css';
import React from 'react';

function UniverseDesc(props) {
  return (
    <div className="universe_desc_layout">
      <div className="universe_desc_props">
        <div className="universe_desc_value">{props.universe}</div>
        <div className="universe_desc_value">{props.country}</div>
        <div className="universe_desc_value">{props.online}</div>
        <div className="universe_desc_value">{props.kind}</div>
        <div className="universe_desc_value">{props.age}</div>
        {props.player !== "" && <div className="universe_desc_value">{props.player}</div>}
        {props.player !== "" && <div className="universe_desc_value">{props.rank}</div>}
      </div>
      <button onClick = {() => console.log("play")}>Play</button>
    </div>
  );
  // TODO: The onClick should trigger a request to the
  // validate session somehow.
}

export default UniverseDesc;
