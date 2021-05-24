
import '../../styles/session/ResourcesDisplay.css';
import React from 'react';
import ResourceInfo from './ResourceInfo.jsx';

import { resources_list } from '../../datas/resources.js';
import { computeProduction } from '../game/rules.js';

function generateResourceDesc(res, rFromPlanet, data, bFromPlanet, buildings, temp, ratio) {
  // Find the resource data.
  const rDesc = data.find(r => r.name === res.name);
  const rData = rFromPlanet.find(r => r.resource === rDesc.id);

  // Compute the production for this resource. We will
  // handle the cases where the resources can't be stored
  // because in this case the `amount` is set to `0` and
  // we still want to get an idea of how much is `produced`.
  let amount = rData.amount;
  let prod = rData.production;

  if (!rDesc.storable) {
    for (let id = 0 ; id < buildings.length ; ++id) {
      const bDesc = buildings[id];

      const rProd = bDesc.production.find(r => r.resource === rDesc.id);
      if (rProd) {

        const bData = bFromPlanet.find(b => b.id === bDesc.id);
        let p = computeProduction(rProd, bData.level, temp, (rDesc.scalable ? ratio : 1));

        // Apply energy and production factor.
        p *= (bData.production_factor * bData.energy_factor);

        if (p !== 0) {
          amount += p;
        }
        if (p > 0) {
          prod += p;
        }
      }
    }
  }

  return {
    title: res.name,
    icon: res.mini,

    amount: Math.floor(amount),
    production: prod,
    storage: rData.storage,
    storable: rDesc.storable,
  };
}

function ResourcesDisplay (props) {
  let temp = 0;
  if (props.planet) {
    temp = (props.planet.min_temperature + props.planet.max_temperature) / 2;
  }

  return (
    <div className="resources_display_layout">
      {
        props.planet &&
        props.planet.resources.length > 0 &&
        props.resources.length > 0 &&
        props.planet.buildings.length > 0 &&
        props.buildings.length > 0 &&
        resources_list.map(r =>
          <ResourceInfo key={r.name} data={generateResourceDesc(r, props.planet.resources, props.resources, props.planet.buildings, props.buildings, temp, props.universe.economic_speed)} />
        )
      }
    </div>
  );
}

export default ResourcesDisplay;
