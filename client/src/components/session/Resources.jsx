
import '../../styles/session/Resources.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';

import Server from '../game/server.js';

import BuildingsModule from '../game/buildings.js';
import { BUILDINGS_FETCH_SUCCEEDED } from '../game/buildings.js';

import {buildings_list} from '../../datas/buildings.js';

function fetchBuildingLevel(buildings, name) {
  const building = buildings.find(b => b.name === name);

  if (building) {
    return building.level;
  }

  // Assume no level is defined.
  return 0;
}

class Resources extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines the information about the buildings that
      // are registered for this component. This value is
      // only available after the data has been fetched
      // from the server.
      buildings: [],
    };
  }

  componentDidMount() {
    // Fetch the list of buildings from the server.
    const server = new Server();
    const buildings = new BuildingsModule(server);

    const game = this;

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
  }

  fetchDataFailed(err) {
    alert(err);
  }

  fetchBuildingsSucceeded(buildings) {
    // Update internal state: this means parsing the
    // fetched data to build the internal list of
    // buildings available to build/demolish.
    const resources = [];

    for (let id = 0 ; id < buildings_list.length ; id++) {
      const b = buildings.find(b => b.name === buildings_list[id].name);

      if (b) {
        // Fetch the level of this building on the planet.
        let lvl = fetchBuildingLevel(this.props.planet.buildings, b.name);

        resources.push({
          id: b.id,
          name: b.name,
          level: lvl,
          icon: buildings_list[id].icon,
        });
      }
      else {
        console.error("Failed to find building \"" + buildings_list[id].name + "\" from server's data");
      }
    }

    this.setState({
      buildings: resources,
    });
  }

  selectElement(building) {
    // TODO: Handle this.
    console.log("Selected building " + building);
  }

  render() {
    let title = "Resources - Unknown planet";

    if (this.props.planet) {
      title = "Resources - " + this.props.planet.name;
    }

    return (
      <div className="resources_layout">
        <div className="cover_layout">
          <h3 className="cover_title">{title}</h3>
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
