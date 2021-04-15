
import '../../styles/ConstructionList.css';
import React from 'react';
import ConstructionAction from './ConstructionAction.jsx';

function ConstructionList (props) {
  return (
    <div className="construction_list_layout">
      <ConstructionAction title={"Building"} action={""}/>
      <ConstructionAction title={"Research lab"} action={""}/>
      <ConstructionAction title={"Shipyard"} action={""}/>
    </div>
  );
}

export default ConstructionList;
