
import '../../styles/session/Fleets.css';
import '../../styles/session/Game.css';

import React from 'react';
import FleetShip from './FleetShip.jsx';
import FleetObjective from './FleetObjective.jsx';

import planet from '../../assets/fleets/planet.png';
import moon from '../../assets/fleets/moon.png';
import debris from '../../assets/fleets/debris.png';

import {resources_list} from '../../datas/resources.js';
import {ships_list} from '../../datas/ships.js';
import { CIVIL_SHIP, COMBAT_SHIP } from '../../datas/ships.js';

import Server from '../game/server.js';

import Planet from '../game/planet.js';
import { FLEET_CREATION_POST_SUCCEEDED } from '../game/planet.js';

import PlanetsModule from '../game/planets.js';
import { PLANETS_FETCH_SUCCEEDED } from '../game/planets.js';

import {fleet_objectives_list} from '../../datas/fleet_objectives.js';

import { toFixedDigits, formatDuration, formatAmount } from '../game/amounts.js';
import { computeDistance, computeDuration, computeConsumption, computeMaxSpeed } from '../game/fleet.js';
import { computeFleetSlots } from '../game/rules.js';

// Defines the initial step of the fleets view where the
// player can select ships to include in the fleet.
const FLEET_INIT = "fleet_init";

// Defines the step where the player is able to select
// the destination of the fleet and the flight speed.
const FLEET_FLIGHT = "fleet_flight";

// Defines the step where the player is asked to choose
// the objective of the fleet along with the cargo that
// will be carried with it.
const FLEET_OBJECTIVE = "fleet_objective";

// Defines a string literal for an undefined fleet
// objective.
const UNDEFINED_OBJECTIVE = "Undefined";

// Defines a string literal for an allied target.
const TARGET_FRIENDLY = "friendly";

// Defines a string literal for a neutral target.
const TARGET_NEUTRAL = "neutral";

// Defines a string literal for a hostile body.
const TARGET_HOSTILE = "hostile";

// A string literal for a location that is not claimed
// by any player yet.
const TARGET_NOT_CREATED = "Uncharted territory";

// A string literal for an inexisting player.
const TARGET_NOT_OWNED = "Not owned";

function formatDate(date) {
  const d = toFixedDigits(date.getDate(), 2);
  const m = toFixedDigits(date.getMonth() + 1, 2);
  const y = date.getFullYear();

  const h = toFixedDigits(date.getHours(), 2);
  const mn = toFixedDigits(date.getMinutes(), 2);
  const s = toFixedDigits(date.getSeconds(), 2);

  return d + "." + m + "." + y + " " + h + ":" + mn + ":" + s;
}

function computeFlightDetails(source, target, speed, ratio, consoRatio, ships, technologies, shipsData, resourcesData) {
  // First, compute the distance from the source to
  // the target.
  const distance = computeDistance(source, target);

  // Generate ships data based on the selected ships
  // and the technologies available.
  let shps = [];
  for (let id = 0 ; id < ships.length ; ++id) {
    const shp = ships[id];
    let sDesc = shipsData.find(s => s.id === shp.id);

    if (!sDesc) {
      console.error("Failed to get data for ship \"" + shp.id + "\"");
      continue;
    }

    sDesc.count = shp.selected;

    shps.push(sDesc);
  }

  // Compute duration of the flight for this fleet.
  const duration = computeDuration(distance, speed, ratio, shps, technologies);

  // Compute consumption. We will select the conso
  // only for deuterium.
  const consumption = computeConsumption(distance, duration, 0, ratio, consoRatio, shps, technologies);

  let conso = 0;
  const deut = resourcesData.find(r => r.name === "deuterium");
  if (!deut) {
    console.error("Failed to find description for deuterium from server's data");
  }
  else {
    const dCons = consumption.find(c => c.resource === deut.id);
    if (!dCons) {
      console.error("Fleet does not seem to use any deuterium");
    }
    else {
      conso = Math.ceil(dCons.amount);
    }
  }

  // Compute the maximum speed for this fleet.
  const maxSpeed = computeMaxSpeed(shps, technologies);

  // Generate output object.
  return {
    distance: distance,
    duration: duration,
    consumption: conso,
    maxSpeed: maxSpeed,
  };
}

function hasShips(ships, ship, selected) {
  const sDesc = ships.find(s => s.name === ship);
  let available = false;
  if (sDesc) {
    available = selected.findIndex(s => s.id === sDesc.id) >= 0;
  }

  return available;
}

class Fleets extends React.Component {
  constructor(props) {
    super(props);

    // Generate the cargo resources from the properties.
    let cargoDesc = [];
    for (let id = 0 ; id < resources_list.length ; ++id) {
      const rData = resources_list[id];
      const rDesc = props.resources.find(r => r.name === rData.name);
      if (!rDesc) {
        console.error("Failed to fetch data for resource \"" + rData.name + "\"");
        continue;
      }

      // Only consider movable resources.
      if (!rDesc.movable) {
        continue;
      }

      cargoDesc.push({
        resource: rDesc.id,
        name: rData.name,
        amount: 0,
        icon: rData.icon,
      });
    }

    let fObjectives = [];
    for (let id = 0 ; id < fleet_objectives_list.length ; ++id) {
      const fo = fleet_objectives_list[id];

      fObjectives.push({
        name: fo.name,
        key: fo.key,
        icon: fo.icon,
        description: fo.description,
        selectable: true,
      });
    }

    this.state = {
      // Defines the current state of the fleets view as
      // an enumeration: this allows to adapt the items
      // that are displayed.
      step: FLEET_INIT,

      // Defines the amount of ships selected for each
      // of the available item.
      selected: [],

      // The index of the selected planet, as an identifier
      // of the planet or a string literal indicating that
      // no planet is selected.
      selectedPlanet: props.planet.id,

      // Defines whether or not the user can move on to
      // the next step of the fleet creation.
      validStep: false,

      // Defines the destination that has been selected
      // for this fleet and the properties of the flight.
      destination: {
        target: props.planet.id,
        name: props.planet.name,

        coordinate: {
          galaxy: props.planet.coordinate.galaxy,
          system: props.planet.coordinate.system,
          position: props.planet.coordinate.position,
          location: "debris",
        },

        // Assume the destination exists.
        exist: true,

        // And that it does not belong to the player.
        faction: TARGET_NEUTRAL,

        // So no player name is defined.
        player: TARGET_NOT_OWNED,

        // At first, the distance is set to `5`.
        distance: 5,
      },

      // The speed at which the fleet will move in the
      // galaxy. Can be anything between 0 and 1.
      flight_speed: 1.0,

      // The duration of the flight in milliseconds.
      flight_duration: 60000,

      // The consumption of the flight in units.
      flight_consumption: 0,

      // The amount of cargo available for this fleet.
      cargo: 0,

      // The amount of used cargo for this fleet.
      used_cargo: 0,

      // The maximum speed that can be reached by the
      // fleet assuming a 100% speed.
      speed: 1.0,

      // The cargo transported by the fleet.
      cargo_desc: cargoDesc,

      // Defines the properties of the mission that this
      // fleet will be tasked with.
      mission: {
        objective: UNDEFINED_OBJECTIVE,
        text: "Undefined",
      },

      // Whether or not fleet objectives are available given
      // the current fleet composition.
      fleet_objectives: fObjectives,
    };

    this.updateFleetStep = this.updateFleetStep.bind(this);
    this.updateObjective = this.updateObjective.bind(this);
    this.selectShips = this.selectShips.bind(this);
    this.selectDestination = this.selectDestination.bind(this);
    this.addCargo = this.addCargo.bind(this);
    this.addAllCargo = this.addAllCargo.bind(this);
    this.removeAllCargo = this.removeAllCargo.bind(this);
  }

