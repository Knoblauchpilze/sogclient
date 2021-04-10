
import '../../styles/UniverseDesc.css';
import React from 'react';

function UniverseDesc (props) {
  const uni = props.player.universe;
  const player = props.player;

  let ageText = uni.age + " day";
  if (uni.age > 1) {
    ageText = uni.age + " days";
  }

  return (
    <div className="universe_desc_layout">
      <div className="universe_desc_props">
        <div className="universe_desc_value">{uni.name}</div>
        <div className="universe_desc_value">{uni.country}</div>
        <div className="universe_desc_value">{uni.online}</div>
        <div className="universe_desc_value">{uni.kind}</div>
        <div className="universe_desc_value">{ageText}</div>
        {player.exists() && <div className="universe_desc_value">{player.name}</div>}
        {player.exists() && <div className="universe_desc_value">{player.rank}</div>}
      </div>
      <button onClick = {() => props.selectSession(player)}>Play</button>
    </div>
  );
}

export default UniverseDesc;
