
import '../../styles/session/ProductionSettings.css';
import '../../styles/session/ProductionSettingsEntry.css';
import React from 'react';
import ProductionSettingsEntry from './ProductionSettingsEntry.jsx';

import {resources_list} from '../../datas/resources.js';
import {buildings_list} from '../../datas/buildings.js';
import {ships_list} from '../../datas/ships.js';
import {technologies_list} from '../../datas/technologies.js';
import { computeProduction, computeStorage } from '../game/rules.js';

// Defines a string literal defining the action to recalculate
// the production and apply the changed parameters.
const RECALCULATE_PROD = "recalculate";

// Defines a string literal to set all production factors to
// 0%.
const PROD_TO_MIN = "min_prod";

// Defines a string literal to set all production factors to
// 100%.
const PROD_TO_MAX = "max_prod";

function buildEntries(built, data, order, resources, temp) {
  let out = [];

  for (let idx = 0 ; idx < order.length ; ++idx) {
    const e = built.find(e => e.name === order[idx].name);
    if (!e) {
      // The building does not exist on this planet.
      continue;
    }

    const eDesc = data.find(i => i.id === e.id);
    if (!eDesc) {
      console.error("Failed to generate description for item \"" + e.id + "\"");
      continue;
    }

    if (!eDesc.production || eDesc.production.length === 0) {
      // This item does not produce any resource.
      continue;
    }

    // Compute the production for this resource.
    let prod = [];

    for (let rID = 0 ; rID < resources_list.length ; ++rID) {
      // Fetch the resource description from its 'abstract' representation.
      const rDesc = resources.find(r => r.name === resources_list[rID].name);
      if (!rDesc) {
        continue;
      }

      // Fetch the production for this particular resource.
      const r = eDesc.production.find(r => r.resource === rDesc.id);
      let p = 0.0;
      if (r) {
        p = computeProduction(r, e.level, temp);
      }

      prod.push({
        id: rDesc.id,
        production: p,
      });
    }

    // Generate the name of the item.
    let name = eDesc.name;
    if (e.level || e.level === 0) {
      name += " (level " + e.level + ")";
    }
    else if (e.amount || e.amount === 0) {
      name += " (count: " + e.amount + ")";
    }
    console.log("e: " + JSON.stringify(e));

    out.push({
      id: e.id,
      name: name,
      factor: 100,
      production: prod,
    });
  }

  return out;
}

