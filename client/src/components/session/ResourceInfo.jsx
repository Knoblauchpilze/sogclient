
import '../../styles/session/ResourceInfo.css';
import React from 'react';

function formatAmount(amount) {
  let out = "";

  if (amount > 0) {
    out += "+";
  }
  out += Math.floor(amount);

  return out;
}

function ResourceInfo (props) {
  let classAmount = "resource_info_amount"
  if (props.data.amount > props.data.storage && props.data.storable) {
    classAmount += " resource_info_warning";
  }
  let classProduction = "resource_info_production";
  if (props.data.production < 0) {
    classProduction += " resource_info_warning";
  }

  return (
    <div className="resource_info_layout">
      <img src={props.data.icon} alt={props.data.title} title={props.data.title} />
      <span className={classAmount}>{props.data.amount}</span>
      <span className={classProduction}>{"(" + formatAmount(props.data.production) + ")"}</span>
    </div>
  );
}

export default ResourceInfo;
