
import '../../styles/session/Fleets.css';
import '../../styles/session/Game.css';
import React from 'react';

import planet from '../../assets/fleets/planet.png';
import moon from '../../assets/fleets/moon.png';
import debris from '../../assets/fleets/debris.png';

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
            <div className="shipyard_section">
              <p class="cover_header">Combat ships</p>
              <div className="shipyard_section_layout">
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/light_fighter.jpeg" alt="Light fighter" title="Light fighter"/>
                  <span class="planet_ship_available_count">33035</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="light_fighter_ship_count" id="light_fighter_ship_count" value="0" min="0" max="33035"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/heavy_fighter.jpeg" alt="Heavy fighter" title="Heavy fighter"/>
                  <span class="planet_ship_available_count">45</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="heavy_fighter_ship_count" id="heavy_fighter_ship_count" value="0" min="0" max="45"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/cruiser.jpeg" alt="Cruiser" title="Cruiser"/>
                  <span class="planet_ship_available_count">3663</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="cruiser_ship_count" id="cruiser_ship_count" value="0" min="0" max="3663"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/battleship.jpeg" alt="Battleship" title="Battleship"/>
                  <span class="planet_ship_available_count">1500</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="battleship_ship_count" id="battleship_ship_count" value="0" min="0" max="1500"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/battlecruiser.jpeg" alt="Battlecruiser" title="Battlecruiser"/>
                  <span class="planet_ship_available_count">650</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="battlecruiser_ship_count" id="battlecruiser_ship_count" value="0" min="0" max="650"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/bomber.jpeg" alt="Bomber" title="Bomber"/>
                  <span class="planet_ship_available_count">100</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="bomber_ship_count" id="bomber_ship_count" value="0" min="0" max="100"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/destroyer.jpeg" alt="Destroyer" title="Destroyer"/>
                  <span class="planet_ship_available_count">450</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="destroyer_ship_count" id="destroyer_ship_count" value="0" min="0" max="450"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/deathstar.jpeg" alt="Deathstar" title="Deathstar"/>
                  <span class="planet_ship_available_count">0</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="deathstar_ship_count" id="deathstar_ship_count" value="0" min="0" max="0"/>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="shipyard_section">
              <p class="cover_header">Combat ships</p>
              <div className="shipyard_section_layout">
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/small_cargo_ship.jpeg" alt="Small cargo ship" title="Small cargo ship"/>
                  <span class="planet_ship_available_count">341</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="small_cargo_ship_count" id="small_cargo_ship_count" value="0" min="0" max="341"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/large_cargo_ship.jpeg" alt="Large cargo ship" title="Large cargo ship"/>
                  <span class="planet_ship_available_count">894</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="large_cargo_ship_count" id="large_cargo_ship_count" value="0" min="0" max="894"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/colony_ship.jpeg" alt="Colony ship" title="Colony ship"/>
                  <span class="planet_ship_available_count">0</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="colony_ship_count" id="colony_ship_count" value="0" min="0" max="0"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/recycler.jpeg" alt="Recycler" title="Recycler"/>
                  <span class="planet_ship_available_count">3131</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="recycler_ship_count" id="recycler_ship_count" value="0" min="0" max="3131"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/espionage_probe.jpeg" alt="Espionage probe" title="Espionage probe"/>
                  <span class="planet_ship_available_count">0</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="espionage_probe_ship_count" id="espionage_probe_ship_count" value="0" min="0" max="0"/>
                    </form>
                  </div>
                </div>
                <div class="planet_ship_container">
                  <img class="planet_ship_icon" src="../img/solar_satellite.jpeg" alt="Solar satellite" title="Solar satellite"/>
                  <span class="planet_ship_available_count">0</span>
                  <div class="planet_ship_action">
                    <form class="planet_ship_selected_count">
                      <input class="planet_ship_selector" method="post" type="number" name="solar_satellite_ship_count" id="solar_satellite_ship_count" value="0" min="0" max="0"/>
                    </form>
                  </div>
                </div>
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
                    <span className="fleet_flight_detail_valid_value">35 (1%)</span>
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
                    <span className="fleet_flight_detail_valid_value">23250000</span>
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
          <div className="toto">TODO</div>
        }
      </div>
    );
  }
}

export default Fleets;
