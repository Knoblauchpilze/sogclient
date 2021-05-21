
import '../../styles/session/Game.css';
import React from 'react';
import NavigationMenu from './NavigationMenu.jsx';
import ResourcesDisplay from './ResourcesDisplay.jsx';
import ConstructionList from './ConstructionList.jsx';
import PlanetsList from './PlanetsList.jsx';

import Overview from './Overview.jsx';
import Resources from './Resources.jsx';
import ProductionSettings from './ProductionSettings.jsx';
import Facilities from './Facilities.jsx';
import ResearchLab from './ResearchLab.jsx';
import TechnologyTree from './TechnologyTree.jsx';
import Shipyard from './Shipyard.jsx';
import Defenses from './Defenses.jsx';
import Fleets from './Fleets.jsx';
import Galaxy from './Galaxy.jsx';

import Server from '../game/server.js';

import PlanetsModule from '../game/planets.js';
import { PLANETS_FETCH_SUCCEEDED } from '../game/planets.js';
import ResourcesModule from '../game/resources.js';
import { RESOURCES_FETCH_SUCCEEDED } from '../game/resources.js';
import BuildingsModule from '../game/buildings.js';
import { BUILDINGS_FETCH_SUCCEEDED } from '../game/buildings.js';
import TechnologiesModule from '../game/technologies.js';
import { TECHNOLOGIES_FETCH_SUCCEEDED } from '../game/technologies.js';
import ShipsModule from '../game/ships.js';
import { SHIPS_FETCH_SUCCEEDED } from '../game/ships.js';
import DefensesModule from '../game/defenses.js';
import { DEFENSES_FETCH_SUCCEEDED } from '../game/defenses.js';

import { computeActionCompletionTime } from '../game/actions.js';

