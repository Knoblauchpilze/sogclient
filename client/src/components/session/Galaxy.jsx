
import '../../styles/session/Galaxy.css';
import React from 'react';
import GalaxyNavigator from './GalaxyNavigator.jsx';
import GalaxyPlanet from './GalaxyPlanet.jsx';

class Galaxy extends React.Component {
  constructor(props) {
    super(props);

    let galaxy = -1;
    let system = -1;

    if (props.planet) {
      galaxy = props.planet.coordinate.galaxy;
      system = props.planet.coordinate.system;
    }

    this.state = {
      // Defines the currently selected galaxy as displayed in
      // the view. This will be updated when the player browses
      // different galaxies.
      galaxy: galaxy,

      // Defines the currently selected solar system. Updated
      // whenever the player browses to a different system.
      system: system,
    };
  }

  render() {
    return (
      <div className="galaxy_layout">
        <GalaxyNavigator />
        <div className="galaxy_ships_info">
          <span className="galaxy_default_label">73 espionage probe(s)</span>
          <span className="galaxy_default_label">144 recycler(s)</span>
          <span className="galaxy_default_label">0 interplanetary missile(s)</span>
          <span className="galaxy_default_label">2/13 slot(s)</span>
        </div>

        <div className="galaxy_layout_description">
          <span className="galaxy_system_header">Planet</span>
          <span className="galaxy_system_header">Name</span>
          <span className="galaxy_system_header">Moon</span>
          <span className="galaxy_system_header">Activity</span>
          <span className="galaxy_system_header">Debris</span>
          <span className="galaxy_system_header">Player (status)</span>
          <span className="galaxy_system_header">Guild</span>
          <span className="galaxy_system_header">Actions</span>
        </div>
        <div className="galaxy_system_layout">
          <GalaxyPlanet position={1}
                        player={"Player 1"}
                        planet={"987"}
                        guild={"po"}
                        />
          <GalaxyPlanet position={2}
                        player={"Player 2879817"}
                        planet={"11"}
                        guild={"zeiu"}
                        />
          <GalaxyPlanet position={3}
                        player={"Player 897198719871"}
                        planet={"uhupoi98719871"}
                        guild={""}
                        />
          <GalaxyPlanet position={4}
                        player={"aa"}
                        planet={"uhupoi879971"}
                        guild={"awesome_guild"}
                        />
          <GalaxyPlanet position={5}
                        player={"a871"}
                        planet={"11"}
                        guild={"no_guild"}
                        />
        </div>

        <div className="galaxy_view_messages">
          <span className="galaxy_default_label">No messages at the moment</span>
        </div>

        <div className="galaxy_system_info">6 planet(s) colonized</div>
      </div>
    );
  }
}

export default Galaxy;
