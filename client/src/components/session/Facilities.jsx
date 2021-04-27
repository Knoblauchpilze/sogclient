
import '../../styles/session/Facilities.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';
import ElementUpgrade from './ElementUpgrade.jsx';

import Server from '../game/server.js';

import BuildingsModule from '../game/buildings.js';
import { BUILDINGS_FETCH_SUCCEEDED } from '../game/buildings.js';

import {resources_list} from '../../datas/resources.js';
import {facilities_list} from '../../datas/facilities.js';

function fetchBuildingLevel(buildings, name) {
  const building = buildings.find(b => b.name === name);

  if (building) {
    return building.level;
  }

  // Assume no level is defined.
  return 0;
}

class Facilities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines the information about the facilities that
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
    // facilities available to build/demolish.
    const facilities = [];

    for (let id = 0 ; id < facilities_list.length ; id++) {
      const b = buildings.find(b => b.name === facilities_list[id].name);

      if (b) {
        // Fetch the level of this building on the planet.
        let lvl = fetchBuildingLevel(this.props.planet.buildings, b.name);

        // Compute the costs and register the resources.
        const costs = [];
        const iCosts = b.cost.init_costs;

        for (let rID = 0 ; rID < iCosts.length ; rID++) {
          // We need to find the name of the resource based
          // on the id from the `resources` value of the
          // props of the component.
          const r = this.props.resources.find(res => res.id === iCosts[rID].resource);

          if (!r) {
            console.error("Failed to register resource \"" + iCosts[rID].resource + "\"");
            continue;
          }

          // From there the resource data from the name.
          const rData = resources_list.find(res => res.name === r.name);

          if (!rData) {
            console.error("Failed to register resource data \"" + iCosts[rID].resource + "\"");
            continue;
          }

          // We can now register the resource.
          costs.push({
            icon: rData.mini,
            name: rData.name,
            amount: iCosts[rID].amount,
            enough: false,
          });
        }

        facilities.push({
          id: b.id,
          name: b.name,
          level: lvl,
          icon: facilities_list[id].icon,
          resources: costs,
        });
      }
      else {
        console.error("Failed to find building \"" + facilities_list[id].name + "\" from server's data");
      }
    }

    this.setState({
      buildings: facilities,
    });
  }

  selectElement(facility) {
    // Update selected facility: we need to find the index
    // of the building corresponding to the input element
    // if possible.
    if (facility === "") {
      this.setState({
        id: -1,
      });
    }

    const id = this.state.buildings.findIndex(b => b.id === facility);

    if (id === -1) {
      console.error("Failed to select facility \"" + facility + "\"");
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
    let title = "Facilities - Unknown planet";

    if (this.props.planet) {
      title = "Facilities - " + this.props.planet.name;
    }

    let building;
    if (this.state.id !== -1) {
      building = this.state.buildings[this.state.id];
    }

    return (
      <div className="facilities_layout">
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
        <div className="facilities_buildings_section">
          <p className="cover_header">Production and research</p>
          <div className="facilities_buildings_layout">
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

export default Facilities;
