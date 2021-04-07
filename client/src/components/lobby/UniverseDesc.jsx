
import '../../styles/UniverseDesc.css';
import React from 'react';

class UniverseDesc extends React.Component {
  constructor(props) {
    super(props);

    // Gather info about the player and universe
    // as defined in the props.
    this.state = {
      // Represents the session associated to this
      // element. Contains at least the universe
      // description and might contain also a player
      // description representing the instance of the
      // account in this universe.
      player: props.player,

      // This method fetched from the input properties
      // allows to transmit the selected session to the
      // parent component.
      selectSession: props.selectSession,
    };
  }

  render() {
    const uni = this.state.player.universe;
    const player = this.state.player;

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
        <button onClick = {() => this.state.selectSession(player)}>Play</button>
      </div>
    );
  }
}

export default UniverseDesc;
