
import '../../styles/session/ConstructionList.css';
import React from 'react';
import ConstructionAction from './ConstructionAction.jsx';

import {buildings_list} from '../../datas/buildings.js';
import {technologies_list} from '../../datas/technologies.js';
import {ships_list} from '../../datas/ships.js';
import {defenses_list} from '../../datas/defenses.js';

import { computeActionCompletionTime } from '../game/actions.js';

function generateActionDesc(action, descs, data) {
  // We will assume that everything is working as expected
  // and that we can't get an upgrade of a building that
  // is not registered in the server.
  const eDesc = descs.find(e => e.id === action.element);
  const eData = data.find(e => e.name === eDesc.name);

  // Depending on whether the action is a progress update
  // or a fixed cost action the syntax is a bit different.
  let eta;

  if (action.desired_level) {
    if (action.eta) {
      eta = action.eta;
    }
    else {
      const completion = Date.parse(action.completion_time);
      const now = Date.now();
      eta = completion - now;
    }
  }
  else {
    if (action.eta) {
      eta = action.eta;
    }
    else {
      eta = computeActionCompletionTime(action);
    }
  }

  let out = {
    id: action.id,
    name: eDesc.name,
    icon: eData.icon,
    remaining: eta,
  };

  if (action.desired_level) {
    out.level = action.desired_level;
  }
  if (action.remaining) {
    out.amount = action.remaining;
  }

  return out;
}

function ConstructionList (props) {
  let buildings = [];
  let technologies = [];
  let shipsAndDefenses = [];

  if (props.planet &&
      props.buildings.length > 0 &&
      props.technologies.length > 0 &&
      props.ships.length > 0 &&
      props.defenses.length > 0)
  {
    // Build the list of actions regarding buildings.
    buildings = props.planet.buildings_upgrade.map(
      a => generateActionDesc(a, props.buildings, buildings_list)
    );

    technologies = props.planet.technologies_upgrade.map(
      a => generateActionDesc(a, props.technologies, technologies_list)
    );

    const ships = props.planet.ships_construction.map(
      a => generateActionDesc(a, props.ships, ships_list)
    );
    const defenses = props.planet.defenses_construction.map(
      a => generateActionDesc(a, props.defenses, defenses_list)
    );
    shipsAndDefenses = ships.concat(defenses);
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
