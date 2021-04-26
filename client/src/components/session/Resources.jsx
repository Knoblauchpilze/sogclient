
import '../../styles/session/Resources.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';
import ElementUpgrade from './ElementUpgrade.jsx';

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

      // Defines the selected element so far. This is
      // assigned when the user clicks on a child item.
      id: -1,
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
            <ElementUpgrade title={building.name}
                            level={building.level}
                            icon={building.icon}
                            duration={"6j 1h 26m"}
                            energy={1808}

                            buildable={true}
                            demolishable={false}

                            resources={[
                              {
                                icon: "haha",
                                name: "metal",
                                amount: 8917,
                                enough: false,
                              },
                              {
                                icon: "iuyy",
                                name: "crystal",
                                amount: 4917,
                                enough: true,
                              }
                            ]}
                            description={"This is a description"}

                            selectElement={(id) => this.selectElement(id)}
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
