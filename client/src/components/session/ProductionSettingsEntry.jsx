
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
            <option value="100%">100%</option>
            <option value="90%">90%</option>
            <option value="80%">80%</option>
            <option value="70%">70%</option>
            <option value="60%">60%</option>
            <option value="50%">50%</option>
            <option value="40%">40%</option>
            <option value="30%">30%</option>
            <option value="20%">20%</option>
            <option value="10%">10%</option>
            <option value="0%">0%</option>
          </select>
        </form>
      }
    </div>
  );
}

export default ProductionSettingsEntry;