class ProductionSettings extends React.Component {
  constructor(props) {
    super(props);

    // Generate representation for buildings that produce resources.
    let buildings = [];
    if (props.buildings.length > 0 && props.planet.buildings.length > 0 && props.resources.length > 0) {
      const avgTemp = (props.planet.min_temperature + props.planet.max_temperature) / 2.0;
      buildings = buildEntries(props.planet.buildings, props.buildings, buildings_list, props.resources, avgTemp);
    }

    let ships = [];
    if (props.ships.length > 0 && props.planet.ships.length > 0 && props.resources.length > 0) {
      const avgTemp = (props.planet.min_temperature + props.planet.max_temperature) / 2.0;
      console.log("building entries for ships");
      ships = buildEntries(props.planet.ships, props.ships, ships_list, props.resources, avgTemp);
    }

    let technologies = [];
    if (props.technologies.length > 0 && props.player.technologies.length > 0 && props.resources.length > 0) {
      const avgTemp = (props.planet.min_temperature + props.planet.max_temperature) / 2.0;
      technologies = buildEntries(props.player.technologies, props.technologies, technologies_list, props.resources, avgTemp);
    }

    let baseRevenue = {
      id: "base_revenue",
      name: "Base revenue",
      factor: 100,
      production: [],
    };
    if (props.resources.length > 0) {
      for (let id = 0 ; id < resources_list.length ; ++id) {
        const rDesc = props.resources.find(r => r.name === resources_list[id].name);
        if (!rDesc) {
          console.error("Failed to find resource \"" + resources_list[id].name + "\" base revenue");
          continue;
        }

        baseRevenue.production.push({
          id: rDesc.id,
          production: rDesc.base_production,
        });
      }
    }

    let totalProduction = [
      {
        id: "total_revenue_hour",
        name: "Total per hour:",
        factor: 100,
        production: [],
      },
      {
        id: "total_revenue_day",
        name: "Total per day:",
        factor: 100,
        production: [],
      },
      {
        id: "total_revenue_week",
        name: "Total per week:",
        factor: 100,
        production: [],
      }
    ];
    if (props.resources.length > 0) {
      for (let id = 0 ; id < resources_list.length ; ++id) {
        const rDesc = props.resources.find(r => r.name === resources_list[id].name);
        if (!rDesc) {
          console.error("Failed to find resource \"" + resources_list[id].name + "\" base revenue");
          continue;
        }

        // Register this resource for each total.
        totalProduction[0].production.push({
          id: rDesc.id,
          production: rDesc.base_production,
        });
        totalProduction[1].production.push({
          id: rDesc.id,
          production: rDesc.base_production * 24,
        });
        totalProduction[2].production.push({
          id: rDesc.id,
          production: rDesc.base_production * 24 * 7,
        });
      }
    }

    if (totalProduction[0].production.length > 0 && buildings.length > 0) {
      for (let id = 0 ; id < buildings.length ; ++id) {
        const e = buildings[id];

        for (let rID = 0 ; rID < e.production.length ; ++rID) {
          // For each, resource, check whether it already exist in the
          // total and add its value. Only handle total for non storable
          // resources.
          const r = e.production[rID];
          const eID = totalProduction[0].production.findIndex(rd => rd.id === r.id);

          const rd = props.resources.find(rd => rd.id === r.id);
          if (!rd.storable) {
            continue;
          }

          totalProduction[0].production[eID].production += r.production;
          totalProduction[1].production[eID].production += (r.production * 24);
          totalProduction[2].production[eID].production += (r.production * 24 * 7);
        }
      }
    }
    if (totalProduction[0].production.length > 0 && ships.length > 0) {
      for (let id = 0 ; id < ships.length ; ++id) {
        const e = ships[id];

        for (let rID = 0 ; rID < e.production.length ; ++rID) {
          // For each, resource, check whether it already exist in the
          // total and add its value. Only handle total for non storable
          // resources.
          const r = e.production[rID];
          const eID = totalProduction[0].production.findIndex(rd => rd.id === r.id);

          const rd = props.resources.find(rd => rd.id === r.id);
          if (!rd.storable) {
            continue;
          }

          totalProduction[0].production[eID].production += r.production;
          totalProduction[1].production[eID].production += (r.production * 24);
          totalProduction[2].production[eID].production += (r.production * 24 * 7);
        }
      }
    }
    if (totalProduction[0].production.length > 0 && technologies.length > 0) {
      for (let id = 0 ; id < technologies.length ; ++id) {
        const e = technologies[id];

        for (let rID = 0 ; rID < e.production.length ; ++rID) {
          // For each, resource, check whether it already exist in the
          // total and add its value. Only handle total for non storable
          // resources.
          const r = e.production[rID];
          const eID = totalProduction[0].production.findIndex(rd => rd.id === r.id);

          const rd = props.resources.find(rd => rd.id === r.id);
          if (!rd.storable) {
            continue;
          }

          totalProduction[0].production[eID].production += r.production;
          totalProduction[1].production[eID].production += (r.production * 24);
          totalProduction[2].production[eID].production += (r.production * 24 * 7);
        }
      }
    }

    let storageCapacity = {
      id: "storage_capacity",
      name: "Storage capacity",
      factor: 100,
      production: [],
    };
    if (props.buildings.length > 0 && props.planet.buildings.length > 0 && props.resources.length > 0) {
      for (let id = 0 ; id < resources_list.length ; ++id) {
        const rDesc = props.resources.find(r => r.name === resources_list[id].name);

        // Accumulate buildings that have storage effects on
        // this resource.
        let storage = 0;

        if (rDesc.storable) {
          for (let bID = 0 ; bID < props.buildings.length ; ++bID) {
            const b = props.buildings[bID];
            if (b.storage.length === 0) {
              continue;
            }

            for (let rID = 0 ; rID < b.storage.length ; ++rID) {
              const r = b.storage[rID];
              const bDesc = props.planet.buildings.find(bu => bu.id === b.id);
              let level = 0;
              if (bDesc) {
                level = bDesc.level;
              }

              if (r.resource !== rDesc.id) {
                continue;
              }

              storage += computeStorage(r, level);
            }
          }
        }

        storageCapacity.production.push({
          id: rDesc.id,
          production: storage,
        });
      }
    }

    this.state = {
      // The list of buildings that have an impact on the
      // production of any resource.
      buildings: buildings,

      // The list of ships that have an impact on the production
      // of any resource.
      ships: ships,

      // The list of tehcnologies that have an impact on the
      // production of any resource.
      technologies: technologies,

      // The base revenue of the resources.
      base_revenue: baseRevenue,

      // The storage capacity for each resource.
      storage_capacity: storageCapacity,

      // The total of the resources.
      total_production: totalProduction,
    };
  }

