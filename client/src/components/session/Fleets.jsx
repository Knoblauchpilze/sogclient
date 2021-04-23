
import '../../styles/session/Fleets.css';
import React from 'react';

// Defines the initial step of the fleets view where the
// player can select ships to include in the fleet.
const FLEET_INIT = "fleet_init";

// Defines the step where the player is able to select
// the destination of the fleet and the flight speed.
const FLEET_FLIGHT = "fleet_flight";

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

  generateInitFleetsView() {
    return (
      <div className="fleets_layout fleets_creation_container">
        <div className="fleets_slots_layout">
          <div>
            <span className="fleet_slot">Fleets: 0/15</span>
            <span className="fleet_slot">Expeditions: 0/4</span>
          </div>
          <div className="fleet_display_link">Fleet movements</div>
        </div>

        <div id="all_ships_section">
          <div class="planet_ships_section">
            <p class="planet_ships_header">Combat ships</p>
            <div id="planet_combat_ships">
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

          <div class="planet_ships_section">
            <p class="planet_ships_header">Civil ships</p>
            <div id="planet_civil_ships">
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

        <div className="fleets_confirmation_panel">
          <div className="fleets_confirmation_element">
            <button className="fleets_all_ships" type="button">All</button>
            <button className="fleets_no_ship" type="button">0</button>
          </div>
          <div className="fleets_confirmation_element">
            <button className="fleets_next_step" onClick = {() => this.updateFleetStep(FLEET_FLIGHT)}>NEXT</button>
          </div>
        </div>
      </div>
    );
  }

  generatFlightFleetsView() {
    return (<div>TODO</div>);
  }

  render() {
    switch (this.state.step) {
      case FLEET_FLIGHT:
        return this.generatFlightFleetsView();
      case FLEET_INIT:
      default:
        return this.generateInitFleetsView();
    }
  }
}

export default Fleets;
