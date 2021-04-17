
import '../../styles/Game.css';
import React from 'react';
import Overview from './Overview.jsx';
import NavigationMenu from './NavigationMenu.jsx';
import ConstructionList from './ConstructionList.jsx';
import PlanetsList from './PlanetsList.jsx';

import Server from '../game/server.js';

import PlanetsModule from '../game/planets.js';
import { PLANETS_FETCH_SUCCEEDED } from '../game/planets.js';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines the list of planets available for this
      // game: it corresponds to the planets owned by
      // the player currently logged in.
      planets: [],

      // Defines the index of the selected planet among
      // the available list.
      selectedPlanet: -1,
    };
  }

  componentDidMount() {
    // Fetch the list of universes from the server.
    const server = new Server();
    const planets = new PlanetsModule(server);

    const game = this;

    // Fetch the planets from the server for the
    // player that is currently logged in.
    planets.fetchPlanets(this.props.session.id)
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
      selectedPlanet: 0,
    });

    console.info("Fetched " + planets.length + " planet(s) for " + this.props.session.id);
  }

  updateSelectedPlanet(id) {
    // Update the selected planet index if it is
    // valid compared to the list of available
    // planets.
    if (id < 0 || id >= this.state.planets.length) {
      console.error("Can't select planet " + id + " among [0 - " + this.state.planets.length + "]");
      return;
    }

    console.info("Selected planet " + this.state.planets[id].id);

    this.setState({
      selectedPlanet: id,
    });
  }

  render() {
    return (
      <div className="game_layout">
        <div className="game_internal_layout">
          <NavigationMenu />
          <div className="game_center_layout">
            <Overview planet={this.state.planets[this.state.selectedPlanet]}/>
            <ConstructionList />
          </div>
          <PlanetsList planets={this.state.planets}
                       selected={this.state.selectedPlanet}
                       updateSelectedPlanet={(id) => this.updateSelectedPlanet(id)}
                       />
        </div>
      </div>
    );
  }
}

export default Game;
