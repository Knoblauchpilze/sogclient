
import '../../styles/session/ResourcesDisplay.css';
import React from 'react';
import ResourceInfo from './ResourceInfo.jsx';

import metal from '../../assets/metal_mini.jpeg';
import crystal from '../../assets/crystal_mini.jpeg';
import deuterium from '../../assets/deuterium_mini.jpeg';
import antimatter from '../../assets/antimatter_mini.jpeg';
import energy from '../../assets/energy_mini.jpeg';

function ResourcesDisplay (props) {
  let ma = 0;
  let ca = 0;
  let da = 0;
  let aa = 0;
  let ea = 0;

  if (props.planet && props.resources) {
    const mid = props.resources.find(r => r.name === "metal");
    if (mid) {
      const mAmount = props.planet.resources.find(r => r.resource === mid.id);
      if (mAmount) {
        ma = mAmount.amount;
      }
    }
    const cid = props.resources.find(r => r.name === "crystal");
    if (cid) {
      const cAmount = props.planet.resources.find(r => r.resource === cid.id);
      if (cAmount) {
        ca = cAmount.amount;
      }
    }
    const did = props.resources.find(r => r.name === "deuterium");
    if (did) {
      const dAmount = props.planet.resources.find(r => r.resource === did.id);
      if (dAmount) {
        da = dAmount.amount;
      }
    }
    const aid = props.resources.find(r => r.name === "antimatter");
    if (aid) {
      const aAmount = props.planet.resources.find(r => r.resource === aid.id);
      if (aAmount) {
        aa = aAmount.amount;
      }
    }
    const eid = props.resources.find(r => r.name === "energy");
    if (eid) {
      const eAmount = props.planet.resources.find(r => r.resource === eid.id);
      if (eAmount) {
        ea = eAmount.amount;
      }
    }
  }

  return (
    <div className="resources_display_layout">
      <ResourceInfo icon={metal}
                    alt_text={"Metal"}
                    title={"Metal"}
                    amount={ma}
                    />
      <ResourceInfo icon={crystal}
                    alt_text={"Crystal"}
                    title={"Crystal"}
                    amount={ca}
                    />
      <ResourceInfo icon={deuterium}
                    alt_text={"Deuterium"}
                    title={"Deuterium"}
                    amount={da}
                    />
      <ResourceInfo icon={antimatter}
                    alt_text={"Antimatter"}
                    title={"Antimatter"}
                    amount={aa}
                    />
      <ResourceInfo icon={energy}
                    alt_text={"Energy"}
                    title={"Energy"}
                    amount={ea}
                    />
    </div>
  );
}

export default ResourcesDisplay;
