
import '../../styles/session/Facilities.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';
import ElementUpgrade from './ElementUpgrade.jsx';

import Planet from '../game/planet.js';

import {buildings_list} from '../../datas/buildings.js';
import { FACILITY } from '../../datas/buildings.js';

class Facilities extends React.Component {
  constructor(props) {
    super(props);

    // Generate properties from the buildings and
    // the technologies defined in the server.
    const facilities = [];

    const p = new Planet(
      this.props.planet,
      this.props.player.technologies,
      this.props.resources,
      this.props.buildings,
      this.props.technologies,
    );

    for (let id = 0 ; id < buildings_list.length ; id++) {
      // Only consider buildings that are used to
      // improve the infrastructure of the planet.
      if (buildings_list[id].kind !== FACILITY) {
        continue;
      }

      // Fetch the data for this building.
      const out = p.getBuildingData(buildings_list[id].name);

      if (!out.found) {
        console.error("Failed to find building \"" + buildings_list[id].name + "\" from server's data");
      }
      else {
        facilities.push(out.building);
      }
    }

    this.state = {
      // Defines the information about the facilities that
      // are registered for this component.
      buildings: facilities,

      // Defines the selected element so far. This is
      // assigned when the user clicks on a child item.
      id: -1,
    };
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
            <ElementUpgrade item={building} selectElement={(id) => this.selectElement(id)} />
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
