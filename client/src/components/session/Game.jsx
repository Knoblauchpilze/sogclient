
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
import Rankings from './Rankings.jsx';

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
import FleetObjectivesModule from '../game/fleet_objectives.js';
import { FLEET_OBJECTIVES_FETCH_SUCCEEDED } from '../game/fleet_objectives.js';
import PlayersModule from '../game/players.js';
import { PLAYERS_FETCH_SUCCEEDED, FLEETS_FETCH_SUCCEEDED } from '../game/players.js';
import UniversesModule from '../game/universes.js';
import { RANKINGS_FETCH_SUCCEEDED } from '../game/universes.js';

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
import { TAB_RANKINGS } from './NavigationMenu.jsx';

// A string literal defining a planet body, which
// indicates that the selected body is to be found
// in the planets list.
const SELECTED_PLANET = "selected_planet";

// A string literal defining a moon, which indicates
// that the selected body is to be found in the moons
// list.
const SELECTED_MOON = "selected_moon";

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines the list of planets available for this
      // game: it corresponds to the planets owned by
      // the player currently logged in.
      planets: [],

      // Defines the list of fleets that originates or
      // target any of the player's planets.
      fleets: {
        regular: 0,
        expeditions: 0,
        data: [],
      },

      // Defines the list of moons available for this
      // game: it corresponds to all the moons owned by
      // the player currently logged in.
      moons: [],

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

      // Defines the list of fleet objectives available for
      // this game: it corresponds to the data to send fleets
      // on a specific mission.
      fleetObjectives: [],

      // Defines the list of players available for the universe
      // associated to the current session.
      players: [],

      // Defines the rankings for the universe the session
      // is currently associated to.
      rankings: [],

      // Defines the index of the selected planet/moon among
      // the available list.
      selected: {
        body: SELECTED_PLANET,
        index: -1,
      },

      // Current tab displayed in the central view. This
      // allows to select various facets of the planet
      // currently selected and allows to build various
      // elements of the game.
      selectedTab: TAB_OVERVIEW,

      // The duration between each update interval of the
      // remaining time. Expressed in milliseconds.
      interval: 1000,

      // The data for the system currently selected in the
      // galaxy view. Contains all the relevant info that
      // needs to be fetched to display the galaxy view.
      system_data: {
        // The current coordinate of the solar system displayed
        // in the galaxy view.
        coordinates: {
          galaxy: -1,
          system: -1,
        },

        // The list of planets existing in the system.
        planets: [],
      },
    };

    this.timer = 0;
    this.countDown = this.countDown.bind(this);
    this.updateSelectedPlanet = this.updateSelectedPlanet.bind(this);
    this.updateSelectedMoon = this.updateSelectedMoon.bind(this);
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
    const objectives = new FleetObjectivesModule(server);
    const players = new PlayersModule(server);
    const universes = new UniversesModule(server);

    const game = this;

    // Fetch the planets from the server for the
    // player that is currently logged in.
    planets.fetchPlanetsForPlayer(this.props.session.id)
      .then(function (res) {
        if (res.status !== PLANETS_FETCH_SUCCEEDED) {
          game.fetchDataFailed(res.status);
        }
        else {
          game.fetchPlanetsSucceeded(res.planets, true);
        }
      })
      .catch(err => game.fetchDataFailed(err));

    // Fetch the moons from the server for the
    // player that is currently logged in.
    planets.fetchMoonsForPlayer(this.props.session.id)
    .then(function (res) {
      if (res.status !== PLANETS_FETCH_SUCCEEDED) {
        game.fetchDataFailed(res.status);
      }
      else {
        game.fetchMoonsSucceeded(res.moons);
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

    // Fetch the fleet objectives from the server.
    objectives.fetchObjectives()
    .then(function (res) {
      if (res.status !== FLEET_OBJECTIVES_FETCH_SUCCEEDED) {
        game.fetchDataFailed(res.status);
      }
      else {
        game.fetchFleetObjectivesSucceeded(res.objectives);
      }
    })
    .catch(err => game.fetchDataFailed(err));

    // Fetch the players from the server.
    players.fetchPlayersForUniverse(this.props.session.universe)
    .then(function (res) {
      if (res.status !== PLAYERS_FETCH_SUCCEEDED) {
        game.fetchDataFailed(res.status);
      }
      else {
        game.fetchPlayersSucceeded(res.players);
      }
    })
    .catch(err => game.fetchDataFailed(err));

    // Fetch the rankings from the server for the
    // player that is currently logged in.
    universes.fetchRankings(this.props.session.universe)
      .then(function (res) {
        if (res.status !== RANKINGS_FETCH_SUCCEEDED) {
          game.fetchDataFailed(res.status);
        }
        else {
          game.fetchRankingsSucceeded(res.rankings);
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

  fetchPlanetsSucceeded(planets, updateSystem) {
    // Update internal state: we also define the planet
    // selected to be the first one.
    this.setState({
      planets: planets,
      selected: {
        body: SELECTED_PLANET,
        index: 0,
      },
    });

    console.info("Fetched " + planets.length + " planet(s) for " + this.props.session.id);

    // Update the selected system if needed.
    if (updateSystem) {
      this.updateSelectedSystem(
        // The `+1` comes from the fact that we expect the data
        // to come from the UI where it has an offset of 1.
        planets[0].coordinate.galaxy + 1,
        planets[0].coordinate.system + 1,
      );
    }

    // Fetch the fleets attached to each planets associated to
    // the player.
    const server = new Server();
    const players = new PlayersModule(server);

    const game = this;

    const pIDs = planets.map(p => p.id);

    players.fetchFleetsForPlayer(this.props.session.universe, pIDs)
      .then(function (res) {
        if (res.status !== FLEETS_FETCH_SUCCEEDED) {
          game.fetchDataFailed(res.status);
        }
        else {
          game.fetchFleetsSucceeded(res.fleets);
        }
      })
      .catch(err => game.fetchDataFailed(err));
  }

  fetchFleetsSucceeded(fleets) {
    // Interpret how many fleets there are for each time in
    // case we have the fleets objectives available. We can
    // still do that later if needed.
    let reg = 0;
    let exp = 0;

    if (this.state.fleetObjectives.length > 0) {
      // Fetch the identifier of the expeditions objective.
      let expID = "";
      const expObj = this.state.fleetObjectives.find(o => o.name === "expedition");
      if (expObj) {
        expID = expObj.id;
      }
      else {
        console.error("Failed to find expedition objective from server's data");
      }

      for (let id = 0 ; id < fleets.length ; ++id) {
        const p = fleets[id];

        for (let fID = 0 ; fID < p.outgoing.length ; ++fID) {
          const f = p.outgoing[fID];

          if (f.objective === expID) {
            exp++;
          }
          else {
            reg++;
          }
        }
      }

      console.info("Fetched " + reg + " and " + exp + " expedition(s) for player");
    }

    // Update internal state.
    this.setState({
      fleets: {
        regular: reg,
        expeditions: exp,
        data: fleets,
      }
    });
  }

  fetchMoonsSucceeded(moons) {
    // Update internal state.
    this.setState({
      moons: moons,
    });
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

  fetchFleetObjectivesSucceeded(objectives) {
    // Update the fleets to account for the expeditions and
    // the regular fleets. We do it only in case the total
    // amount of fleets does not match the count which is
    // needed from the data.
    let expID = "";
    const expObj = objectives.find(o => o.name === "expedition");
    if (expObj) {
      expID = expObj.id;
    }
    else {
      console.error("Failed to find expedition objective from server's data");
    }

    let fleets = this.state.fleets;

    for (let id = 0 ; id < fleets.data ; ++id) {
      const p = fleets.data[id];

      for (let fID = 0 ; fID < p.outgoing.length ; ++fID) {
        const f = p.outgoing[fID];

        if (f.objective === expID) {
          fleets.expeditions++;
        }
        else {
          fleets.regular++;
        }
      }
    }

    // Update internal state.
    this.setState({
      fleets: fleets,
      fleetObjectives: objectives,
    });
  }

  fetchSystemSucceeded(galaxy, system, planets) {
    // Update internal state: we need to register the planets of
    // the current system along with the coordinates.
    this.setState({
      system_data: {
        coordinates: {
          galaxy: galaxy + 1,
          system: system + 1,
        },
        planets: planets,
      }
    });

    console.info("Fetched " + planets.length + " planet(s) for system " + galaxy + ":" + system);
  }

  fetchPlayersSucceeded(players) {
    // Update internal state.
    this.setState({
      players: players,
    });
  }

  fetchRankingsSucceeded(rankings) {
    // Update internal state.
    this.setState({
      rankings: rankings,
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
      selected: {
        body: SELECTED_PLANET,
        index: id,
      },
    });
  }

  updateSelectedMoon(id) {
    // Update the selected moon index if it is
    // valid compared to the list of available
    // moons.
    if (id < 0 || id >= this.state.moons.length) {
      console.error("Can't select moon " + id + " among [0 - " + this.state.moons.length + "]");
      return;
    }

    console.info("Selected moon " + this.state.moons[id].id);

    this.setState({
      selected: {
        body: SELECTED_MOON,
        index: id,
      },
    });
  }

  updateSelectedSystem(galaxy, system) {
    // Prevent out of bounds requests.
    const iGalaxy = parseInt(galaxy, 10) - 1;
    const iSystem = parseInt(system, 10) - 1;

    if (iGalaxy < 0 || iGalaxy >= this.props.universe.galaxies_count) {
      return;
    }
    if (iSystem < 0 || iSystem >= this.props.universe.galaxy_size) {
      return;
    }

    // Trigger a fetching of the data for the solar
    // system that will be selected.
    const server = new Server();
    const planets = new PlanetsModule(server);

    const game = this;

    planets.fetchPlanetsForSystem(iGalaxy, iSystem, this.props.session.universe)
      .then(function (res) {
        if (res.status !== PLANETS_FETCH_SUCCEEDED) {
          game.fetchDataFailed(res.status);
        }
        else {
          game.fetchSystemSucceeded(res.galaxy, res.system, res.planets);
        }
      })
      .catch(err => game.fetchDataFailed(err));
  }

  moveToGalaxyView(galaxy, system) {
    // We need to request the tab to switch to galaxy
    // view, and also update the selected system.
    this.updateGameTab(TAB_GALAXY, false);
    this.updateSelectedSystem(galaxy, system);
  }

  moveToRankingsView(player) {
    this.updateGameTab(TAB_RANKINGS, false);
    // TODO: Handle the update of the selected page.
  }

  actionPerformed(updateSystem) {
    // We should reload the planets available for this player.
    const server = new Server();
    const planets = new PlanetsModule(server);

    const game = this;

    planets.fetchPlanetsForPlayer(this.props.session.id)
      .then(function (res) {
        if (res.status !== PLANETS_FETCH_SUCCEEDED) {
          game.fetchDataFailed(res.status);
        }
        else {
          game.fetchPlanetsSucceeded(res.planets, updateSystem);
        }
      })
      .catch(err => game.fetchDataFailed(err));

    // Request parent component to update technologies.
    this.props.updatePlayerData();
  }

  updateGameTab(tab, updateSystem) {
    // Handle reload of data.
    this.actionPerformed(updateSystem);

    // Update the tab displayed on the central view
    // of the game.
    this.setState({
      selectedTab: tab,
    });
  }

  generateCurrentTab() {
    let tab;

    // Fetch the selected planet or moon.
    let body = {};
    if (this.state.selected.body === SELECTED_PLANET) {
      body = this.state.planets[this.state.selected.index];
    }
    else {
      body = this.state.moons[this.state.selected.index];
    }

    switch (this.state.selectedTab) {
      case TAB_RESOURCES:
        tab = <Resources planet={body}
                         player={this.props.session}
                         resources={this.state.resources}
                         buildings={this.state.buildings}
                         technologies={this.state.technologies}
                         ships={this.state.ships}
                         defenses={this.state.defenses}
                         universe={this.props.universe}
                         planets={this.state.planets}
                         actionPerformed={() => this.actionPerformed(true)}
                         />;
          break;
      case TAB_PRODUCTION_SETTINGS:
        tab = <ProductionSettings planet={body}
                                  player={this.props.session}
                                  resources={this.state.resources}
                                  buildings={this.state.buildings}
                                  technologies={this.state.technologies}
                                  ships={this.state.ships}
                                  defenses={this.state.defenses}
                                  universe={this.props.universe}
                                  planets={this.state.planets}
                                  actionPerformed={() => this.actionPerformed(true)}
                                  />;
        break;
      case TAB_FACILITIES:
        tab = <Facilities planet={body}
                          player={this.props.session}
                          resources={this.state.resources}
                          buildings={this.state.buildings}
                          technologies={this.state.technologies}
                          ships={this.state.ships}
                          defenses={this.state.defenses}
                          universe={this.props.universe}
                          planets={this.state.planets}
                          actionPerformed={() => this.actionPerformed(true)}
                          />;
          break;
      case TAB_RESEARCH_LAB:
        tab = <ResearchLab planet={body}
                           player={this.props.session}
                           resources={this.state.resources}
                           buildings={this.state.buildings}
                           technologies={this.state.technologies}
                           ships={this.state.ships}
                           defenses={this.state.defenses}
                           universe={this.props.universe}
                           planets={this.state.planets}
                           actionPerformed={() => this.actionPerformed(true)}
                           />;
          break;
      case TAB_TECH_TREE:
        tab = <TechnologyTree planet={body}
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
        tab = <Shipyard planet={body}
                        player={this.props.session}
                        resources={this.state.resources}
                        buildings={this.state.buildings}
                        technologies={this.state.technologies}
                        ships={this.state.ships}
                        defenses={this.state.defenses}
                        universe={this.props.universe}
                        planets={this.state.planets}
                        actionPerformed={() => this.actionPerformed(true)}
                        />;
          break;
      case TAB_DEFENSES:
        tab = <Defenses planet={body}
                        player={this.props.session}
                        resources={this.state.resources}
                        buildings={this.state.buildings}
                        technologies={this.state.technologies}
                        ships={this.state.ships}
                        defenses={this.state.defenses}
                        universe={this.props.universe}
                        planets={this.state.planets}
                        actionPerformed={() => this.actionPerformed(true)}
                        />;
          break;
      case TAB_FLEETS:
          tab = <Fleets planet={body}
                        player={this.props.session}
                        fleets={this.state.fleets}
                        resources={this.state.resources}
                        buildings={this.state.buildings}
                        technologies={this.state.technologies}
                        ships={this.state.ships}
                        defenses={this.state.defenses}
                        fleet_objectives={this.state.fleetObjectives}
                        universe={this.props.universe}
                        planets={this.state.planets}
                        actionPerformed={() => this.actionPerformed()}
                        viewSystem={(galaxy, system) => this.moveToGalaxyView(galaxy, system)}
                        />;
          break;
      case TAB_GALAXY:
          tab = <Galaxy planet={body}
                        player={this.props.session}
                        fleets={this.state.fleets}
                        ships={this.state.ships}
                        defenses={this.state.defenses}
                        system={this.state.system_data}
                        universe={this.props.universe}
                        players={this.state.players}
                        updateSystem={(galaxy, system) => this.updateSelectedSystem(galaxy, system)}
                        />;
          break;
      case TAB_RANKINGS:
        tab = <Rankings planet={body}
                        player={this.props.session}
                        universe={this.props.universe}
                        players={this.state.players}
                        />;
          break;
      case TAB_OVERVIEW:
      default:
        tab = <Overview planet={body}
                        player={this.props.session}
                        rankings={this.state.rankings}
                        viewSystem={(galaxy, system) => this.moveToGalaxyView(galaxy, system)}
                        viewRankings={(player) => this.moveToRankingsView(player)}
                        />;
        break;
    }

    return tab;
  }

  render() {
    let p = {
      resources: [],
      buildings: [],
      buildings_upgrade: [],
      technologies_upgrade: [],
      ships_construction: [],
      defenses_construction: [],
    };
    if (this.state.selected.body === SELECTED_PLANET) {
      p = this.state.planets[this.state.selected.index];
    }
    else {
      p = this.state.moons[this.state.selected.index];
    }

    return (
      <div className="game_layout">
        <div className="game_page_layout">
          <ResourcesDisplay planet={p}
                            buildings={this.state.buildings}
                            resources={this.state.resources}
                            universe={this.props.universe}
                            />
          <div className="game_internal_layout">
            <NavigationMenu updateGameTab={(tab) => this.updateGameTab(tab, true)}/>
            <div className="game_center_layout">
              {this.generateCurrentTab()}
              <ConstructionList planet={p}
                                resources={this.state.resources}
                                buildings={this.state.buildings}
                                technologies={this.state.technologies}
                                ships={this.state.ships}
                                defenses={this.state.defenses}
                                />
            </div>
            <PlanetsList planets={this.state.planets}
                         moons={this.state.moons}
                         player={this.props.session}
                         selected={this.state.selected.index}
                         isPlanet={(this.state.selected.body === SELECTED_PLANET)}
                         updateSelectedPlanet={id => this.updateSelectedPlanet(id)}
                         updateSelectedMoon={id => this.updateSelectedMoon(id)}
                         viewSystem={(galaxy, system) => this.moveToGalaxyView(galaxy, system)}
                         />
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
