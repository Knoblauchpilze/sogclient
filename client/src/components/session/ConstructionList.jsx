
import '../../styles/session/ConstructionList.css';
import React from 'react';
import ConstructionAction from './ConstructionAction.jsx';

import {buildings_list} from '../../datas/buildings.js';
import {technologies_list} from '../../datas/technologies.js';

function generateActionDesc(action, descs, data) {
  // We will assume that everything is working as expected
  // and that we can't get an upgrade of a building that
  // is not registered in the server.
  const eDesc = descs.find(e => e.id === action.element);
  const eData = data.find(e => e.name === eDesc.name);

  let eta;
  if (action.eta) {
    eta = action.eta;
  }
  else {
    const completion = Date.parse(action.completion_time)
    const now = Date.now();
    eta = completion - now;
  }

  return {
    id: action.id,
    name: eDesc.name,
    icon: eData.icon,
    level: action.desired_level,
    remaining: eta,
  };
}

function ConstructionList (props) {
  let buildings = [];
  let technologies = [];
  let shipsAndDefenses = [];

  if (props.planet && props.buildings.length > 0 && props.technologies.length > 0) {
    // Build the list of actions regarding buildings.
    buildings = props.planet.buildings_upgrade.map(
      a => generateActionDesc(a, props.buildings, buildings_list)
    );

    technologies = props.planet.technologies_upgrade.map(
      a => generateActionDesc(a, props.technologies, technologies_list)
    );

    // TODO: Handle this.
    // shipsAndDefenses = props.planet.ships_construction.concat(props.planet.defenses_construction).map();
  }

  return (
    <div className="construction_list_layout">
      <ConstructionAction title={"Building"} actions={buildings}/>
      <ConstructionAction title={"Research lab"} actions={technologies}/>
      <ConstructionAction title={"Shipyard"} actions={shipsAndDefenses}/>
    </div>
  );
}

export default ConstructionList;
