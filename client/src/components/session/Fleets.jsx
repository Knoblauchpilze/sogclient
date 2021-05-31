
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
    };

    this.selectShips = this.selectShips.bind(this);
  }

  updateFleetStep(step) {
    this.setState({
      step: step,
    });
  }

  requestFleetSending() {
    // TODO: Handle the sending.
    console.error("Should send fleet");

    this.updateFleetStep(FLEET_INIT);
  }

  selectShips(ship, amount) {
    // Check whether this ship already is selected.
    const sID = this.state.selected.findIndex(s => s.id === ship);
    let iAmount = parseInt(amount, 10);

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

    this.setState({
      selected: selected,
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
    return (
      <div className="fleet_flight_info">
        <div className="fleet_flight_coordinates">
          <div className="fleet_flight_growth">
            <p className="fleet_flight_step_title">Take off location:</p>
            <div className="fleet_flight_endpoint_data">
              <div className="fleet_flight_endpoint_raw">
                <p className="fleet_flight_endpoint_name">New horizons</p>
                <div className="fleet_flight_endpoint_type">
                  <img className="fleet_flight_info_picture" src={planet} alt="Planet" />
                  <img className="fleet_flight_info_picture" src={moon} alt="Moon" />
                </div>
                <p className="fleet_flight_general_text">Coordinates: <a href="../galaxy/galaxy.html">5:53:7</a></p>
              </div>
              <div className="fleet_flight_distance">
                <p className="fleet_flight_distance_indicator">&lt;</p>
                <div>
                  <p className="fleet_flight_general_text">Distance:</p>
                  <p className="fleet_flight_general_text">5</p>
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
                  <img className="fleet_flight_info_picture" src={planet} alt="Planet" />
                  <img className="fleet_flight_info_picture" src={moon} alt="Moon" />
                  <img className="fleet_flight_info_picture" src={debris} alt="Debris field" />
                </div>
                <div className="fleet_flight_destination_coord_selector">
                  <form className="destination_coord_selector">
                    <input className="fleet_flight_destination_coord_selector_input" method="post" type="number" name="destination_galaxy" id="destination_galaxy" value="5" min="1" max="9"/>
                  </form>
                  <form className="fleet_flight_destination_coord_selector">
                    <input className="fleet_flight_destination_coord_selector_input" method="post" type="number" name="destination_system" id="destination_system" value="53" min="1" max="499"/>
                  </form>
                  <form className="fleet_flight_destination_coord_selector">
                    <input className="fleet_flight_destination_coord_selector_input" method="post" type="number" name="destination_position" id="destination_position" value="7" min="1" max="15"/>
                  </form>
                </div>
              </div>
              <div className="fleet_flight_destination_quick_select">
                <p className="fleet_flight_general_text">Shortcuts:</p>
                <form method="post">
                  <select className="fleet_flight_destination_selector" id="destination_shortcut" name="destination_shortcut">
                    <option value="New Hypergate">New hypergate</option>
                    <option value="Hyperion">Hyperion</option>
                    <option value="Hypergate">Hypergate</option>
                    <option value="Oasis Secundus">Oasis Secundus</option>
                    <option value="Oasis">Oasis</option>
                    <option value="Colonie">Colonie</option>
                    <option value="Tau Ceti Central">Tau Ceti Central</option>
                    <option value="New London">New London</option>
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
                <span className="fleet_flight_detail_value">0:02:55h</span>
              </div>
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Deuterium consumption:</span>
                <span className="fleet_flight_detail_value fleet_flight_detail_valid_value">35 (1%)</span>
              </div>
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Speed (max 22500):</span>
              </div>
            </div>
            <div className="fleet_flight_flight_details">
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Arrival:</span>
                <span className="fleet_flight_detail_value">25.01.17 20:46:42</span>
              </div>
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Return:</span>
                <span className="fleet_flight_detail_value">25.01.17 20:49:38</span>
              </div>
              <div className="fleet_flight_detail_container">
                <span className="fleet_flight_detail_entry">Empty cargo bays:</span>
                <span className="fleet_flight_detail_value fleet_flight_detail_valid_value">23250000</span>
              </div>
            </div>
          </div>
          <div className="fleet_flight_speed_container">
            <div className="fleet_flight_speed_selection">
              <button className="fleet_flight_speed" >10</button>
              <button className="fleet_flight_speed" >20</button>
              <button className="fleet_flight_speed" >30</button>
              <button className="fleet_flight_speed" >40</button>
              <button className="fleet_flight_speed" >50</button>
              <button className="fleet_flight_speed" >60</button>
              <button className="fleet_flight_speed" >70</button>
              <button className="fleet_flight_speed" >80</button>
              <button className="fleet_flight_speed" >90</button>
              <button className="fleet_flight_selected_speed" >100</button>
              <span>%</span>
            </div>
            <div className="fleet_flight_confirmation_layout">
              <button className="fleets_button fleets_previous_step" onClick={() => this.updateFleetStep(FLEET_INIT)} >BACK</button>
              <button className="fleets_button fleets_next_step" onClick={() => this.updateFleetStep(FLEET_OBJECTIVE)}>NEXT</button>
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
            <button className="fleets_button fleets_previous_step" onClick={() => this.updateFleetStep(FLEET_FLIGHT)}>BACK</button>
          </div>
          <div className="fleet_flight_confirmation_layout">
              <button className="fleets_button fleets_next_step" onClick={() => this.requestFleetSending()}>SEND FLEET</button>
          </div>
        </div>
      </div>
    );
  }

  render() {
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
              <button className="fleets_button fleets_all_ships">All</button>
              <button className="fleets_button fleets_no_ship">0</button>
            </div>
            <div className="fleets_confirmation_element">
              <button className="fleets_next_step" onClick = {() => this.updateFleetStep(FLEET_FLIGHT)}>NEXT</button>
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
