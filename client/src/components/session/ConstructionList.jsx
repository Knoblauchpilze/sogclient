
import '../../styles/ConstructionList.css';
import React from 'react';
import ConstructionAction from './ConstructionAction.jsx';

function ConstructionList (props) {
  return (
    <div className="construction_list_layout">
      <table id="overview_planet_construction_list">
        <tbody>
          <tr>
            <td class="construction_action_container">
              <ConstructionAction title={"Building"} action={""}/>
            </td>
            <td class="construction_action_container">
              <ConstructionAction title={"Research lab"} action={""}/>
            </td>
            <td class="construction_action_container">
              <ConstructionAction title={"Shipyard"} action={""}/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ConstructionList;