  updateProductionFactor(id, factor) {
    console.log("id: " + id + ", f: " + factor);
  }

  recalculate(kind) {
    console.log("kind: " + kind);
  }

  render() {
    // According to this link: https://fr.reactjs.org/docs/lists-and-keys.html
    // It is necessary to keep the key for each production settings entry and
    // not on the root element of the component itself.

    return (
      <div className="prod_settings_layout">
        <div className="prod_settings_control_layout">
          <p className="prod_settings_prod_factor">{"Production factor: 100%"}</p>
          <div className="prod_settings_quick_access_layout">
            <button className="prod_settings_control" onClick={() => this.recalculate(RECALCULATE_PROD)}>Recalculate</button>
            <button className="prod_settings_control" onClick={() => this.recalculate(PROD_TO_MIN)}>0%</button>
            <button className="prod_settings_control" onClick={() => this.recalculate(PROD_TO_MAX)}>100%</button>
          </div>
        </div>
        <ProductionSettingsEntry key={"base_revenue"}
                                 entry={this.state.base_revenue}
                                 odd={false}
                                 adjustable={false}
                                 />
        {
          this.state.buildings.map((e, id) =>
            <ProductionSettingsEntry key={e.id}
                                     entry={e}
                                     odd={(id + 1) % 2 === 0}
                                     adjustable={true}
                                     factor={e.factor}
                                     updateFactor={this.updateProductionFactor}
                                     />
          )
        }
        {
          this.state.ships.map((e, id) =>
            <ProductionSettingsEntry key={e.id}
                                     entry={e}
                                     odd={(id + 1 + this.state.buildings.length) % 2 === 0}
                                     adjustable={true}
                                     factor={e.factor}
                                     updateFactor={this.updateProductionFactor}
                                     />
          )
        }
        {
          this.state.technologies.map((e, id) =>
            <ProductionSettingsEntry key={e.id}
                                     entry={e}
                                     odd={(id + 1 + this.state.buildings.length + this.state.ships.length) % 2 === 0}
                                     adjustable={true}
                                     factor={e.factor}
                                     updateFactor={this.updateProductionFactor}
                                     />
          )
        }
        <ProductionSettingsEntry key={"storage_capacity"}
                                 entry={this.state.storage_capacity}
                                 odd={(1 + this.state.buildings.length + this.state.ships.length + this.state.technologies.length) % 2 === 0}
                                 adjustable={false}
                                 />
        {
          this.state.total_production.map((e, id) =>
            <ProductionSettingsEntry key={e.id}
                                     entry={e}
                                     odd={(id + 1 + this.state.buildings.length + this.state.ships.length + this.state.technologies.length + 1) % 2 === 0}
                                     adjustable={false}
                                     />
          )
        }
      </div>
    );
  }
}

export default ProductionSettings;
