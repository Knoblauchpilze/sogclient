
import '../../styles/session/Game.css';
import React from 'react';
import NavigationMenu from './NavigationMenu.jsx';
import ResourcesDisplay from './ResourcesDisplay.jsx';
import ConstructionList from './ConstructionList.jsx';
import PlanetsList from './PlanetsList.jsx';

import Overview from './Overview.jsx';
import Resources from './Resources.jsx';
import Facilities from './Facilities.jsx';
import ResearchLab from './ResearchLab.jsx';
import Shipyard from './Shipyard.jsx';
import Defenses from './Defenses.jsx';
import Fleets from './Fleets.jsx';
import Galaxy from './Galaxy.jsx';

import Server from '../game/server.js';

import PlanetsModule from '../game/planets.js';
import { PLANETS_FETCH_SUCCEEDED } from '../game/planets.js';
import ResourcesModule from '../game/resources.js';
import { RESOURCES_FETCH_SUCCEEDED } from '../game/resources.js';

import { TAB_OVERVIEW } from './NavigationMenu.jsx';
import { TAB_RESOURCES } from './NavigationMenu.jsx';
import { TAB_FACILITIES } from './NavigationMenu.jsx';
import { TAB_RESEARCH_LAB } from './NavigationMenu.jsx';
import { TAB_SHIPYARD } from './NavigationMenu.jsx';
import { TAB_DEFENSES } from './NavigationMenu.jsx';
import { TAB_FLEETS } from './NavigationMenu.jsx';
import { TAB_GALAXY } from './NavigationMenu.jsx';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines the list of planets available for this
      // game: it corresponds to the planets owned by
      // the player currently logged in.
      planets: [],

      // Defines the list of resources available for this
      // game: it corresponds to constant data fetched
      // from the server and describing the properties of
      // the resources used in game.
      resources: [],

      // Defines the index of the selected planet among
      // the available list.
      selectedPlanet: -1,

      // Current tab displayed in the central view. This
      // allows to select various facets of the planet
      // currently selected and allows to build various
      // elements of the game.
      selectedTab: TAB_OVERVIEW,
    };
  }

  componentDidMount() {
    // Fetch the list of universes from the server.
    const server = new Server();
    const planets = new PlanetsModule(server);
    const resources = new ResourcesModule(server);

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

    // Fetch the resources from the server.
    resources.fetchResources()
      .then(function (res) {
        if (res.status !== RESOURCES_FETCH_SUCCEEDED) {
          game.fetchDataFailed(res.status);
        }
        else {
          game.fetchResourcesSucceeded(res.resources);
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

  fetchResourcesSucceeded(resources) {
    // Update internal state.
    this.setState({
      resources: resources,
    });
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

  updateGameTab(tab) {
    // Update the tab displayed on the central view
    // of the game.
    this.setState({
      selectedTab: tab,
    });
  }

  generateCurrentTab() {
    let tab;

    switch (this.state.selectedTab) {
      case TAB_RESOURCES:
        tab = <Resources planet={this.state.planets[this.state.selectedPlanet]} />;
          break;
      case TAB_FACILITIES:
        tab = <Facilities planet={this.state.planets[this.state.selectedPlanet]} />;
          break;
      case TAB_RESEARCH_LAB:
        tab = <ResearchLab planet={this.state.planets[this.state.selectedPlanet]} />;
          break;
      case TAB_SHIPYARD:
        tab = <Shipyard planet={this.state.planets[this.state.selectedPlanet]} />;
          break;
      case TAB_DEFENSES:
        tab = <Defenses planet={this.state.planets[this.state.selectedPlanet]} />;
          break;
      case TAB_FLEETS:
          tab = <Fleets planet={this.state.planets[this.state.selectedPlanet]} />;
          break;
      case TAB_GALAXY:
          tab = <Galaxy planet={this.state.planets[this.state.selectedPlanet]} />;
          break;
      case TAB_OVERVIEW:
      default:
        tab = <Overview planet={this.state.planets[this.state.selectedPlanet]} />;
        break;
    }

    return tab;
  }

  render() {
    return (
      <div className="game_layout">
        <div className="game_page_layout">
          <ResourcesDisplay planet={this.state.planets[this.state.selectedPlanet]}
                            resources={this.state.resources}
                            />
          <div className="game_internal_layout">
            <NavigationMenu updateGameTab={(tab) => this.updateGameTab(tab)}/>
            <div className="game_center_layout">
              {this.generateCurrentTab()}
              <ConstructionList />
            </div>
            <PlanetsList planets={this.state.planets}
                        selected={this.state.selectedPlanet}
                        updateSelectedPlanet={(id) => this.updateSelectedPlanet(id)}
                        />
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
