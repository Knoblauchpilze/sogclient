
import '../../styles/session/Resources.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';
import ElementUpgrade from './ElementUpgrade.jsx';

import Planet from '../game/planet.js';
import { UPGRADE_ACTION_POST_SUCCEEDED } from '../game/planet.js';

import {buildings_list} from '../../datas/buildings.js';
import { RESOURCE_BUILDING } from '../../datas/buildings.js';

class Resources extends React.Component {
  constructor(props) {
    super(props);

    // Generate properties from the buildings and
    // the technologies defined in the server.
    const resources = [];

    const p = new Planet(
      props.planet,
      props.player.technologies,
      props.planets,
      props.universe,
      props.resources,
      props.buildings,
      props.technologies,
    );

    for (let id = 0 ; id < buildings_list.length ; id++) {
      // Only consider buildings that are used for
      // resource storage or production.
      if (buildings_list[id].kind !== RESOURCE_BUILDING) {
        continue;
      }

      // Fetch the data for this building.
      const out = p.getBuildingData(buildings_list[id].name);

      if (!out.found) {
        console.error("Failed to find building \"" + buildings_list[id].name + "\" from server's data");
      }
      else {
        resources.push(out.building);
      }
    }

    this.state = {
      // Defines the information about the buildings that
      // are registered for this component.
      buildings: resources,

      // Defines the selected element so far. This is
      // assigned when the user clicks on a child item.
      id: -1,
    };
  }

  selectElement(building) {
    // Update selected building: we need to find the index
    // of the building corresponding to the input element
    // if possible.
    if (building === "") {
      this.setState({
        id: -1,
      });
    }

    const id = this.state.buildings.findIndex(b => b.id === building);

    if (id === -1) {
      console.error("Failed to select building \"" + building + "\"");
    }

    // In case the building is the same as the one already
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

  buildElement(building) {
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
    );

    const tab = this;

    p.upgradeBuilding(building)
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

  demolishElement(building) {
    // Create an object to handle the deletion of an action
    // to upgrade the input element.
    const p = new Planet(
      this.props.planet,
      this.props.player.technologies,
      this.props.planets,
      this.props.universe,
      this.props.resources,
      this.props.buildings,
      this.props.technologies,
    );

    const tab = this;

    p.demolishBuilding(building)
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
    let title = "Resources - Unknown planet";

    if (this.props.planet) {
      title = "Resources - " + this.props.planet.name;
    }

    let building;
    if (this.state.id !== -1) {
      building = this.state.buildings[this.state.id];
    }

    return (
      <div className="resources_layout">
        <div className="cover_layout">
          <h3 className="cover_title">{title}</h3>
          {
            building &&
            <ElementUpgrade item={building}
                            selectElement={(id) => this.selectElement(id)}
                            buildElement={(id) => this.buildElement(id)}
                            demolishElement={(id) => this.demolishElement(id)}
                            />
          }
        </div>
        <div className="resources_buildings_section">
          <p className="cover_header">Energy and resources</p>
          <div className="resources_buildings_layout">
            {
              this.state.buildings.map(b =>
                <ElementContainer key={b.id}
                                  id={b.id}
                                  icon={b.icon}
                                  alt={b.name}
                                  title={b.name}
                                  level={b.level}
                                  selectElement={(id) => this.selectElement(id)}
                                  />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Resources;
