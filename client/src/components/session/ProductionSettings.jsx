
import '../../styles/session/ProductionSettings.css';
import '../../styles/session/ProductionSettingsEntry.css';
import React from 'react';
import ProductionSettingsEntry from './ProductionSettingsEntry.jsx';

import {resources_list} from '../../datas/resources.js';
import {buildings_list} from '../../datas/buildings.js';
import {ships_list} from '../../datas/ships.js';
import {technologies_list} from '../../datas/technologies.js';
import { computeProduction, computeStorage } from '../game/rules.js';

import Planet from '../game/planet.js';
import { PRODUCTION_UPDATE_POST_SUCCEEDED } from '../game/planet.js';

// Defines a string literal defining the action to recalculate
// the production and apply the changed parameters.
const RECALCULATE_PROD = "recalculate";

// Defines a string literal to set all production factors to
// 0%.
const PROD_TO_MIN = "min_prod";

// Defines a string literal to set all production factors to
// 100%.
const PROD_TO_MAX = "max_prod";

function buildEntries(built, data, order, resources, prodInfo, temp) {
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
    let factor = 0.0;
    let count = 0;

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

      const pInfo = prodInfo.find(pi => pi.resource === rDesc.id);
      if (pInfo && p > 0) {
        p *= pInfo.factor;

        factor += pInfo.factor;
        count++;
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

    out.push({
      id: e.id,
      name: name,
      factor: (count === 0 ? 1.0 : factor / count),
      production: prod,
    });
  }

  return out;
}

function computeProductionFactor(buildings, ships, technologies) {
  let count = buildings.length + ships.length + technologies.length;

  if (count === 0) {
    return 1.0;
  }

  let factor = 0.0;

  for (let id = 0 ; id < buildings.length ; ++id) {
    factor += buildings[id].factor;
  }
  for (let id = 0 ; id < ships.length ; ++id) {
    factor += ships[id].factor;
  }
  for (let id = 0 ; id < technologies.length ; ++id) {
    factor += technologies[id].factor;
  }

  return factor / count;
}

class ProductionSettings extends React.Component {
  constructor(props) {
    super(props);

    // Extract production factor info.
    let prod_info = [];
    if (props.planet && props.planet.resources.length > 0) {
      prod_info = props.planet.resources.map(function(r) {
        return {
          resource: r.resource,
          factor: r.production_factor,
        }
      });
    }

    // Generate representation for elements that produce resources.
    let buildings = [];
    if (props.buildings.length > 0 && props.planet.buildings.length > 0 && props.resources.length > 0) {
      const avgTemp = (props.planet.min_temperature + props.planet.max_temperature) / 2.0;
      buildings = buildEntries(props.planet.buildings, props.buildings, buildings_list, props.resources, prod_info, avgTemp);
    }

    let ships = [];
    if (props.ships.length > 0 && props.planet.ships.length > 0 && props.resources.length > 0) {
      const avgTemp = (props.planet.min_temperature + props.planet.max_temperature) / 2.0;
      ships = buildEntries(props.planet.ships, props.ships, ships_list, props.resources, prod_info, avgTemp);
    }

    let technologies = [];
    if (props.technologies.length > 0 && props.player.technologies.length > 0 && props.resources.length > 0) {
      const avgTemp = (props.planet.min_temperature + props.planet.max_temperature) / 2.0;
      technologies = buildEntries(props.player.technologies, props.technologies, technologies_list, props.resources, prod_info, avgTemp);
    }

    let baseRevenue = {
      id: "base_revenue",
      name: "Base revenue",
      factor: 1.0,
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
        factor: 1.0,
        production: [],
      },
      {
        id: "total_revenue_day",
        name: "Total per day:",
        factor: 1.0,
        production: [],
      },
      {
        id: "total_revenue_week",
        name: "Total per week:",
        factor: 1.0,
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
      factor: 1.0,
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

    const prod_factor = computeProductionFactor(buildings, ships, technologies);

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

      // The global production factor: aggregate all the values
      // from the individual items.
      production_factor: prod_factor,
    };

    this.updateProductionFactor = this.updateProductionFactor.bind(this);
  }