  fetchDataFailed(err) {
    alert(err);
  }

  fetchSystemSucceeded(galaxy, system, planets) {
    // Fetch the planet based on the position requested for
    // the fleet's destination.
    let exist = false;
    let status = TARGET_NEUTRAL;
    let target = "";
    let name = TARGET_NOT_CREATED;
    let player = TARGET_NOT_OWNED;

    let destination = this.state.destination;

    const planet = planets.find(p => p.coordinate.position === destination.coordinate.position);
    if (planet) {
      // The planet does exist: check whether it belongs to
      // this player or not.
      exist = true;
      status = (planet.player === this.props.player.id ? TARGET_FRIENDLY : TARGET_HOSTILE);

      target = planet.id;
      name = planet.name;
      player = planet.player_name;
    }

    destination.exist = exist;
    destination.faction = status;

    destination.target = target;
    destination.name = name;
    destination.player = player;

    this.setState({
      destination: destination,
    });
  }

  createFleetSucceeded(fleet) {
    console.info("Successfully created fleet \"" + fleet + "\"");

    // Reset the properties so that we can send a new fleet.
    let cargoDesc = this.state.cargo_desc;
    cargoDesc.forEach(c => c.amount = 0);

    let fObjectives = this.state.fleet_objectives;
    fObjectives.forEach(e => e.selectable = false);

    this.setState({
      step: FLEET_INIT,

      selected: [],
      selectedPlanet: this.props.planet.id,
      validStep: false,

      destination: {
        target: this.props.planet.id,
        name: this.props.planet.name,

        coordinate: {
          galaxy: this.props.planet.coordinate.galaxy,
          system: this.props.planet.coordinate.system,
          position: this.props.planet.coordinate.position,
          location: "debris",
        },

        exist: true,
        faction: TARGET_NEUTRAL,
        player: TARGET_NOT_OWNED,
        distance: 5,
      },

      flight_speed: 1.0,
      flight_duration: 60000,
      flight_consumption: 0,
      cargo: 0,
      used_cargo: 0,
      speed: 1.0,

      // The cargo transported by the fleet.
      cargo_desc: cargoDesc,

      mission: {
        objective: UNDEFINED_OBJECTIVE,
        text: "Undefined",
      },

      // Whether or not fleet objectives are available given
      // the current fleet composition.
      fleet_objectives: fObjectives,
    });
  }

  validateStep(step, destination, selected, conso, cargo) {
    let valid = false;

    if (step === FLEET_INIT) {
      valid = selected.length > 0;
    }
    else if (step === FLEET_FLIGHT) {
      // We have to make sure that:
      //   - there's enough fuel on the planet.
      //   - there's enough space in the fuel tank.
      //   - the destination is not identical to the
      //     the starting location.
      const rDesc = this.props.resources.find(r => r.name === "deuterium");
      if (!rDesc) {
        console.error("Failed to fetch resource description for deuterium from server data");
        return;
      }

      const rData = this.props.planet.resources.find(r => r.resource === rDesc.id);
      if (!rData) {
        console.error("Failed to fetch deuterium data for planet");
        return;
      }

      const validCoords = (
        destination.galaxy !== this.props.planet.coordinate.galaxy ||
        destination.system !== this.props.planet.coordinate.system ||
        destination.position !== this.props.planet.coordinate.position ||
        destination.location !== this.props.planet.coordinate.location
      );

      valid = validCoords && conso <= cargo && conso < rData.amount;
    }
    else {
      // Case of a fleet objective.
      valid = true;
    }

    return valid;
  }

  updateFleetStep(step, next) {
    // Only allow to move to the next step based on the
    // valid state.
    if (next && !this.state.validStep) {
      return;
    }

    // We also want to take into account whether or not a recycler is
    // selected in the fleet, which would determine if the harvesting
    // mission is allowed and if the location is allowed to be debris.
    let destination = this.state.destination;

    const hasRec = hasShips(this.props.ships, "recycler", this.state.selected);
    if (this.state.destination.coordinate.location === "debris" && !hasRec) {
      destination.coordinate.location = "planet";
    }

    // In case the coordinate indicate a debris, update the mission
    // to be harvesting. Otherwise, assume transport. We also want
    // to only update it in case it is still set to undefined.
    const fo = this.updateSelectableObjectives(this.state.selected, destination.coordinate);

    if (this.state.mission.objective === UNDEFINED_OBJECTIVE) {
      this.updateObjective(destination.coordinate.location === "debris" ? "harvesting" : "transport");
    }

    this.setState({
      step: step,
      destination: destination,
      validStep: this.validateStep(step, destination.coordinate, this.state.selected, this.state.flight_consumption, this.state.cargo),
      objectives: fo,
    });
  }

