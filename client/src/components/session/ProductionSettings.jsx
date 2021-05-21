
import '../../styles/session/ProductionSettings.css';
import '../../styles/session/ProductionSettingsEntry.css';
import React from 'react';
import ProductionSettingsEntry from './ProductionSettingsEntry.jsx';

import {resources_list} from '../../datas/resources.js';
import {buildings_list} from '../../datas/buildings.js';
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

function buildEntries(built, data, order, resources, temp, ratio) {
  let out = [];

  // Traverse the buildings in the order defined in input:
  // this allows to have a consistent ordering for elements
  // no matter the order of the data fetched from the server.
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

    // Discard the element in case it does not produce
    // anything.
    if (!eDesc.production || eDesc.production.length === 0) {
      continue;
    }

    // Compute the production for each resource.
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
        p = e.production_factor * computeProduction(r, e.level, temp, (rDesc.scalable ? ratio : 1));
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
      factor: e.production_factor,
      production: prod,
    });
  }

  return out;
}

function computeProductionFactor(buildings) {
  let count = buildings.length;

  if (count === 0) {
    return 1.0;
  }

  let factor = 0.0;

  for (let id = 0 ; id < buildings.length ; ++id) {
    factor += buildings[id].factor;
  }

  return factor / count;
}

class ProductionSettings extends React.Component {
  constructor(props) {
    super(props);

    // Generate representation for elements that produce resources.
    let buildings = [];

    // Generate the base revenue info: we will use the resources
    // fetched from the server but still traverse them in order
    // as defined in the resources list.
    // At the same time we will also generate the total production
    // for resources for various time periods. The total will only
    // handle the base production (the additional production will
    // be added later).
    let baseRevenue = {
      id: "base_revenue",
      name: "Base revenue",
      factor: 1.0,
      production: [],
    };
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

        // Register the base production.
        baseRevenue.production.push({
          id: rDesc.id,
          production: rDesc.base_production,
        });

        // Register the total production.
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

    // Generate production info for buildings. The process is very
    // similar for each one: we basically traverse the resources
    // and see for each element if a production rule is assigned
    // for the current resource: if yes, we add it and if not we
    // discard the element.
    // Each element will only appear in the list in case it has at
    // least a production for one resource.
    if (props.buildings.length > 0 && props.planet.buildings.length > 0 && props.resources.length > 0) {
      const avgTemp = (props.planet.min_temperature + props.planet.max_temperature) / 2.0;
      buildings = buildEntries(
        props.planet.buildings,
        props.buildings,
        buildings_list,
        props.resources,
        avgTemp,
        props.universe.economic_speed,
      );

      // Update the total production based on the list of buildings.
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

    // Generate the storage capacity for each resource. Note that
    // we handle the capacity for each resource so the outermost
    // loop is based on the resources. We then aggregate all the
    // buildings that contribute to the storage of the resource.
    let storageCapacity = {
      id: "storage_capacity",
      name: "Storage capacity",
      factor: 1.0,
      production: [],
    };
    if (props.buildings.length > 0 && props.planet.buildings.length > 0 && props.resources.length > 0) {
      // For each resource.
      for (let id = 0 ; id < resources_list.length ; ++id) {
        const rDesc = props.resources.find(r => r.name === resources_list[id].name);

        // Accumulate buildings that have storage effects on
        // this resource.
        let storage = 0;

        // In case the resource can be stored, accumulate the
        // storage capacity added by each building.
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

    const prod_factor = computeProductionFactor(buildings);

    this.state = {
      // The list of buildings that have an impact on the
      // production of any resource.
      buildings: buildings,

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
    let prod_update = this.state.buildings.map(
      function (b) {
        return {
          id: b.id,
          production_factor: b.factor,
        }
      }
    );

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
        <ProductionSettingsEntry key={"storage_capacity"}
                                 entry={this.state.storage_capacity}
                                 odd={(1 + this.state.buildings.length) % 2 === 0}
                                 adjustable={false}
                                 />
        {
          this.state.total_production.map((e, id) =>
            <ProductionSettingsEntry key={e.id}
                                     entry={e}
                                     odd={(id + 1 + this.state.buildings.length + 1) % 2 === 0}
                                     adjustable={false}
                                     />
          )
        }
      </div>
    );
  }
}

export default ProductionSettings;
