
import '../../styles/session/Shipyard.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';
import ElementUpgrade from './ElementUpgrade.jsx';

import Planet from '../game/planet.js';
import { UPGRADE_ACTION_POST_SUCCEEDED } from '../game/planet.js';

import {ships_list} from '../../datas/ships.js';
import { CIVIL_SHIP, COMBAT_SHIP } from '../../datas/ships.js';

class Shipyard extends React.Component {
  constructor(props) {
    super(props);

    // Generate properties from the data fetched from the server.
    const civils = [];
    const combats = [];

    const p = new Planet(
      props.planet,
      props.player.technologies,
      props.planets,
      props.universe,
      props.resources,
      props.buildings,
      props.technologies,
      props.ships,
      props.defenses,
    );

    for (let id = 0 ; id < ships_list.length ; id++) {
      // Fetch the data for this ship.
      const out = p.getShipData(ships_list[id].name);

      if (!out.found) {
        console.error("Failed to find ship \"" + ships_list[id].name + "\" from server's data");
      }
      else {
        switch (ships_list[id].kind) {
          case CIVIL_SHIP:
            civils.push(out.ship);
            break;
          case COMBAT_SHIP:
            combats.push(out.ship);
            break;
          default:
            // Unknown research type.
            console.error("Unknown ship type \"" + ships_list[id].kind + "\"");
            break;
        }
      }
    }

    this.state = {
      // Defines the information about the ships that
      // are registered for this component.
      civil_ships: civils,

      // Defines the information about the ships that
      // are registered for this component.
      combat_ships: combats,

      // Defines the selected element so far. This is
      // assigned when the user clicks on a child item.
      id: -1,

      // Defines the kind of ship to which the `id` is
      // referring to.
      kind: "",
    };
  }

  selectElement(ship) {
    // Update selected ship: we need to find the index
    // of the ship corresponding to the input element
    // if possible.
    if (ship === "") {
      this.setState({
        id: -1,
        kind: "",
      });
    }

    // Search technologies in order.
    let id = this.state.civil_ships.findIndex(s => s.id === ship);
    let kind = CIVIL_SHIP;

    if (id === -1) {
      id = this.state.combat_ships.findIndex(s => s.id === ship);
      kind = COMBAT_SHIP;
    }

    if (id === -1) {
      console.error("Failed to select ship \"" + ship + "\"");
    }

    // In case the ship is the same as the one
    // already selected we will deactivate the
    // upgrade panel.
    if (this.state.id === id && this.state.kind === kind) {
      this.setState({
        id: -1,
        kind: "",
      });

      return;
    }

    this.setState({
      id: id,
      kind: kind,
    });
  }

  uprgadeActionFailed(err) {
    alert(err);
  }

  uprgadeActionSucceeded(action) {
    console.info("Registered action " + action);

    // Request a data reload.
    this.props.actionPerformed();
  }

  buildElement(ship, amount) {
    // Create an object to handle the creation of an action
    // to upgrade the input element.
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

    p.upgradeShip(ship, amount)
      .then(function (res) {
        if (res.status !== UPGRADE_ACTION_POST_SUCCEEDED) {
          tab.uprgadeActionFailed(res.status);
        }
        else {
          tab.uprgadeActionSucceeded(res.action);
        }
      })
      .catch(err => tab.uprgadeActionFailed(err));
  }

  render() {
    let title = "Shipyard - Unknown planet";

    if (this.props.planet) {
      title = "Shipyard - " + this.props.planet.name;
    }

    let ship;
    if (this.state.id !== -1) {
      switch (this.state.kind) {
        case CIVIL_SHIP:
          ship = this.state.civil_ships[this.state.id];
          break;
        case COMBAT_SHIP:
          ship = this.state.combat_ships[this.state.id];
          break;
        default:
            // Unhandled.
            break;
      }
    }

    return (
      <div className="shipyard_layout">
        <div className="cover_layout">
          <h3 className="cover_title">{title}</h3>
          {
            ship &&
            <ElementUpgrade item={ship}
                            selectElement={(id) => this.selectElement(id)}
                            buildElement={(id, amount) => this.buildElement(id, amount)}
                            />
          }
        </div>
        <div className="shipyard_ships_layout">
          <div className="shipyard_section">
            <p className="cover_header">Combat ships</p>
            <div className="shipyard_section_layout">
              {
                this.state.civil_ships.map((s, id) =>
                  <ElementContainer key={s.id}
                                    id={s.id}
                                    icon={s.icon}
                                    alt={s.name}
                                    title={s.name}
                                    level={s.count}
                                    selectElement={(id) => this.selectElement(id)}
                                    selected={id === this.state.id && this.state.kind === CIVIL_SHIP}
                                    />
                )
              }
            </div>
          </div>

          <div className="shipyard_section">
            <p className="cover_header">Civil ships</p>
            <div className="shipyard_section_layout">
              {
                this.state.combat_ships.map((s, id) =>
                  <ElementContainer key={s.id}
                                    id={s.id}
                                    icon={s.icon}
                                    alt={s.name}
                                    title={s.name}
                                    level={s.count}
                                    selectElement={(id) => this.selectElement(id)}
                                    selected={id === this.state.id && this.state.kind === COMBAT_SHIP}
                                    />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Shipyard;
