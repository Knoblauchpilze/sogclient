
import '../../styles/session/ElementUpgrade.css';
import React from 'react';

// The threshold above which resources are grouped
// by a dot. This helps readability.
const dotSeparatorThreshold = 1000;

// The threshold above which resources do not use
// the full display anymore.
const shortNotationThreshold = 1000000;

function toFixedDigits(val, digits) {
  // Error case somehow.
  if (digits < 2) {
    return val;
  }

  let dCount = 1;
  if (val > 0) {
    dCount = Math.ceil(Math.log10(val));
  }

  let out = "";
  for (let i = 0 ; i < digits - dCount ; i++) {
    out += "0";
  }

  out += val;

  return out;
}

function formatAmount(amount) {
  if (amount < dotSeparatorThreshold) {
    return "" + amount;
  }

  if (amount < shortNotationThreshold) {
    // Insert dot separator in the amount to make
    // it more readable.
    const lead = Math.floor(amount / dotSeparatorThreshold);
    const trailing = (amount - lead * dotSeparatorThreshold) / dotSeparatorThreshold;

    return lead + "." + toFixedDigits(trailing, 3);
  }

  const lead = Math.floor(amount / shortNotationThreshold);
  const trailing = (amount - lead * shortNotationThreshold)/ shortNotationThreshold;

  if (trailing === 0) {
    return "" + lead + "M";
  }

  return lead + "," + toFixedDigits(trailing, 3) + "M";
}

function generateResourceContainer(icon, alt, amount, allowed) {
  const color = allowed ? "element_upgrade_resource_amount" : "element_upgrade_resource_amount_invalid";
  return (
    <div key={alt} className="element_upgrade_resource">
      <img className="element_upgrade_resource_icon" src={icon} alt={alt} title={alt} />
      <span className={color}>{formatAmount(amount)}</span>
    </div>
  );
}

function ElementUpgrade (props) {
  let ub = "element_upgrade_button";
  let db = "element_upgrade_button";

  if (props.buildable) {
    ub += " element_upgrade_build";
  }
  else {
    ub += " element_upgrade_inactive";
  }
  if (props.demolishable) {
    db += " element_upgrade_demolish";
  }
  else {
    db += " element_upgrade_inactive";
  }


  return (
    <div className="cover_upgrade_layout">
      <div className="element_upgrade_general_layout">
        <div className="element_upgrade_item_layout">
          <img className="element_upgrade_icon" src={props.icon} alt={props.title} title={props.title} />
          <div className="element_upgrade_props_layout">
            <div className="element_upgrade_header">
              <div className="element_upgrade_desc">
                <span className="element_upgrade_title">{props.title}</span>
                <span className="element_upgrade_level">{"Level: " + props.level}</span>
              </div>
              <button className="element_upgrade_close" onClick={() => props.selectElement("")}><span>X</span></button>
            </div>
            <div className="element_upgrade_prop">
              <span className="element_upgrade_prop_key">Construction time:</span>
              <span className="element_upgrade_prop_value">{props.duration}</span>
            </div>
            <div className="element_upgrade_prop">
              <span className="element_upgrade_prop_key">Energy required:</span>
              <span className="element_upgrade_prop_value">{props.energy}</span>
            </div>
            <span className="element_upgrade_prop_key">{"Required for level " + (props.level + 1) + ":"}</span>
            <div className="element_upgrade_resources">
              {props.resources.map(r => generateResourceContainer(r.icon, r.name, r.amount, r.enough))}
            </div>
            <div className="element_upgrade_buttons">
              <button className={ub}>Build</button>
              <button className={db}>Demolish</button>
            </div>
          </div>
        </div>
        <div className="element_upgrade_description">
          {props.description}
        </div>
      </div>
    </div>
  );
}

export default ElementUpgrade;