  updateSelectableObjectives(selected, coordinate) {
    let fo = this.state.fleet_objectives;

    // Traverse the list of objectives and determine whether
    // each one is valid or not.
    for (let id = 0 ; id < fo.length ; ++id) {
      let selectable = false;

      switch (fo[id].key) {
        case "expedition":
          selectable = coordinate.position >= this.props.universe.solar_system_size;
          break;
        case "colonization":
          selectable = (
            coordinate.location === "planet" &&
            hasShips(this.props.ships, "colony ship", selected) &&
            this.state.destination.exist === false
          );
          break;
        case "harvesting":
          selectable = (
            coordinate.location === "debris" &&
            hasShips(this.props.ships, "recycler", selected)
          );
          break;
        case "transport":
          selectable = (
            coordinate.location !== "debris" &&
            this.state.destination.exist === true
          );
          break;
        case "deployment":
          selectable = (
            coordinate.location !== "debris" &&
            this.state.destination.exist === true &&
            this.state.destination.faction === TARGET_FRIENDLY
          );
          break;
        case "espionage":
          selectable = (
            coordinate.location !== "debris" &&
            hasShips(this.props.ships, "espionage probe", selected) &&
            this.state.destination.exist === true &&
            this.state.destination.faction === TARGET_HOSTILE
          );
          break;
        case "ACS defend":
          selectable = (
            coordinate.location !== "debris" &&
            this.state.destination.exist === true &&
            this.state.destination.faction === TARGET_HOSTILE
          );
          break;
        case "attacking":
          selectable = (
            coordinate.location !== "debris" &&
            this.state.destination.exist === true &&
            this.state.destination.faction === TARGET_HOSTILE
          );
          break;
        case "destroy":
          selectable = (
            coordinate.location === "moon" &&
            hasShips(this.props.ships, "deathstar", selected) &&
            this.state.destination.exist === true &&
            this.state.destination.faction === TARGET_HOSTILE
          );
          break;
        case "ACS attack":
          selectable = (
            coordinate.location !== "debris" &&
            this.state.destination.exist === true &&
            this.state.destination.faction === TARGET_HOSTILE
          );
          break;
        default:
          console.error("Failed to update unknown fleet objective \"" + fo[id].key + "\"");
          break;
      }

      fo[id].selectable = selectable;
    }

    return fo;
  }

  requestFleetSending() {
    // Only process the request if the fleet is ready to be sent.
    if (!this.state.validStep) {
      return;
    }

    // Create an object to handle the creation of the fleet.
    const p = new Planet(
      this.props.planet,
      this.props.player.technologies,
      this.props.planets,
      this.props.universe,
      this.props.resources,
      this.props.buildings,
      this.props.technologies,
      this.props.ships,
      this.props.defenses,
    );

    const tab = this;

    // Generate the fleet object.
    const fleet = {
      universe: this.props.universe.id,
      objective: this.state.mission.objective,
      player: this.props.player.id,
      source: this.props.planet.id,
      source_type: "planet",
      target_coordinates: this.state.destination.coordinate,
      target: this.state.destination.target,
      acs: "", // TODO: Handle ACS.
      speed: this.state.flight_speed,
      deployment_time: 0, // TODO: Handle deployment time.
      ships: [],
      cargo: [],
    };

    // Generate ships.
    for (let id = 0 ; id < this.state.selected.length ; ++id) {
      const s = this.state.selected[id];

      fleet.ships.push({
        ship: s.id,
        count: s.selected,
      });
    }

    // Generate cargo.
    for (let id = 0 ; id < this.state.cargo_desc.length ; ++id) {
      const c = this.state.cargo_desc[id];
      if (c.amount <= 0) {
        continue;
      }

      fleet.cargo.push({
        resource: c.resource,
        amount: c.amount,
      });
    }

    p.createFleet(fleet)
      .then(function (res) {
        if (res.status !== FLEET_CREATION_POST_SUCCEEDED) {
          tab.fetchDataFailed(res.status);
        }
        else {
          tab.createFleetSucceeded(res.fleet);
        }
      })
      .catch(err => tab.fetchDataFailed(err));
  }

  selectShips(ship, amount) {
    // Check whether this ship already is selected.
    const sID = this.state.selected.findIndex(s => s.id === ship);
    let iAmount = parseInt(amount, 10);
    if (amount === "") {
      iAmount = 0;
    }

    let select = {
      id: ship,
      selected: iAmount,
    };

    // Validate the amount based on what is available
    // on the planet.
    if (!this.props.planet || this.props.planet.ships.length === 0) {
      // No data yet, can't validate, disable the selection.
      return;
    }
    const sData = this.props.planet.ships.find(s => s.id === ship);
    if (!sData) {
      // Failed to fetch planet's data for this ship, prevent
      // any selection.
      console.error("Failed to validate data for ship \"" + ship + "\"");
      return;
    }
    iAmount = Math.max(Math.min(iAmount, sData.amount), 0);
    select.selected = iAmount;

    // Update or register the selected ships.
    let selected = this.state.selected.slice();
    if (sID !== -1) {
      if (iAmount === 0) {
        selected.splice(sID, 1);
      }
      else {
        selected[sID] = select;
      }
    }
    else {
      // Register the amount: we will prevent this in
      // case the amount is `0` as we don't need to set
      // an amount of `0`.
      if (iAmount === 0) {
        return;
      }

      selected.push(select);
    }

    // Update cargo space.
    let cargo = 0;
    for (let id = 0 ; id < selected.length ; ++id) {
      const s = selected[id];
      if (this.props.planet.ships.length === 0) {
        continue;
      }

      const sDesc = this.props.ships.find(shp => shp.id === s.id);
      if (sDesc) {
        cargo += (sDesc.cargo * s.selected);
      }
    }

    // Compute the duration of the flight.
    const fDetails = computeFlightDetails(
      this.props.planet.coordinate,
      this.state.destination.coordinate,
      this.state.flight_speed,
      1.0 / this.props.universe.fleet_speed,
      this.props.universe.fleets_consumption_ratio,
      selected,
      this.props.player.technologies,
      this.props.ships,
      this.props.resources
    );

    // Reset the cargo description.
    let updated = this.state.cargo_desc;
    for (let id = 0 ; id < updated.length ; ++id) {
      updated[id].amount = 0;
    }

    // Update the selectable fleet objectives.
    const objectives = this.updateSelectableObjectives(selected, this.state.destination.coordinate);

    this.setState({
      selected: selected,
      cargo: cargo,
      used_cargo: 0,
      flight_duration: fDetails.duration,
      flight_consumption: fDetails.consumption,
      speed: fDetails.maxSpeed,
      validStep: (selected.length > 0),
      cargo_desc: updated,
      // Reset the mission objective.
      mission: {
        objective: UNDEFINED_OBJECTIVE,
        text: "Undefined",
      },
      objectives: objectives,
    });
  }

