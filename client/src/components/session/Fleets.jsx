
import '../../styles/session/Fleets.css';
import '../../styles/session/Game.css';
import React from 'react';
import FleetShip from './FleetShip.jsx';
import FleetObjective from './FleetObjective.jsx';

import planet from '../../assets/fleets/planet.png';
import moon from '../../assets/fleets/moon.png';
import debris from '../../assets/fleets/debris.png';

import metal from '../../assets/metal_mini.jpeg';
import crystal from '../../assets/crystal_mini.jpeg';
import deuterium from '../../assets/deuterium_mini.jpeg';

import {ships_list} from '../../datas/ships.js';
import { CIVIL_SHIP, COMBAT_SHIP } from '../../datas/ships.js';

import { toFixedDigits, formatDuration, formatAmount } from '../game/amounts.js';
import { computeDistance, computeDuration, computeConsumption } from '../game/fleet.js';

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

  // Generate output object.
  return {
    distance: distance,
    duration: duration,
    consumption: conso,
  };
}

class Fleets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines the current state of the fleets view as
      // an enumeration: this allows to adapt the items
      // that are displayed.
      step: FLEET_INIT,

      // Defines the amount of ships selected for each
      // of the available item.
      selected: [],

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
    };

    this.selectShips = this.selectShips.bind(this);
    this.selectDestination = this.selectDestination.bind(this);
  }

  updateFleetStep(step, next) {
    // Only allow to move to the next step based on the
    // valid state.
    if (next && !this.state.validStep) {
      return;
    }

    this.setState({
      step: step,
    });
  }

  requestFleetSending() {
    // TODO: Handle the sending.
    console.error("Should send fleet");

    this.updateFleetStep(FLEET_INIT, false);
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

    this.setState({
      selected: selected,
      cargo: cargo,
      flight_duration: fDetails.duration,
      flight_consumption: fDetails.consumption,
      validStep: (selected.length > 0),
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
      this.state.selected,
      this.props.player.technologies,
      this.props.ships,
      this.props.resources
    );

    this.setState({
      selected: selected,
      cargo: cargo,
      flight_duration: fDetails.duration,
      flight_consumption: fDetails.consumption,
      validStep: (selected.length > 0),
    });
  }

  selectNoShips() {
    this.setState({
      selected: [],
      cargo: 0,
      flight_duration: 0,
      validStep: false,
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

    this.setState({
      destination: {
        coordinate: dCoords,
        distance: fDetails.distance,
      },
      flight_duration: fDetails.duration,
      flight_consumption: fDetails.consumption,
    });
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

    // TODO: Handle shortcut and trigger of the selection of destination
    // when a destination is chosen.
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
                <p className="fleet_flight_general_text">
                  Coordinates: <a href="../galaxy/galaxy.html">
                  {(this.props.planet.coordinate.galaxy + 1) + ":" + (this.props.planet.coordinate.system + 1) + ":" + (this.props.planet.coordinate.position + 1)}
                  </a>
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
                  <select className="fleet_flight_destination_selector" id="destination_shortcut" name="destination_shortcut">
                    {this.props.planets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
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
                <span className="fleet_flight_detail_entry">Speed (max 22500):</span>
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
              <button className="fleets_button fleets_next_step" onClick={() => this.updateFleetStep(FLEET_OBJECTIVE, true)}>NEXT</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  generateFleeObjectiveView() {
    return (
      <div className="fleets_creation_container">
        <div className="fleet_flight_detail_container">
          <span className="fleet_objective_mission_text">Mission:</span>
          <span className="fleet_objective_mission_entry">Deployment</span>
          <span className="fleet_objective_mission_text">Target:</span>
          <span className="fleet_objective_mission_entry"><a href="../galaxy/galaxy.html">[5:53:7]</a></span>
          <span className="fleet_objective_mission_text">Player name:</span>
          <span className="fleet_objective_mission_entry">tttttttttttttttttttt</span>
        </div>

        <div className="fleet_objectives_layout">
          <p className="fleet_flight_step_title">Select mission for target:</p>
          <div className="fleet_objective_missions_layout">
            <FleetObjective label={"Expedition"} icon={"expedition"}/>
            <FleetObjective label={"Colonization"} icon={"colonization"}/>
            <FleetObjective label={"Harvest debris field"} icon={"harvesting"}/>
            <FleetObjective label={"Transport"} icon={"transport"}/>
            <FleetObjective label={"Deployment"} icon={"deployment"}/>
            <FleetObjective label={"Espionage"} icon={"espionage"}/>
            <FleetObjective label={"ACS Defend"} icon={"acs_defend"}/>
            <FleetObjective label={"Attack"} icon={"attack"}/>
            <FleetObjective label={"Moon destruction"} icon={"destroy"}/>
            <FleetObjective label={"ACS Attack"} icon={"acs_attack"}/>
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
                <span className="fleet_flight_detail_value"><a href="../galaxy/galaxy.html">[5:53:7]</a></span>
              </div>
              <div className="fleet_flight_objective_detail_summary">
                <span className="fleet_flight_detail_entry">Duration of flight (one way):</span>
                <span className="fleet_flight_detail_value">0:02:55h</span>
              </div>
              <div className="fleet_flight_objective_detail_summary">
                <span className="fleet_flight_detail_entry">Arrival:</span>
                <span className="fleet_flight_detail_value">25.01.17 20:46:42 Clock</span>
              </div>
              <div className="fleet_flight_objective_detail_summary">
                <span className="fleet_flight_detail_entry">Return:</span>
                <span className="fleet_flight_detail_value">25.01.17 20:49:38 Clock</span>
              </div>
              <div className="fleet_flight_objective_detail_summary">
                <span className="fleet_flight_detail_entry">Deuterium consumption:</span>
                <span className="fleet_flight_detail_value fleet_flight_detail_valid_value">35 (1%)</span>
              </div>
            </div>
          </div>

          <div>
            <p className="fleet_flight_step_title">Load resources</p>
            <div className="fleet_objective_cargo_management">
              <div className="fleet_objective_cargo_selectors">
                <div className="fleet_objective_cargo_resource_container">
                  <img className="fleet_objective_cargo_resource" src={metal} alt="Metal" />
                  <div className="fleet_objective_cargo_resource_selector">
                    <form>
                      <input className="cargo_resource_selector" method="post" type="number" name="cargo_metal" id="cargo_metal" value="0" min="0" max="3104"/>
                    </form>
                    <div className="fleet_objective_cargo_quick_access">
                      <button className="cargo_resource_access">&lt;&lt;</button>
                      <button className="cargo_resource_access">&gt;&gt;</button>
                    </div>
                  </div>
                </div>
                <div className="fleet_objective_cargo_resource_container">
                  <img className="fleet_objective_cargo_resource" src={crystal} alt="Crystal" />
                  <div className="fleet_objective_cargo_resource_selector">
                    <form>
                      <input className="cargo_resource_selector" method="post" type="number" name="cargo_crystal" id="cargo_crystal" value="0" min="0" max="3104"/>
                    </form>
                    <div className="fleet_objective_cargo_quick_access">
                      <button className="cargo_resource_access">&lt;&lt;</button>
                      <button className="cargo_resource_access">&gt;&gt;</button>
                    </div>
                  </div>
                </div>
                <div className="fleet_objective_cargo_resource_container">
                  <img className="fleet_objective_cargo_resource" src={deuterium} alt="Deuterium" />
                  <div className="fleet_objective_cargo_resource_selector">
                    <form>
                      <input className="cargo_resource_selector" method="post" type="number" name="cargo_deuterium" id="cargo_deuterium" value="0" min="0" max="3104"/>
                    </form>
                    <div className="fleet_objective_cargo_quick_access">
                      <button className="cargo_resource_access">&lt;&lt;</button>
                      <button className="cargo_resource_access">&gt;&gt;</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fleet_objective_cargo_selectors">
                <div className="fleet_objective_cargo_layout">
                  <button className="cargo_resource_access cargo_fill_all">&gt;&gt;</button>
                  <span className="fleet_objective_cargo_info">all resources</span>
                </div>
                <div className="fleet_objective_cargo_layout">
                  <span className="fleet_objective_cargo_info">cargo bay:</span>
                  <div className="fleet_objective_cargo_percentage">
                    <div className="fleet_cargo_progression"></div>
                  </div>
                  <div>
                    <span className="fleet_objective_cargo_info">19856321</span>
                    <span className="fleet_objective_cargo_info">/</span>
                    <span className="fleet_objective_cargo_info">23250000</span>
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

    // TODO: Handle fleets count and expeditions count.
    return (
      <div className="fleets_layout fleets_creation_container">
        <div className="fleets_slots_layout">
          <div>
            <span className="fleet_slot">Fleets: 0/15</span>
            <span className="fleet_slot">Expeditions: 0/4</span>
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
    // Should use: https://www.youtube.com/watch?v=cVAqJyRyTIg to create step 3
  }
}

export default Fleets;
