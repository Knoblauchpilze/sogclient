
import '../../styles/session/ConstructionList.css';
import React from 'react';
import ConstructionAction from './ConstructionAction.jsx';

function ConstructionList (props) {
  const buildings = props.planet.buildings_upgrade;
  const technologies = props.planet.buildings_upgrade;
  const shipsAndDefenses = props.planet.ships_construction.concat(props.planet.defenses_construction);

  console.log("p: " + JSON.stringify(props.planet));
  return (
    <div className="construction_list_layout">
      <ConstructionAction title={"Building"} actions={buildings}/>
      <ConstructionAction title={"Research lab"} actions={technologies}/>
      <ConstructionAction title={"Shipyard"} actions={shipsAndDefenses}/>
    </div>
  );
}

export default ConstructionList;
