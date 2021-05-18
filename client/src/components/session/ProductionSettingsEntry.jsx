
import '../../styles/session/ProductionSettingsEntry.css';
import React from 'react';

import { formatAmount } from '../game/amounts.js';

function generateResourceEntry(r) {
  let classes = "prod_settings_entry_resource";
  if (r.production > 0) {
    classes += " prod_settings_entry_gain";
  }
  else if (r.production < 0) {
    classes += " prod_settings_entry_loss";
  }

  return (
    <span key={r.id} className={classes}>
      {formatAmount(r.production, false)}
    </span>
  );
}

function ProductionSettingsEntry (props) {
  let classes = "prod_settings_entry_layout";
  if (props.odd) {
    classes += " prod_settings_entry_odd";
  }
  else {
    classes += " prod_settings_entry_even";
  }

  return (
    <div className={classes}>
      <div className="prod_settings_entry_name">{props.entry.name}</div>
      {
        props.entry.production.map(r => generateResourceEntry(r))
      }
      {
        props.adjustable &&
        <form method="post">
          <select className="prod_settings_entry_factor" value={props.factor} onChange={(e) => props.updateFactor(props.entry.id, e.target.value)}>
            <option value="1">100%</option>
            <option value="0.9">90%</option>
            <option value="0.8">80%</option>
            <option value="0.7">70%</option>
            <option value="0.6">60%</option>
            <option value="0.5">50%</option>
            <option value="0.4">40%</option>
            <option value="0.3">30%</option>
            <option value="0.2">20%</option>
            <option value="0.1">10%</option>
            <option value="0">0%</option>
          </select>
        </form>
      }
    </div>
  );
}

export default ProductionSettingsEntry;
