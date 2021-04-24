
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

import light_fighter from '../../assets/light_fighter.jpeg';
import heavy_fighter from '../../assets/heavy_fighter.jpeg';
import cruiser from '../../assets/cruiser.jpeg';
import battleship from '../../assets/battleship.jpeg';
import battlecruiser from '../../assets/battlecruiser.jpeg';
import bomber from '../../assets/bomber.jpeg';
import destroyer from '../../assets/destroyer.jpeg';
import deathstar from '../../assets/deathstar.jpeg';

import small_cargo from '../../assets/small_cargo_ship.jpeg';
import large_cargo from '../../assets/large_cargo_ship.jpeg';
import colony_ship from '../../assets/colony_ship.jpeg';
import recycler from '../../assets/recycler.jpeg';
import espionage_probe from '../../assets/espionage_probe.jpeg';
import solar_satellite from '../../assets/solar_satellite.jpeg';

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
    };
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
        {
          this.state.step === FLEET_INIT &&
          <div className="fleet_ships_layout">
            <div className="fleet_init_ships_layout">
              <p class="cover_header">Combat ships</p>
              <div className="fleet_init_section_layout">
                <FleetShip icon={light_fighter}
                           alt="Light fighter"
                           title="Light fighter"
                           min={0}
                           max={33035}
                           />
                <FleetShip icon={heavy_fighter}
                           alt="Heavy fighter"
                           title="Heavy fighter"
                           min={0}
                           max={14}
                           />
                <FleetShip icon={cruiser}
                           alt="Cruiser"
                           title="Cruiser"
                           min={0}
                           max={13}
                           />
                <FleetShip icon={battleship}
                           alt="Battleship"
                           title="Battleship"
                           min={0}
                           max={12}
                           />
                <FleetShip icon={battlecruiser}
                           alt="Battlecruiser"
                           title="Battlecruiser"
                           min={0}
                           max={17}
                           />
                <FleetShip icon={bomber}
                           alt="Bomber"
                           title="Bomber"
                           min={0}
                           max={18}
                           />
                <FleetShip icon={destroyer}
                           alt="Destroyer"
                           title="Destroyer"
                           min={0}
                           max={19}
                           />
                <FleetShip icon={deathstar}
                           alt="Deathstar"
                           title="Deathstar"
                           min={0}
                           max={20}
                           />
              </div>
            </div>

            <div className="fleet_init_ships_layout">
              <p class="cover_header">Civil ships</p>
              <div className="fleet_init_section_layout">
                <FleetShip icon={small_cargo}
                           alt="Small cargo"
                           title="Small cargo"
                           min={0}
                           max={30}
                           />
                <FleetShip icon={large_cargo}
                           alt="Large cargo"
                           title="Large cargo"
                           min={0}
                           max={31}
                           />
                <FleetShip icon={colony_ship}
                           alt="Colony ship"
                           title="Colony ship"
                           min={0}
                           max={32}
                           />
                <FleetShip icon={recycler}
                           alt="Recycler"
                           title="Recycler"
                           min={0}
                           max={33}
                           />
                <FleetShip icon={espionage_probe}
                           alt="Espionage probe"
                           title="Espionage probe"
                           min={0}
                           max={34}
                           />
                <FleetShip icon={solar_satellite}
                           alt="Solar satellite"
                           title="Solar satellite"
                           min={0}
                           max={35}
                           />
              </div>
            </div>
          </div>
        }
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
        {
          this.state.step === FLEET_FLIGHT &&
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
                  <button class="fleet_flight_speed" >10</button>
                  <button class="fleet_flight_speed" >20</button>
                  <button class="fleet_flight_speed" >30</button>
                  <button class="fleet_flight_speed" >40</button>
                  <button class="fleet_flight_speed" >50</button>
                  <button class="fleet_flight_speed" >60</button>
                  <button class="fleet_flight_speed" >70</button>
                  <button class="fleet_flight_speed" >80</button>
                  <button class="fleet_flight_speed" >90</button>
                  <button class="fleet_flight_selected_speed" >100</button>
                  <span>%</span>
                </div>
                <div className="fleet_flight_confirmation_layout">
                  <button className="fleets_button fleets_previous_step" onClick={() => this.updateFleetStep(FLEET_INIT)} >BACK</button>
                  <button className="fleets_button fleets_next_step" onClick={() => this.updateFleetStep(FLEET_OBJECTIVE)}>NEXT</button>
                </div>
              </div>
            </div>
          </div>
        }
        {
          this.state.step === FLEET_OBJECTIVE &&
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
                        <form class="">
                          <input className="cargo_resource_selector" method="post" type="number" name="cargo_metal" id="cargo_metal" value="0" min="0" max="3104"/>
                        </form>
                        <div className="fleet_objective_cargo_quick_access">
                          <button class="cargo_resource_access">&lt;&lt;</button>
                          <button class="cargo_resource_access">&gt;&gt;</button>
                        </div>
                      </div>
                    </div>
                    <div className="fleet_objective_cargo_resource_container">
                      <img className="fleet_objective_cargo_resource" src={crystal} alt="Crystal" />
                      <div className="fleet_objective_cargo_resource_selector">
                        <form class="">
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
                        <form class="">
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
        }
      </div>
    );
    // Should use: https://www.youtube.com/watch?v=cVAqJyRyTIg to create step 3
  }
}

export default Fleets;