  selectAllShips() {
    // In case no data has been fetched from the server,
    // do nothing.
    if (!this.props.planet || this.props.planet.ships.length === 0) {
      return;
    }

    // Otherwise, select all ships that have a value of
    // at least 0. We will accumulate the cargo space
    // as well.
    let cargo = 0;
    let selected = [];

    for (let id = 0 ; id < this.props.planet.ships.length ; ++id) {
      const s = this.props.planet.ships[id];
      if (s.amount === 0) {
        continue;
      }

      const sDesc = this.props.ships.find(shp => shp.id === s.id);
      if (sDesc) {
        cargo += (sDesc.cargo * s.amount);
      }

      selected.push({
        id: s.id,
        selected: s.amount,
      });
    }

    // Compute the duration of the flight.
    const fDetails = computeFlightDetails(
      this.props.planet.coordinate,
      this.state.destination.coordinate,
      this.state.flight_speed,
      1.0 / this.props.universe.fleet_speed,
      this.props.universe.fleets_consumption_ratio,
      selected,
      this.props.player.technologies,
      this.props.ships,
      this.props.resources
    );

    // Reset the cargo description.
    let updated = this.state.cargo_desc;
    for (let id = 0 ; id < updated.length ; ++id) {
      updated[id].amount = 0;
    }

    // Update the selectable fleet objectives.
    const objectives = this.updateSelectableObjectives(selected, this.state.destination.coordinate);

    this.setState({
      selected: selected,
      cargo: cargo,
      used_cargo: 0,
      flight_duration: fDetails.duration,
      flight_consumption: fDetails.consumption,
      speed: fDetails.maxSpeed,
      validStep: (selected.length > 0),
      cargo_desc: updated,
      // Reset the mission objective
      mission: {
        objective: UNDEFINED_OBJECTIVE,
        text: "Undefined",
      },
      objectives: objectives,
    });
  }

  selectNoShips() {
    // Reset the cargo description.
    let updated = this.state.cargo_desc;
    for (let id = 0 ; id < updated.length ; ++id) {
      updated[id].amount = 0;
    }

    // Update the selectable fleet objectives.
    let objectives = this.state.objectives;
    for (let id = 0 ; id < objectives.length ; ++id) {
      objectives[id].selectable = true;
    }

    this.setState({
      selected: [],
      cargo: 0,
      used_cargo: 0,
      flight_duration: 0,
      speed: 1,
      validStep: false,
      cargo_desc: updated,
      // Reset the mission objective
      mission: {
        objective: UNDEFINED_OBJECTIVE,
        text: "Undefined",
      },
      objectives: objectives,
    });
  }

