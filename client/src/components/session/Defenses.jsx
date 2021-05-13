
import '../../styles/session/Defenses.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';
import ElementUpgrade from './ElementUpgrade.jsx';

import Planet from '../game/planet.js';
import { UPGRADE_ACTION_POST_SUCCEEDED } from '../game/planet.js';

import {defenses_list} from '../../datas/defenses.js';

class Defenses extends React.Component {
  constructor(props) {
    super(props);

    // Generate properties from the data fetched from the server.
    const defenses = [];

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

    for (let id = 0 ; id < defenses_list.length ; id++) {
      // Fetch the data for this defense.
      const out = p.getDefenseData(defenses_list[id].name);

      if (!out.found) {
        console.error("Failed to find defense \"" + defenses_list[id].name + "\" from server's data");
      }
      else {
        defenses.push(out.defense);
      }
    }

    this.state = {
      // Defines the information about the defenses that
      // are registered for this component.
      defenses: defenses,

      // Defines the selected element so far. This is
      // assigned when the user clicks on a child item.
      id: -1,
    };
  }

  selectElement(defense) {
    // Update selected defense: we need to find the index
    // of the ship corresponding to the input element
    // if possible.
    if (defense === "") {
      this.setState({
        id: -1,
      });
    }

    // Search technologies in order.
    let id = this.state.defenses.findIndex(d => d.id === defense);

    if (id === -1) {
      console.error("Failed to select defense \"" + defense + "\"");
    }

    // In case the defense is the same as the one already
    // selected we will deactivate the upgrade panel.
    if (this.state.id === id) {
      this.setState({
        id: -1
      });

      return;
    }

    this.setState({
      id: id,
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

  buildElement(defense, amount) {
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

    p.upgradeDefense(defense, amount)
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
    let title = "Defenses - Unknown planet";

    if (this.props.planet) {
      title = "Defenses - " + this.props.planet.name;
    }

    let defense;
    if (this.state.id !== -1) {
      defense = this.state.defenses[this.state.id];
    }

    return (
      <div className="defenses_layout">
        <div className="cover_layout">
          <h3 className="cover_title">{title}</h3>
          {
            defense &&
            <ElementUpgrade item={defense}
                            selectElement={(id) => this.selectElement(id)}
                            buildElement={(id, amount) => this.buildElement(id, amount)}
                            />
          }
        </div>
        <div className="defenses_systems_section">
          <p className="cover_header">Defense systems</p>
          <div className="defenses_systems_layout">
            {
              this.state.defenses.map((d, id) =>
                <ElementContainer key={d.id}
                                  id={d.id}
                                  icon={d.icon}
                                  alt={d.name}
                                  title={d.name}
                                  level={d.count}
                                  selectElement={(id) => this.selectElement(id)}
                                  selected={id === this.state.id}
                                  />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Defenses;
