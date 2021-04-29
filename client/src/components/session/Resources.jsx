
import '../../styles/session/Resources.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';
import ElementUpgrade from './ElementUpgrade.jsx';

import Server from '../game/server.js';

import BuildingsModule from '../game/buildings.js';
import { BUILDINGS_FETCH_SUCCEEDED } from '../game/buildings.js';

import {resources_list} from '../../datas/resources.js';
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

    console.log("p: " + JSON.stringify(this.props.planet.resources));

    for (let id = 0 ; id < buildings_list.length ; id++) {
      const b = buildings.find(b => b.name === buildings_list[id].name);

      if (b) {
        // Fetch the level of this building on the planet.
        let lvl = fetchBuildingLevel(this.props.planet.buildings, b.name);

        // Compute the costs and register the resources.
        const costs = [];
        const iCosts = b.cost.init_costs;

        // Make sure to traverse the resources as defined
        // in the list as we know they are sorted by order
        // of 'importance'.
        for (let rID = 0 ; rID < resources_list.length ; rID++) {
          // We need to find the description of the resource
          // based on the name defined in the data store.
          const r = this.props.resources.find(res => res.name === resources_list[rID].name);

          if (!r) {
            console.error("Failed to register find description for \"" + resources_list[rID].name + "\"");
            continue;
          }

          // We can now determine whether this building uses
          // this resource based on the identifier.
          const rData = iCosts.find(res => res.resource === r.id);

          if (!rData) {
            continue;
          }

          // Compute the total amount based on the progression
          // rule defined for this building.
          const amount = Math.floor(rData.amount * Math.pow(b.cost.progression, lvl));

          // Find whether or not the planet holds enough resources
          // to build this level.
          let enough = false;

          const available = this.props.planet.resources.find(res => res.resource === r.id);
          if (!available) {
            console.error("Failed to find amount of resource \"" + resources_list[rID].name + "\" on planet");
          }
          else {
            enough = (available.amount >= amount);
          }

          // We can now register the resource.
          costs.push({
            icon: resources_list[rID].mini,
            name: resources_list[rID].name,
            amount: amount,
            enough: enough,
          });
        }

        // Package the info in a single object.
        resources.push({
          id: b.id,
          name: b.name,
          level: lvl,
          icon: buildings_list[id].icon,
          resources: costs,
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

                            resources={building.resources}
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