  selectDestination(galaxy, system, position, location) {
    // Make sure that coordinates are valid compared to the
    // universes bounds.
    const iGalaxy = parseInt(galaxy);
    const iSystem = parseInt(system);
    const iPosition = parseInt(position);

    const dCoords = {
      galaxy: iGalaxy,
      system: iSystem,
      position: iPosition,
      location: location,
    };

    if (dCoords.galaxy < 0 || dCoords.galaxy >= this.props.universe.galaxies_count) {
      return;
    }
    if (dCoords.system < 0 || dCoords.system >= this.props.universe.galaxy_size) {
      return;
    }
    if (dCoords.position < 0 || dCoords.position >= this.props.universe.solar_system_size) {
      return;
    }
    if (location !== "planet" && location !== "moon" && location !== "debris") {
      return;
    }

    // Make sure that we're not selecting the exact same
    // planet we're on.
    if (this.props.planet.coordinate.galaxy === dCoords.galaxy &&
        this.props.planet.coordinate.system === dCoords.system &&
        this.props.planet.coordinate.position === dCoords.position &&
        this.props.planet.coordinate.location === location)
    {
      return;
    }

    // Make sure that if the location indicates that some
    // debris are targeted, we have at least one recycler.
    if (location === "debris" && !hasShips(this.props.ships, "recycler", this.state.selected)) {
      return;
    }

    // Compute the flight details.
    const fDetails = computeFlightDetails(
      this.props.planet.coordinate,
      dCoords,
      this.state.flight_speed,
      1.0 / this.props.universe.fleet_speed,
      this.props.universe.fleets_consumption_ratio,
      this.state.selected,
      this.props.player.technologies,
      this.props.ships,
      this.props.resources
    );

    // Update the selectable fleet objectives.
    const objectives = this.updateSelectableObjectives(this.state.selected, dCoords);

    this.setState({
      destination: {
        // Reset target's data (will be populated when the planet
        // data is received with `fetchSystemSucceeded`).
        target: "",
        name: TARGET_NOT_CREATED,

        coordinate: dCoords,

        // Assume the destination does not exist and that
        // it is a neutral target.
        exist: true,
        faction: TARGET_NEUTRAL,

        // Reset player.
        player: TARGET_NOT_OWNED,

        distance: fDetails.distance,
      },

      flight_duration: fDetails.duration,
      flight_consumption: fDetails.consumption,
      objectives: objectives,
      validStep: this.validateStep(this.state.step, dCoords, this.state.selected, fDetails.consumption, this.state.cargo),
    });

    // Fetch the destination planet's data.
    const server = new Server();
    const planets = new PlanetsModule(server);

    const game = this;

    planets.fetchPlanetsForSystem(iGalaxy, iSystem, this.props.universe.id)
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

  selectFleetSpeed(speed) {
    // Compute the duration of the flight.
    const fDetails = computeFlightDetails(
      this.props.planet.coordinate,
      this.state.destination.coordinate,
      Math.max(Math.min(speed, 1.0), 0.1),
      1.0 / this.props.universe.fleet_speed,
      this.props.universe.fleets_consumption_ratio,
      this.state.selected,
      this.props.player.technologies,
      this.props.ships,
      this.props.resources
    );

    this.setState({
      flight_speed: Math.max(Math.min(speed, 1.0), 0.1),
      flight_duration: fDetails.duration,
      flight_consumption: fDetails.consumption,
      validStep: this.validateStep(this.state.step, this.state.destination.coordinate, this.state.selected, fDetails.consumption, this.state.cargo),
    });
  }

  handleTargetShortcut(target) {
    // Attempt to find the corresponding element in the
    // list of planets for this player.
    const planet = this.props.planets.find(p => p.id === target);
    if (!planet) {
      console.error("Failed to fetch planet \"" + target + "\" in player's planets");
      return;
    }

    this.setState({
      selectedPlanet: target
    });

    // Handle the selection of this destination for the
    // fleet.
    this.selectDestination(
      planet.coordinate.galaxy,
      planet.coordinate.system,
      planet.coordinate.position,
      planet.coordinate.location
    );
  }

  updateObjective(objective) {
    // Update the mission objective.
    const oData = this.state.fleet_objectives.find(o => o.key === objective);
    if (!oData) {
      console.error("Failed to update fleet objective to \"" + objective + "\"");
      return;
    }
    if (!oData.selectable) {
      console.error("Tried to use invalid fleet objective \"" + objective + "\"");
      return;
    }

    const oDesc = this.props.fleet_objectives.find(o => o.name === oData.key);
    if (!oDesc) {
      console.error("Failed to update fleet objective to \"" + objective + "\"");
      return;
    }

    this.setState({
      mission: {
        objective: oDesc.id,
        text: oData.name,
      },
    });
  }

  addCargo(res, amount) {
    // Add the maximum amount of the resource provided in input
    // based on what is still available on the planet and the
    // remaining cargo space.
    let updated = this.state.cargo_desc;

    let iAmount = parseInt(amount, 10);
    if (amount === "") {
      iAmount = 0;
    }

    const rDesc = this.props.planet.resources.find(r => r.resource === res);
    if (!rDesc) {
      console.error("Failed to add cargo for resource \"" + res + "\"");
      return;
    }

    const rID = updated.findIndex(r => r.resource === res);
    if (rID < 0) {
      console.error("Failed to register cargo for resource \"" + res + "\"");
      return;
    }

    // Amount already used and remaining
    const remaining = rDesc.amount - updated[rID].amount;
    const alreadyLoaded = updated[rID].amount;

    // Amount of cargo
    const available = this.state.cargo - this.state.used_cargo + alreadyLoaded;

    // Amount that can be loaded (and consolidate with the
    // amount requested).
    const toLoad = Math.min(Math.min(available, remaining), iAmount);

    updated[rID].amount = toLoad;

    // Compute the total cargo used.
    const usedCargo = this.state.used_cargo - alreadyLoaded + toLoad;

    this.setState({
      cargo_desc: updated,
      used_cargo: usedCargo,
    });
  }

  loadAllCargo() {
    // Fill the cargo bay with an equal amount of resources.
    let updated = this.state.cargo_desc;

    // Traverse each resource and pillage as much as possible.
    let remainingRes = updated.length;
    let available = this.state.cargo;

    const depleted = [];
    for (let id = 0 ; id < updated.length ; ++id) {
      updated[id].amount = 0;
      depleted.push(0);
    }

    while (remainingRes > 0) {
      // Account the amount of resources that will be used
      // on this round.
      let toLoad = available / remainingRes;

      for (let id = 0 ; id < updated.length ; ++id) {
        // Find the resource on the planet.
        const rDesc = this.props.planet.resources.find(r => r.resource === updated[id].resource);
        if (!rDesc) {
          console.error("Failed to add cargo for resource \"" + updated[id].resource + "\"");
          continue;
        }

        // In case the resource is depleted (meaning everything
        // is already loaded), skip it.
        if (depleted[id] === 1) {
          continue;
        }

        // Compute the amount still available on the planet.
        const remaining = rDesc.amount - updated[id].amount;
        let amount = Math.round(Math.min(remaining, toLoad));

        // In case the total amount to load is smaller than
        // `1` and we're processing the first resource we
        // will round to the upper value to make sure that
        // we use all the available cargo.
        if (toLoad > 0.0 && toLoad < 1.0 && id === 0) {
          amount = 1.0;
        }

        updated[id].amount += amount;
        available -= amount;

        // Deplete the resource if needed.
        if (amount <= 0.0) {
          depleted[id] = 1;
          --remainingRes;
        }
      }
    }

    this.setState({
      cargo_desc: updated,
      used_cargo: (this.state.cargo - available),
    });
  }

  addAllCargo(res) {
    // Add the maximum amount of the resource provided in input
    // based on what is still available on the planet and the
    // remaining cargo space.
    let updated = this.state.cargo_desc;

    const rDesc = this.props.planet.resources.find(r => r.resource === res);
    if (!rDesc) {
      console.error("Failed to add cargo for resource \"" + res + "\"");
      return;
    }

    const rID = updated.findIndex(r => r.resource === res);
    if (rID < 0) {
      console.error("Failed to register cargo for resource \"" + res + "\"");
      return;
    }

    // Amount already used and remaining
    const remaining = rDesc.amount - updated[rID].amount;

    // Amount of cargo
    const available = this.state.cargo - this.state.used_cargo;

    // Amount that can be loaded.
    const toLoad = Math.min(available, remaining);

    updated[rID].amount += toLoad;

    // Compute the total cargo used.
    const usedCargo = this.state.used_cargo + toLoad;

    this.setState({
      cargo_desc: updated,
      used_cargo: usedCargo,
    });
  }

  removeAllCargo(res) {
    // Set amounts to `0`.
    let updated = this.state.cargo_desc;

    const id = updated.findIndex(r => r.resource === res);
    if (id < 0) {
      console.error("Failed to remove cargo for resource \"" + res + "\"");
      return;
    }

    const used = this.state.used_cargo - updated[id].amount;
    updated[id].amount = 0;

    this.setState({
      cargo_desc: updated,
      used_cargo: used,
    });
  }

  generateFleetInitView() {
    // Generate sections for combat and civil ships.
    const civilShips = [];
    const combatShips = [];

    for (let id = 0 ; id < ships_list.length ; id++) {
      // Fetch the data for this ship.
      const sDesc = this.props.ships.find(s => s.name === ships_list[id].name);
      if (!sDesc) {
        console.error("Failed to find ships \"" + ships_list[id].name + "\" from server data");
        continue;
      }

      const sData = this.props.planet.ships.find(s => s.id === sDesc.id);
      let out = {
        id: sDesc.id,
        title: ships_list[id].name,
        icon: ships_list[id].icon,

        min: 0,
        max: 0,

        selected: 0,
      };

      if (sData) {
        out.max = sData.amount;
      }

      const sel = this.state.selected.find(s => s.id === sDesc.id);
      if (sel) {
        out.selected = sel.selected;
      }

      switch (ships_list[id].kind) {
        case CIVIL_SHIP:
          civilShips.push(out);
          break;
        case COMBAT_SHIP:
          combatShips.push(out);
          break;
        default:
          // Unknown research type.
          console.error("Unknown ship type \"" + ships_list[id].kind + "\"");
          break;
      }
    }

    return (
      <div className="fleet_ships_layout">
        <div className="fleet_init_ships_layout">
          <p className="cover_header">Combat ships</p>
          <div className="fleet_init_section_layout">
            {combatShips.map(s => <FleetShip key={s.id} ship={s} selectShips={this.selectShips} />)}
          </div>
        </div>

        <div className="fleet_init_ships_layout">
          <p className="cover_header">Civil ships</p>
          <div className="fleet_init_section_layout">
            {civilShips.map(s => <FleetShip key={s.id} ship={s} selectShips={this.selectShips} />)}
          </div>
        </div>
      </div>
    );
  }

  generateFleetFlightView() {
    const speeds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

    // Generate classes for source world.
    const classSourcePlanet = (this.props.planet.coordinate.location === "planet" ? "fleet_flight_info_picture_selected" : "fleet_flight_info_picture");
    const classSourceMoon = (this.props.planet.coordinate.location === "moon" ? "fleet_flight_info_picture_selected" : "fleet_flight_info_picture");

    const classTargetPlanet = (this.state.destination.coordinate.location === "planet" ? "fleet_flight_info_picture_selected" : "fleet_flight_info_picture_selectable");
    const classTargetMoon = (this.state.destination.coordinate.location === "moon" ? "fleet_flight_info_picture_selected" : "fleet_flight_info_picture_selectable");
    const classTargetDebris = (this.state.destination.coordinate.location === "debris" ? "fleet_flight_info_picture_selected" : "fleet_flight_info_picture_selectable");

    const arrivalT = new Date().getTime() + this.state.flight_duration;
    const arrivalTime = new Date(arrivalT);
    const returnT = new Date().getTime() + 2 * this.state.flight_duration;
    const returnTime = new Date(returnT);
    const flightDurationHour = this.state.flight_duration / (1000 * 3600);

    const tankUsage = Math.floor(100.0 * this.state.flight_consumption / this.state.cargo);
    let consoClasses = "fleet_flight_detail_value";
    if (tankUsage < 100.0) {
      consoClasses += " fleet_flight_detail_valid_value";
    }
    else {
      consoClasses += " fleet_flight_detail_invalid_value";
    }

    let classes = "fleets_button";
    if (!this.state.validStep) {
      classes += " fleets_next_step_disabled";
    }

    return (
      <div className="fleet_flight_info">
        <div className="fleet_flight_coordinates">
          <div className="fleet_flight_growth">
            <p className="fleet_flight_step_title">Take off location:</p>
            <div className="fleet_flight_endpoint_data">
              <div className="fleet_flight_endpoint_raw">
                <p className="fleet_flight_endpoint_name">{this.props.planet.name}</p>
                <div className="fleet_flight_endpoint_type">
                  <img className={classSourcePlanet} src={planet} alt="Planet" />
                  <img className={classSourceMoon} src={moon} alt="Moon" />
                </div>
                <p className="fleet_flight_general_text" onClick={() => this.props.viewSystem(this.props.planet.coordinate.galaxy, this.props.planet.coordinate.system)}>
                  Coordinates: <span className="fleet_flight_galaxy_link">
                    {(this.props.planet.coordinate.galaxy + 1) + ":" + (this.props.planet.coordinate.system + 1) + ":" + (this.props.planet.coordinate.position + 1)}
                  </span>
                </p>
              </div>
              <div className="fleet_flight_distance">
                <p className="fleet_flight_distance_indicator">&lt;</p>
                <div>
                  <p className="fleet_flight_general_text">Distance:</p>
                  <p className="fleet_flight_general_text">{this.state.destination.distance}</p>
                </div>
                <p className="fleet_flight_distance_indicator">&gt;</p>
              </div>
            </div>
          </div>
          <div className="fleet_flight_growth">
            <p className="fleet_flight_step_title">Destination</p>
            <div className="fleet_flight_endpoint_data">
              <div className="fleet_flight_endpoint_raw">
                <p className="fleet_flight_endpoint_name">New horizons</p>
                <div className="fleet_flight_endpoint_type">
                  <img className={classTargetPlanet}
                       src={planet}
                       alt="Planet"
                       onClick={() => this.selectDestination(
                        this.state.destination.coordinate.galaxy,
                        this.state.destination.coordinate.system,
                        this.state.destination.coordinate.position,
                        "planet"
                       )}
                       />
                  <img className={classTargetMoon}
                       src={moon}
                       alt="Moon"
                       onClick={() => this.selectDestination(
                        this.state.destination.coordinate.galaxy,
                        this.state.destination.coordinate.system,
                        this.state.destination.coordinate.position,
                        "moon"
                       )}
                       />
                  <img className={classTargetDebris}
                       src={debris}
                       alt="Debris field"
                       onClick={() => this.selectDestination(
                        this.state.destination.coordinate.galaxy,
                        this.state.destination.coordinate.system,
                        this.state.destination.coordinate.position,
                        "debris"
                       )}
                       />
                </div>
                <div className="fleet_flight_destination_coord_selector">
                  <form className="destination_coord_selector">
                    <input className="fleet_flight_destination_coord_selector_input"
                           method="post"
                           type="number"
                           name="destination_galaxy"
                           id="destination_galaxy"
                           value={this.state.destination.coordinate.galaxy + 1}
                           onChange={e => this.selectDestination(
                             e.target.value - 1,
                             this.state.destination.coordinate.system,
                             this.state.destination.coordinate.position,
                             this.state.destination.coordinate.location
                            )}
                           />
                  </form>
                  <form className="fleet_flight_destination_coord_selector">
                    <input className="fleet_flight_destination_coord_selector_input"
                           method="post"
                           type="number"
                           name="destination_system"
                           id="destination_system"
                           value={this.state.destination.coordinate.system + 1}
                           onChange={e => this.selectDestination(
                             this.state.destination.coordinate.galaxy,
                             e.target.value - 1,
                             this.state.destination.coordinate.position,
                             this.state.destination.coordinate.location
                            )}
                           />
                  </form>
                  <form className="fleet_flight_destination_coord_selector">
                    <input className="fleet_flight_destination_coord_selector_input"
                           method="post"
                           type="number"
                           name="destination_position"
                           id="destination_position"
                           value={this.state.destination.coordinate.position + 1}
                           onChange={e => this.selectDestination(
                             this.state.destination.coordinate.galaxy,
                             this.state.destination.coordinate.system,
                             e.target.value - 1,
                             this.state.destination.coordinate.location
                           )}
                           />
                  </form>
                </div>
              </div>
              <div className="fleet_flight_destination_quick_select">
                <p className="fleet_flight_general_text">Shortcuts:</p>
                <form method="post">
                  <select className="fleet_flight_destination_selector"
                          id="destination_shortcut"
                          name="destination_shortcut"
                          value={this.state.selectedPlanet}
                          onChange={e => this.handleTargetShortcut(e.target.value)}
                          >
                    {this.props.planets.map(p => <option key={p.name} value={p.id}>{p.name}</option>)}
                  </select>
                </form>
                <p className="fleet_flight_general_text">Combat forces:</p>
                <form method="post">
                  <select className="fleet_flight_destination_selector" id="combat_forces" name="combat_forces"></select>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="fleet_flight_briefing">
          <p className="fleet_flight_step_title">Briefing</p>
          <div className="fleet_flight_details">
            <div className="fleet_flight_flight_details">
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Duration of flight (one way):</span>
                <span className="fleet_flight_detail_value">{formatDuration(flightDurationHour)}</span>
              </div>
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Deuterium consumption:</span>
                <span className={consoClasses}>
                  {formatAmount(this.state.flight_consumption) + " (" + tankUsage + "%)"}
                </span>
              </div>
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">{"Speed (max " + this.state.speed + "):"}</span>
              </div>
            </div>
            <div className="fleet_flight_flight_details">
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Arrival:</span>
                <span className="fleet_flight_detail_value">{formatDate(arrivalTime)}</span>
              </div>
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Return:</span>
                <span className="fleet_flight_detail_value">{formatDate(returnTime)}</span>
              </div>
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Empty cargo bays:</span>
                <span className="fleet_flight_detail_value fleet_flight_detail_valid_value">{this.state.cargo}</span>
              </div>
            </div>
          </div>
          <div className="fleet_flight_speed_container">
            <div className="fleet_flight_speed_selection">
              {
                speeds.map(function (s) {
                    let classes = "fleet_flight_speed";
                    if (s === this.state.flight_speed) {
                      classes += " fleet_flight_selected_speed";
                    }
                    return <button className={classes} key={s} onClick={() => this.selectFleetSpeed(s)}>{100 * s}</button>
                  },
                  this
                )
              }
              <span>%</span>
            </div>
            <div className="fleet_flight_confirmation_layout">
              <button className="fleets_button fleets_previous_step" onClick={() => this.updateFleetStep(FLEET_INIT, false)} >BACK</button>
              <button className={classes + " fleets_next_step"} onClick={() => this.updateFleetStep(FLEET_OBJECTIVE, true)}>NEXT</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  generateFleeObjectiveView() {
    const arrivalT = new Date().getTime() + this.state.flight_duration;
    const arrivalTime = new Date(arrivalT);
    const returnT = new Date().getTime() + 2 * this.state.flight_duration;
    const returnTime = new Date(returnT);
    const flightDurationHour = this.state.flight_duration / (1000 * 3600);

    const tankUsage = Math.floor(100.0 * this.state.flight_consumption / this.state.cargo);

    const cargoProg ={
      // The minimum width defined in the css class named
      // `fleet_objective_cargo_percentage` is 150px: we
      // compute the percentage based on the cargo usage.
      width: Math.round(150.0 * this.state.used_cargo / this.state.cargo),
    };

    return (
      <div className="fleets_creation_container">
        <div className="fleet_flight_detail_container">
          <span className="fleet_objective_mission_text">Mission:</span>
          <span className="fleet_objective_mission_entry">{this.state.mission.text}</span>
          <span className="fleet_objective_mission_text">Target:</span>
          <span className="fleet_objective_mission_entry fleet_flight_galaxy_link"
                onClick={() => this.props.viewSystem(this.state.destination.coordinate.galaxy + 1, this.state.destination.coordinate.system + 1)}
                >
            {this.state.destination.name + " " + (this.state.destination.coordinate.galaxy + 1) + ":" + (this.state.destination.coordinate.system + 1) + ":" + (this.state.destination.coordinate.position + 1)}
          </span>
          <span className="fleet_objective_mission_text">Player name:</span>
          <span className="fleet_objective_mission_entry">{this.state.destination.player}</span>
        </div>

        <div className="fleet_objectives_layout">
          <p className="fleet_flight_step_title">Select mission for target:</p>
          <div className="fleet_objective_missions_layout">
            {
              this.state.fleet_objectives.map(o =>
                <FleetObjective key={o.key}
                                name={o.key}
                                label={o.name}
                                icon={o.icon}
                                selected={o.name === this.state.mission.text}
                                selectable={o.selectable}
                                updateObjective={obj => this.updateObjective(obj)}
                                />
              )
            }
          </div>
          <div>
            <p className="fleet_objective_mission_desc fleet_objective_mission_title">Mission: deployment</p>
            <p className="fleet_objective_mission_desc">Sends your fleet permanently to another planet of your empire</p>
          </div>
        </div>

        <div className="fleet_objective_brief_and_cargo_layout">
          <div className="fleet_flight_briefing">
            <p className="fleet_flight_step_title">Briefing</p>
            <div className="fleet_flight_flight_details">
              <div className="fleet_flight_objective_detail_summary">
                <span className="fleet_flight_detail_entry">Target:</span>
                <span className="fleet_flight_detail_value fleet_flight_galaxy_link"
                      onClick={() => this.props.viewSystem(this.props.planet.coordinate.galaxy, this.props.planet.coordinate.system)}
                      >
                  {(this.state.destination.coordinate.galaxy + 1) + ":" + (this.state.destination.coordinate.system + 1) + ":" + (this.state.destination.coordinate.position + 1)}
                </span>
              </div>
              <div className="fleet_flight_objective_detail_summary">
                <span className="fleet_flight_detail_entry">Duration of flight (one way):</span>
                <span className="fleet_flight_detail_value">{formatDuration(flightDurationHour)}</span>
              </div>
              <div className="fleet_flight_objective_detail_summary">
                <span className="fleet_flight_detail_entry">Arrival:</span>
                <span className="fleet_flight_detail_value">{formatDate(arrivalTime)}</span>
              </div>
              <div className="fleet_flight_objective_detail_summary">
                <span className="fleet_flight_detail_entry">Return:</span>
                <span className="fleet_flight_detail_value">{formatDate(returnTime)}</span>
              </div>
              <div className="fleet_flight_objective_detail_summary">
                <span className="fleet_flight_detail_entry">Deuterium consumption:</span>
                <span className="fleet_flight_detail_value fleet_flight_detail_valid_value">
                  {formatAmount(this.state.flight_consumption) + " (" + tankUsage + "%)"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="fleet_flight_step_title">Load resources</p>
            <div className="fleet_objective_cargo_management">
              <div className="fleet_objective_cargo_selectors">
                {
                  // Note that we use an arrow notation as explained in this
                  // link:
                  // https://stackoverflow.com/questions/50965798/react-onclick-function-in-map-function
                  // Otherwise the `this` used in the `onClick` handlers will
                  // fail to be resolve.
                  this.state.cargo_desc.map((cd) => {
                    return (
                      <div key={cd.resource} className="fleet_objective_cargo_resource_container">
                        <img className="fleet_objective_cargo_resource" src={cd.icon} alt={cd.name} />
                        <div className="fleet_objective_cargo_resource_selector">
                          <form>
                            <input className="cargo_resource_selector"
                                  method="post"
                                  type="number"
                                  name={"cargo_" + cd.name}
                                  id={"cargo_" + cd.resource}
                                  value={cd.amount}
                                  onChange={e => this.addCargo(cd.resource, e.target.value)}
                                  />
                          </form>
                          <div className="fleet_objective_cargo_quick_access">
                            <button className="cargo_resource_access"
                                    onClick={() => this.removeAllCargo(cd.resource)}
                                    >
                              &lt;&lt;
                            </button>
                            <button className="cargo_resource_access"
                                    onClick={() => this.addAllCargo(cd.resource)}
                                    >
                              &gt;&gt;
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
              <div className="fleet_objective_cargo_selectors">
                <div className="fleet_objective_cargo_layout">
                  <button className="cargo_resource_access cargo_fill_all"
                          onClick={() => this.loadAllCargo()}>
                    &gt;&gt;
                  </button>
                  <span className="fleet_objective_cargo_info">all resources</span>
                </div>
                <div className="fleet_objective_cargo_layout">
                  <span className="fleet_objective_cargo_info">cargo bay:</span>
                  <div className="fleet_objective_cargo_percentage">
                    <div className="fleet_cargo_progression" style={cargoProg}></div>
                  </div>
                  <div>
                    <span className="fleet_objective_cargo_info">{formatAmount(this.state.used_cargo, false)}</span>
                    <span className="fleet_objective_cargo_info">/</span>
                    <span className="fleet_objective_cargo_info">{formatAmount(this.state.cargo, false)}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="fleet_objective_confirmation_layout">
          <div className="fleet_flight_confirmation_layout">
            <button className="fleets_button fleets_previous_step" onClick={() => this.updateFleetStep(FLEET_FLIGHT, false)}>BACK</button>
          </div>
          <div className="fleet_flight_confirmation_layout">
            <button className="fleets_button fleets_next_step" onClick={() => this.requestFleetSending()}>SEND FLEET</button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let classes = "fleets_button";
    if (!this.state.validStep) {
      classes += " fleets_next_step_disabled";
    }

    const slots = computeFleetSlots(this.props.player.technologies);

    // TODO: Handle fleets count and expeditions count.
    return (
      <div className="fleets_layout fleets_creation_container">
        <div className="fleets_slots_layout">
          <div>
            <span className="fleet_slot">{"Fleets: 0/" + slots.fleets}</span>
            <span className="fleet_slot">{"Expeditions: 0/" + slots.expeditions}</span>
          </div>
          <div className="fleet_display_link">Fleet movements</div>
        </div>
        {this.state.step === FLEET_INIT && this.generateFleetInitView()}
        {
          this.state.step === FLEET_INIT &&
          <div className="fleets_confirmation_panel">
            <div className="fleets_confirmation_element">
              <button className="fleets_button fleets_all_ships" onClick={() => this.selectAllShips()}>
                All
              </button>
              <button className="fleets_button fleets_no_ship" onClick={() => this.selectNoShips()}>
                0
              </button>
            </div>
            <div className="fleets_confirmation_element">
              <button className={classes + " fleets_next_step"} onClick = {() => this.updateFleetStep(FLEET_FLIGHT, true)}>NEXT</button>
            </div>
          </div>
        }
        {this.state.step === FLEET_FLIGHT && this.generateFleetFlightView()}
        {this.state.step === FLEET_OBJECTIVE && this.generateFleeObjectiveView()}
      </div>
    );
    // TODO: Should use: https://www.youtube.com/watch?v=cVAqJyRyTIg to create step 3.
  }
}

export default Fleets;