  updateProductionFactor(id, factor) {
    const nFactor = parseFloat(factor);

    // Try to find the corresponding element in the
    // various internal lists.
    let eID = this.state.buildings.findIndex(e => e.id === id);
    if (eID !== -1) {
      const bs = this.state.buildings.slice();
      bs[eID].factor = nFactor;

      this.setState({
        buildings: bs,
        production_factor: computeProductionFactor(bs, this.state.ships, this.state.technologies),
      });

      return;
    }

    eID = this.state.ships.findIndex(e => e.id === id);
    if (eID !== -1) {
      const ss = this.state.ships.slice();
      ss[eID].factor = nFactor;

      this.setState({
        ships: ss,
        production_factor: computeProductionFactor(this.state.buildings, ss, this.state.technologies),
      });

      return;
    }

    eID = this.state.technologies.findIndex(e => e.id === id);
    if (eID !== -1) {
      const ts = this.state.technologies.slice();
      ts[eID].factor = nFactor;

      this.setState({
        technologies: ts,
        production_factor: computeProductionFactor(this.state.buildings, this.state.ships, ts),
      });

      return;
    }

    console.error("Failed to interpret id \"" + id + "\" with factor " + nFactor);
  }

  productionUpdateFailed(err) {
    alert(err);
  }

  productionUpdateSucceeded(action) {
    console.info("Registered production update " + action);

    // Request a data reload.
    this.props.actionPerformed();
  }

  recalculate(kind) {
    // Handle quick access for min and max prod.
    let factor = -1;
    if (kind === PROD_TO_MIN) {
      factor = 0.0;
    }
    if (kind === PROD_TO_MAX) {
      factor = 1.0;
    }

    if (factor !== -1) {
      const b = this.state.buildings.map(function (e) {
        e.factor = factor;
        return e;
      });
      const s = this.state.ships.map(function (e) {
        e.factor = factor;
        return e;
      });
      const t = this.state.technologies.map(function (e) {
        e.factor = factor;
        return e;
      });

      this.setState({
        buildings: b,
        ships: s,
        technologies: t,
        production_factor: computeProductionFactor(b, s, t),
      });

      return;
    }

    // We need to gather the production factor by resource
    // instead of by buildings/ships/technologies before
    // sending it to the server.
    let prod_update = [];
    for (let id = 0 ; id < resources_list.length ; ++id) {
      const rData = resources_list[id];
      const rDesc = this.props.resources.find(r => r.name === rData.name);

      if (!rDesc) {
        console.error("Failed to get data for resource \"" + rData.name + "\"");
        continue;
      }

      // Compute a general production factor.
      let count = 0;
      let factor = 0.0;

      for (let eID = 0 ; eID < this.state.buildings.length ; ++eID) {
        const eData = this.state.buildings[eID];

        const rProd = eData.production.find(p => p.id === rDesc.id);
        if (!rProd || rProd.production === 0) {
          continue;
        }

        count++;
        factor += eData.factor;
      }

      for (let eID = 0 ; eID < this.state.ships.length ; ++eID) {
        const eData = this.state.ships[eID];

        const rProd = eData.production.find(p => p.id === rDesc.id);
        if (!rProd || rProd.production === 0) {
          continue;
        }

        count++;
        factor += eData.factor;
      }

      for (let eID = 0 ; eID < this.state.technologies.length ; ++eID) {
        const eData = this.state.technologies[eID];

        const rProd = eData.production.find(p => p.id === rDesc.id);
        if (!rProd || rProd.production === 0) {
          continue;
        }

        count++;
        factor += eData.factor;
      }

      if (count === 0) {
        continue;
      }

      prod_update.push({
        resource: rDesc.id,
        production_factor: factor / count,
      });
    }

    // Create an object to handle the creation of the production
    // update for the resources.
    if (prod_update.length === 0) {
      return;
    }

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

    console.log("prod: " + JSON.stringify(prod_update));

    p.updateProduction(prod_update)
      .then(function (res) {
        if (res.status !== PRODUCTION_UPDATE_POST_SUCCEEDED) {
          tab.productionUpdateFailed(res.status);
        }
        else {
          tab.productionUpdateSucceeded(res.planet);
        }
      })
      .catch(err => tab.productionUpdateFailed(err));
  }

  render() {
    // According to this link: https://fr.reactjs.org/docs/lists-and-keys.html
    // It is necessary to keep the key for each production settings entry and
    // not on the root element of the component itself.
    console.log("b: " + JSON.stringify(this.state.buildings));

    return (
      <div className="prod_settings_layout">
        <div className="prod_settings_control_layout">
          <p className="prod_settings_prod_factor">{"Production factor: " + Math.floor(this.state.production_factor * 100) + "%"}</p>
          <div>
            <button className="prod_settings_control" onClick={() => this.recalculate(RECALCULATE_PROD)}>Recalculate</button>
            <button className="prod_settings_control" onClick={() => this.recalculate(PROD_TO_MIN)}>0%</button>
            <button className="prod_settings_control" onClick={() => this.recalculate(PROD_TO_MAX)}>100%</button>
          </div>
        </div>
        <div className="prod_settings_entry_layout">
          <div className="prod_settings_entry_name">Resources</div>
          {
            resources_list.map(r => <span key={r.name} className="prod_settings_entry_resource">{r.name}</span>)
          }
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
