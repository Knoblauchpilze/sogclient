
import '../../styles/session/Galaxy.css';
import React from 'react';
import GalaxyNavigator from './GalaxyNavigator.jsx';
import GalaxyPlanet from './GalaxyPlanet.jsx';

import Server from '../game/server.js';

import PlanetsModule from '../game/planets.js';
import { PLANETS_FETCH_SUCCEEDED } from '../game/planets.js';

class Galaxy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines the current coordinates displayed by the galaxy view.
      coordinates: {
        galaxy: -1,
        solar_system: -1,
      },
    };
  }

  fetchSystemData() {
    // Fetch the data corresponding to this player's session
    // from the server.
    const server = new Server();
    const planets = new PlanetsModule(server);

    const game = this;

    // Fetch the planets from the server for the
    // player that is currently logged in.
    planets.fetchPlanetsForSystem(this.props.coordinates.galaxy, this.props.coordinates.solar_system)
      .then(function (res) {
        if (res.status !== PLANETS_FETCH_SUCCEEDED) {
          game.fetchDataFailed(res.status);
        }
        else {
          game.fetchPlanetsSucceeded(res.planets);
        }
      })
      .catch(err => game.fetchDataFailed(err));
  }

  fetchDataFailed(err) {
    alert(err);
  }

  fetchPlanetsSucceeded(planets) {
    // Update internal state: we also define the planet
    // selected to be the first one.
    this.setState({
      planets: planets,
    });

    console.info("Fetched " + planets.length + " planet(s) for system " + this.props.coordinates.galaxy + ":" + this.props.coordinates.solar_system);
  }

  render() {
    // TODO: Handle the handling of the system data.

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
