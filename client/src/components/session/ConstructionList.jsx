
import '../../styles/session/ConstructionList.css';
import React from 'react';
import ConstructionAction from './ConstructionAction.jsx';

import {buildings_list} from '../../datas/buildings.js';
import {technologies_list} from '../../datas/technologies.js';
import {ships_list} from '../../datas/ships.js';
import {defenses_list} from '../../datas/defenses.js';

import { computeActionCompletionTime, millisecondsFromDuration } from '../game/actions.js';

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
    out.total = action.amount;
    out.completion_time = millisecondsFromDuration(action.completion_time);
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

    // For ships and defenses the process is a bit
    // more complex: indeed both systems are produced
    // by the shipyard and so we need to concatenate
    // both lists and order them.
    const systemsActions = props.planet.ships_construction.concat(props.planet.defenses_construction);
    const systems = props.ships.concat(props.defenses);
    const systemsDesc = ships_list.concat(defenses_list);

    systemsActions.sort(function (a1, a2) {
      const eta1 = Date.parse(a1.created_at);
      const eta2 = Date.parse(a2.created_at);

      return eta1 - eta2;
    });

    shipsAndDefenses = systemsActions.map(
      a => generateActionDesc(a, systems, systemsDesc)
    );
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
