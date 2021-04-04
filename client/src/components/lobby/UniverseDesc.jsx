
import '../../styles/UniverseDesc.css';
import React from 'react';

function UniverseDesc(props) {
  let {
    universe,
    player
  } = props;

  // Make sure we have a valid player and universe.
  if (!player) {
    player = {
      name: "",
      rank: ""
    };
  }

  if (!universe) {
    universe = {
      name: "",
      country: "",
      online: "",
      kind: "",
      age: "",
    };
  }

  return (
    <div className="universe_desc_layout">
      <div className="universe_desc_props">
        <div className="universe_desc_value">{universe.name}</div>
        <div className="universe_desc_value">{universe.country}</div>
        <div className="universe_desc_value">{universe.online}</div>
        <div className="universe_desc_value">{universe.kind}</div>
        <div className="universe_desc_value">{universe.age}</div>
        {player.name !== "" && <div className="universe_desc_value">{player.name}</div>}
        {player.rank !== "" && <div className="universe_desc_value">{player.rank}</div>}
      </div>
      <button onClick = {() => console.log("play")}>Play</button>
    </div>
  );
  // TODO: The onClick should trigger a request to the
  // validate session somehow.
}

export default UniverseDesc;