import { TAB_OVERVIEW } from './NavigationMenu.jsx';
import { TAB_RESOURCES } from './NavigationMenu.jsx';
import { TAB_PRODUCTION_SETTINGS } from './NavigationMenu.jsx';
import { TAB_FACILITIES } from './NavigationMenu.jsx';
import { TAB_RESEARCH_LAB } from './NavigationMenu.jsx';
import { TAB_TECH_TREE } from './NavigationMenu.jsx';
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

      // Defines the list of buildings available for this
      // game: it corresponds to constant data fetched
      // from the server and describing the properties of
      // the buildings available in the game.
      buildings: [],

      // Defines the list of technologies available for this
      // game: it corresponds to constant data fetched
      // from the server and describing the properties of
      // the technologies available in the game.
      technologies: [],

      // Defines the list of ships available for this game:
      // it corresponds to constant data fetched from the
      // server and describing the properties of the ships
      // available in the game.
      ships: [],

      // Defines the list of defenses available for this game:
      // it corresponds to constant data fetched from the
      // server and describing the properties of the defenses
      // available in the game.
      defenses: [],

      // Defines the index of the selected planet among
      // the available list.
      selectedPlanet: -1,

      // Current tab displayed in the central view. This
      // allows to select various facets of the planet
      // currently selected and allows to build various
      // elements of the game.
      selectedTab: TAB_OVERVIEW,

      // The duration between each update interval of the
      // remaining time. Expressed in milliseconds.
      interval: 1000,
    };

    this.timer = 0;
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    // Fetch the data corresponding to this player's session
    // from the server.
    const server = new Server();
    const planets = new PlanetsModule(server);
    const resources = new ResourcesModule(server);
    const buildings = new BuildingsModule(server);
    const technologies = new TechnologiesModule(server);
    const ships = new ShipsModule(server);
    const defenses = new DefensesModule(server);

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

    // Fetch the buildings from the server.
    buildings.fetchBuildings()
      .then(function (res) {
        if (res.status !== BUILDINGS_FETCH_SUCCEEDED) {
          game.fetchDataFailed(res.status);
        }
        else {
          game.fetchBuildingsSucceeded(res.buildings);
        }
      })
      .catch(err => game.fetchDataFailed(err));

    // Fetch the technologies from the server.
    technologies.fetchTechnologies()
    .then(function (res) {
      if (res.status !== TECHNOLOGIES_FETCH_SUCCEEDED) {
        game.fetchDataFailed(res.status);
      }
      else {
        game.fetchTechnologiesSucceeded(res.technologies);
      }
    })
    .catch(err => game.fetchDataFailed(err));

    // Fetch the ships from the server.
    ships.fetchShips()
    .then(function (res) {
      if (res.status !== SHIPS_FETCH_SUCCEEDED) {
        game.fetchDataFailed(res.status);
      }
      else {
        game.fetchShipsSucceeded(res.ships);
      }
    })
    .catch(err => game.fetchDataFailed(err));

    // Fetch the defenses from the server.
    defenses.fetchDefenses()
    .then(function (res) {
      if (res.status !== DEFENSES_FETCH_SUCCEEDED) {
        game.fetchDataFailed(res.status);
      }
      else {
        game.fetchDefensesSucceeded(res.defenses);
      }
    })
    .catch(err => game.fetchDataFailed(err));

    this.timer = setInterval(this.countDown, this.state.interval);
  }

  countDown() {
    // The idea behind the countdown was taken from this link:
    // https://stackoverflow.com/questions/40885923/countdown-timer-in-react
    const planets = this.state.planets.slice();

    const now = Date.now();

    for (let id = 0 ; id < planets.length ; ++id) {
      // Update buildings upgrade.
      for (let ua = 0 ; ua < planets[id].buildings_upgrade.length ; ++ua) {
        const completion = Date.parse(planets[id].buildings_upgrade[ua].completion_time);
        const eta = completion - now;

        planets[id].buildings_upgrade[ua].eta = eta;

      }

      // Update technologies upgrade.
      for (let ua = 0 ; ua < planets[id].technologies_upgrade.length ; ++ua) {
        const completion = Date.parse(planets[id].technologies_upgrade[ua].completion_time);
        const eta = completion - now;

        planets[id].technologies_upgrade[ua].eta = eta;
      }

      // Update ships upgrade.
      for (let ua = 0 ; ua < planets[id].ships_construction.length ; ++ua) {
        planets[id].ships_construction[ua].eta = computeActionCompletionTime(planets[id].ships_construction[ua]);
      }

      // Update defenses upgrade.
      for (let ua = 0 ; ua < planets[id].defenses_construction.length ; ++ua) {
        planets[id].defenses_construction[ua].eta = computeActionCompletionTime(planets[id].defenses_construction[ua]);
      }
    }

    this.setState({
      planets: planets,
    });
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

  fetchBuildingsSucceeded(buildings) {
    // Update internal state.
    this.setState({
      buildings: buildings,
    });
  }

  fetchTechnologiesSucceeded(technologies) {
    // Update internal state.
    this.setState({
      technologies: technologies,
    });
  }

  fetchShipsSucceeded(ships) {
    // Update internal state.
    this.setState({
      ships: ships,
    });
  }

  fetchDefensesSucceeded(defenses) {
    // Update internal state.
    this.setState({
      defenses: defenses,
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

  actionPerformed() {
    // We should reload the planets available for this player.
    const server = new Server();
    const planets = new PlanetsModule(server);

    const game = this;

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

  updateGameTab(tab) {
    // Handle reload of data.
    this.actionPerformed();

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
        tab = <Resources planet={this.state.planets[this.state.selectedPlanet]}
                         player={this.props.session}
                         resources={this.state.resources}
                         buildings={this.state.buildings}
                         technologies={this.state.technologies}
                         ships={this.state.ships}
                         defenses={this.state.defenses}
                         universe={this.props.universe}
                         planets={this.state.planets}
                         actionPerformed={() => this.actionPerformed()}
                         />;
          break;
      case TAB_PRODUCTION_SETTINGS:
        tab = <ProductionSettings planet={this.state.planets[this.state.selectedPlanet]}
                                  player={this.props.session}
                                  resources={this.state.resources}
                                  buildings={this.state.buildings}
                                  technologies={this.state.technologies}
                                  ships={this.state.ships}
                                  defenses={this.state.defenses}
                                  universe={this.props.universe}
                                  planets={this.state.planets}
                                  actionPerformed={() => this.actionPerformed()}
                                  />;
        break;
      case TAB_FACILITIES:
        tab = <Facilities planet={this.state.planets[this.state.selectedPlanet]}
                          player={this.props.session}
                          resources={this.state.resources}
                          buildings={this.state.buildings}
                          technologies={this.state.technologies}
                          ships={this.state.ships}
                          defenses={this.state.defenses}
                          universe={this.props.universe}
                          planets={this.state.planets}
                          actionPerformed={() => this.actionPerformed()}
                          />;
          break;
      case TAB_RESEARCH_LAB:
        tab = <ResearchLab planet={this.state.planets[this.state.selectedPlanet]}
                           player={this.props.session}
                           resources={this.state.resources}
                           buildings={this.state.buildings}
                           technologies={this.state.technologies}
                           ships={this.state.ships}
                           defenses={this.state.defenses}
                           universe={this.props.universe}
                           planets={this.state.planets}
                           actionPerformed={() => this.actionPerformed()}
                           />;
          break;
      case TAB_TECH_TREE:
        tab = <TechnologyTree planet={this.state.planets[this.state.selectedPlanet]}
                              player={this.props.session}
                              resources={this.state.resources}
                              buildings={this.state.buildings}
                              technologies={this.state.technologies}
                              ships={this.state.ships}
                              defenses={this.state.defenses}
                              universe={this.props.universe}
                              planets={this.state.planets}
                              />;
        break;
      case TAB_SHIPYARD:
        tab = <Shipyard planet={this.state.planets[this.state.selectedPlanet]}
                        player={this.props.session}
                        resources={this.state.resources}
                        buildings={this.state.buildings}
                        technologies={this.state.technologies}
                        ships={this.state.ships}
                        defenses={this.state.defenses}
                        universe={this.props.universe}
                        planets={this.state.planets}
                        actionPerformed={() => this.actionPerformed()}
                        />;
          break;
      case TAB_DEFENSES:
        tab = <Defenses planet={this.state.planets[this.state.selectedPlanet]}
                        player={this.props.session}
                        resources={this.state.resources}
                        buildings={this.state.buildings}
                        technologies={this.state.technologies}
                        ships={this.state.ships}
                        defenses={this.state.defenses}
                        universe={this.props.universe}
                        planets={this.state.planets}
                        actionPerformed={() => this.actionPerformed()}
                        />;
          break;
      case TAB_FLEETS:
          tab = <Fleets planet={this.state.planets[this.state.selectedPlanet]}
                        actionPerformed={() => this.actionPerformed()}
                        />;
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
                            buildings={this.state.buildings}
                            resources={this.state.resources}
                            universe={this.props.universe}
                            />
          <div className="game_internal_layout">
            <NavigationMenu updateGameTab={(tab) => this.updateGameTab(tab)}/>
            <div className="game_center_layout">
              {this.generateCurrentTab()}
              <ConstructionList planet={this.state.planets[this.state.selectedPlanet]}
                                resources={this.state.resources}
                                buildings={this.state.buildings}
                                technologies={this.state.technologies}
                                ships={this.state.ships}
                                defenses={this.state.defenses}
                                />
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
