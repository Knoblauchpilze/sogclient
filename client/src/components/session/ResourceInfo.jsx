
import '../../styles/session/ResourceInfo.css';
import React from 'react';

import { shortenAmount, formatAmount } from '../game/amounts.js';

function ResourceInfo (props) {
  let classAmount = "resource_info_amount"
  // Add a warning in case the amount is greater than the storage
  // (and in case the resource can be stored) or in any case if
  // the amount is negative.
  if ((props.data.amount > props.data.storage && props.data.storable) ||
      props.data.amount < 0)
  {
    classAmount += " resource_info_warning";
  }
  let classProduction = "resource_info_production";
  if (props.data.production < 0) {
    classProduction += " resource_info_warning";
  }

  return (
    <div className="resource_info_layout">
      <img src={props.data.icon} alt={props.data.title} title={props.data.title} />
      <span className={classAmount}>{formatAmount(props.data.amount)}</span>
      <span className={classProduction}>{"(" + formatAmount(props.data.production, true) + ")"}</span>
      {
        props.data.storable &&
        <span className={classProduction}>{"(" + shortenAmount(props.data.storage) + ")"}</span>
      }
    </div>
  );
}

export default ResourceInfo;
