
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
    const trailing = amount - lead * dotSeparatorThreshold;

    return lead + "." + toFixedDigits(trailing, 3);
  }

  const lead = Math.floor(amount / shortNotationThreshold);
  const trailing = Math.floor((amount - lead * shortNotationThreshold) / dotSeparatorThreshold);

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

  const preRequisites = props.item.buildable.buildings && props.item.buildable.technologies;
  if (props.item.buildable.resources && preRequisites) {
    ub += " element_upgrade_build";
  }
  else {
    ub += " element_upgrade_inactive";
  }
  if (props.item.demolishable && preRequisites) {
    db += " element_upgrade_demolish";
  }
  else {
    db += " element_upgrade_inactive";
  }

  // Generate expressions to handle clicks on buttons.
  const be = (id) => {
    if (props.item.buildable && preRequisites) {
      props.buildElement(id);
    }
  }

  const de = (id) => {
    if (props.item.demolishable && preRequisites) {
      props.demolishElement(id);
    }
  }

  return (
    <div className="cover_upgrade_layout">
      <div className="element_upgrade_general_layout">
        <div className="element_upgrade_item_layout">
          <img className="element_upgrade_icon" src={props.item.icon} alt={props.item.name} title={props.item.name} />
          <div className="element_upgrade_props_layout">
            <div className="element_upgrade_header">
              <div className="element_upgrade_desc">
                <span className="element_upgrade_title">{props.item.name}</span>
                <span className="element_upgrade_level">{"Level: " + props.item.level}</span>
              </div>
              <button className="element_upgrade_close" onClick={() => props.selectElement("")}><span>X</span></button>
            </div>
            <div className="element_upgrade_prop">
              <span className="element_upgrade_prop_key">Construction time:</span>
              <span className="element_upgrade_prop_value">{props.item.duration}</span>
            </div>
            {
              props.item.next_energy !== 0 &&
              <div className="element_upgrade_prop">
                <span className="element_upgrade_prop_key">{props.item.next_energy < 0 ? "Energy required:" : "Production:"}</span>
                <span className="element_upgrade_prop_value">{formatAmount(Math.abs(props.item.next_energy))}</span>
              </div>
            }
            {
              !props.item.bulk_buildable &&
              <span className="element_upgrade_prop_key">{"Required for level " + (props.item.level + 1) + ":"}</span>
            }
            {
              props.item.bulk_buildable &&
              <form className="fleet_ship_count_form">
                <input className="fleet_ship_selector"
                      method="post"
                      type="number"
                      name="ship_count"
                      id="ship_count"
                      value={props.min}
                      min={props.min}
                      max={props.max}/>
              </form>
            }
            <div className="element_upgrade_resources">
              {props.item.resources.map(r => generateResourceContainer(r.icon, r.name, r.amount, r.enough))}
            </div>
            <div className="element_upgrade_buttons">
              <button className={ub} onClick={() => be(props.item.id)}>Build</button>
              <button className={db} onClick={() => de(props.item.id)}>Demolish</button>
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
