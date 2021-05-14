
import '../../styles/session/ResourcesDisplay.css';
import React from 'react';
import ResourceInfo from './ResourceInfo.jsx';

import { resources_list } from '../../datas/resources.js';

function generateResourceDesc(res, fromPlanet, data) {
  // Find the resource data.
  const rDesc = data.find(r => r.name === res.name);
  const rData = fromPlanet.find(r => r.resource === rDesc.id);

  return {
    title: res.name,
    icon: res.mini,

    amount: Math.floor(rData.amount),
    production: rData.production,
    storage: rData.storage,
    storable: rDesc.storable,
  };
}

function ResourcesDisplay (props) {
  if (props.planet && props.resources) {
  }

  return (
    <div className="resources_display_layout">
      {
        props.planet && props.resources &&
        resources_list.map(r =>
          <ResourceInfo key={r.name} data={generateResourceDesc(r, props.planet.resources, props.resources)} />
        )
      }
    </div>
  );
}

export default ResourcesDisplay;
