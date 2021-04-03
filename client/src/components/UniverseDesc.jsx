
import React from 'react';

function UniverseDesc(props) {
  return (
    <div className="lobby_universe_desc">
      <div className="lobby_universe_props">
        <div className="lobby_universe_value">{props.universe}</div>
        <div className="lobby_universe_value">{props.country}</div>
        <div className="lobby_universe_value">{props.online}</div>
        <div className="lobby_universe_value">{props.kind}</div>
        <div className="lobby_universe_value">{props.age}</div>
        {props.player !== "" && <div className="lobby_universe_value">{props.player}</div>}
        {props.player !== "" && <div className="lobby_universe_value">{props.rank}</div>}
      </div>
      <button onClick = {() => console.log("play")}>Play</button>
    </div>
  );
  // TODO: The onClick should trigger a request to the
  // validate session somehow.
}

export default UniverseDesc;
