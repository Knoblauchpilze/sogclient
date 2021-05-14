
import '../../styles/session/ElementUpgrade.css';
import React from 'react';

import { shortenAmount } from '../game/amounts.js';

function generateResourceContainer(icon, alt, amount, allowed) {
  const color = allowed ? "element_upgrade_resource_amount" : "element_upgrade_resource_amount_invalid";
  return (
    <div key={alt} className="element_upgrade_resource">
      <img className="element_upgrade_resource_icon" src={icon} alt={alt} title={alt} />
      <span className={color}>{shortenAmount(amount)}</span>
    </div>
  );
}

class ElementUpgrade extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines the amount of items selected to be built when the
      // build button is pressed.
      bulk: 0,
    };

    this.requestBulkBuild = this.requestBulkBuild.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    // Prevent anything from being sent.
    event.preventDefault();
  }

  requestBulkBuild(event) {
    // Make sure that the value is within valid bounds.
    this.setState({
      bulk: Math.max(Math.min(event.target.value, this.props.item.max), 0),
    });
  }

  render() {
    let ub = "element_upgrade_button";
    let db = "element_upgrade_button";

    const preRequisites = this.props.item.buildable.buildings && this.props.item.buildable.technologies;
    if (this.props.item.buildable.resources && preRequisites) {
      ub += " element_upgrade_build";
    }
    else {
      ub += " element_upgrade_inactive";
    }
    if (this.props.item.demolishable && preRequisites) {
      db += " element_upgrade_demolish";
    }
    else {
      db += " element_upgrade_inactive";
    }

    // Generate expressions to handle clicks on buttons.
    const be = (id) => {
      const validBulk = !this.props.item.bulk_buildable || this.state.bulk > 0;
      if (this.props.item.buildable && preRequisites && validBulk) {
        this.props.buildElement(id, this.state.bulk);
      }
    }

    const de = (id) => {
      if (this.props.item.demolishable && preRequisites) {
        this.props.demolishElement(id);
      }
    }

    return (
      <div className="cover_upgrade_layout">
        <div className="element_upgrade_general_layout">
          <div className="element_upgrade_item_layout">
            <img className="element_upgrade_icon" src={this.props.item.icon} alt={this.props.item.name} title={this.props.item.name} />
            <div className="element_upgrade_props_layout">
              <div className="element_upgrade_header">
                <div className="element_upgrade_desc">
                  <span className="element_upgrade_title">{this.props.item.name}</span>
                  <span className="element_upgrade_level">{"Level: " + this.props.item.level}</span>
                </div>
                <button className="element_upgrade_close" onClick={() => this.props.selectElement("")}><span>X</span></button>
              </div>
              <div className="element_upgrade_prop">
                <span className="element_upgrade_prop_key">Construction time:</span>
                <span className="element_upgrade_prop_value">{this.props.item.duration}</span>
              </div>
              {
                this.props.item.next_energy !== 0 &&
                <div className="element_upgrade_prop">
                  <span className="element_upgrade_prop_key">{this.props.item.next_energy < 0 ? "Energy required:" : "Production:"}</span>
                  <span className="element_upgrade_prop_value">{shortenAmount(Math.abs(this.props.item.next_energy))}</span>
                </div>
              }
              {
                !this.props.item.bulk_buildable &&
                <span className="element_upgrade_prop_key">{"Required for level " + (this.props.item.level + 1) + ":"}</span>
              }
              {
                this.props.item.bulk_buildable &&
                <form className="element_upgrade_bulk_form" onSubmit={this.handleSubmit} >
                  <input className="element_upgrade_bulk_input"
                        method="post"
                        type="number"
                        name="bulk_count"
                        id="bulk_count"
                        value={this.state.bulk}
                        onChange={this.requestBulkBuild}
                        />
                </form>
              }
              <div className="element_upgrade_resources">
                {this.props.item.resources.map(r => generateResourceContainer(r.icon, r.name, r.amount, r.enough))}
              </div>
              <div className="element_upgrade_buttons">
                <button className={ub} onClick={() => be(this.props.item.id)}>Build</button>
                <button className={db} onClick={() => de(this.props.item.id)}>Demolish</button>
              </div>
            </div>
          </div>
          <div className="element_upgrade_description">
            {this.props.description}
          </div>
        </div>
      </div>
    );
  }
}

export default ElementUpgrade;
