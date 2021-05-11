
import '../../styles/session/ResearchLab.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';
import ElementUpgrade from './ElementUpgrade.jsx';

import Planet from '../game/planet.js';
import { UPGRADE_ACTION_POST_SUCCEEDED } from '../game/planet.js';

import {technologies_list} from '../../datas/technologies.js';
import { FUNDAMENTAL_TECHNOLOGY, PROPULSION_TECHNOLOGY, ADVANCED_TECHNOLOGY, COMBAT_TECHNOLOGY } from '../../datas/technologies.js';

class ResearchLab extends React.Component {
  constructor(props) {
    super(props);

    // Generate properties from the buildings and
    // the technologies defined in the server.
    const fundResearches = [];
    const propResearches = [];
    const advaResearches = [];
    const combResearches = [];

    const p = new Planet(
      props.planet,
      props.player.technologies,
      props.planets,
      props.universe,
      props.resources,
      props.buildings,
      props.technologies,
    );

    for (let id = 0 ; id < technologies_list.length ; id++) {
      // Fetch the data for this technology.
      const out = p.getTechnologyData(technologies_list[id].name);

      if (!out.found) {
        console.error("Failed to find technology \"" + technologies_list[id].name + "\" from server's data");
      }
      else {
        switch (technologies_list[id].type) {
          case FUNDAMENTAL_TECHNOLOGY:
            fundResearches.push(out.technology);
            break;
          case PROPULSION_TECHNOLOGY:
            propResearches.push(out.technology);
            break;
          case ADVANCED_TECHNOLOGY:
            advaResearches.push(out.technology);
            break;
          case COMBAT_TECHNOLOGY:
            combResearches.push(out.technology);
            break;
          default:
            // Unknown research type.
            console.error("Unknown research type \"" + technologies_list[id].type + "\"");
            break;
        }
      }
    }

    this.state = {
      // Defines the info about fundamental research
      // as available for this player.
      fundamental_techs: fundResearches,

      // Defines the info about propulsion technologies
      // that have been researched by the player.
      propulsion_techs: propResearches,

      // Defines the info about advanced technologies
      // that are researched by the player.
      advanced_techs: advaResearches,

      // Defines the info about combat technologies that
      // are researched by the player.
      combat_techs: combResearches,

      // Defines the selected element so far. This is
      // assigned when the user clicks on a child item.
      id: "",

      // Defines the kind of technology to which the `id`
      // is referring to.
      kind: "",
    };
  }

  selectElement(technology) {
    // Update selected technology: we need to find the index
    // of the research corresponding to the input element
    // if possible.
    if (technology === "") {
      this.setState({
        id: -1,
        kind: "",
      });
    }

    // Search technologies in order.
    let id = this.state.fundamental_techs.findIndex(t => t.id === technology);
    let kind = FUNDAMENTAL_TECHNOLOGY;

    if (id === -1) {
      id = this.state.propulsion_techs.findIndex(t => t.id === technology);
      kind = PROPULSION_TECHNOLOGY;
    }
    if (id === -1) {
      id = this.state.advanced_techs.findIndex(t => t.id === technology);
      kind = ADVANCED_TECHNOLOGY;
    }
    if (id === -1) {
      id = this.state.combat_techs.findIndex(t => t.id === technology);
      kind = COMBAT_TECHNOLOGY;
    }

    if (id === -1) {
      console.error("Failed to select technology \"" + technology + "\"");
    }

    // In case the technology is the same as the one
    // already selected we will deactivate the upgrade
    // panel.
    if (this.state.id === id && this.state.kind === kind) {
      this.setState({
        id: -1,
        kind: "",
      });

      return;
    }

    this.setState({
      id: id,
      kind: kind,
    });
  }

  uprgadeActionFailed(err) {
    alert(err);
  }

  uprgadeActionSucceeded(action) {
    console.info("Registered action " + action);

    // Request a data reload.
    this.props.actionPerformed();
  }

  buildElement(technology) {
    // Create an object to handle the creation of an action
    // to upgrade the input element.
    const p = new Planet(
      this.props.planet,
      this.props.player.technologies,
      this.props.planets,
      this.props.universe,
      this.props.resources,
      this.props.buildings,
      this.props.technologies,
    );

    const tab = this;

    p.upgradeTechnology(technology)
      .then(function (res) {
        if (res.status !== UPGRADE_ACTION_POST_SUCCEEDED) {
          tab.uprgadeActionFailed(res.status);
        }
        else {
          tab.uprgadeActionSucceeded(res.action);
        }
      })
      .catch(err => tab.uprgadeActionFailed(err));
  }

  render() {
    let title = "Research - Unknown planet";

    if (this.props.planet) {
      title = "Research - " + this.props.planet.name;
    }

    let technology;
    if (this.state.id !== -1) {
      switch (this.state.kind) {
        case FUNDAMENTAL_TECHNOLOGY:
          technology = this.state.fundamental_techs[this.state.id];
          break;
        case PROPULSION_TECHNOLOGY:
          technology = this.state.propulsion_techs[this.state.id];
          break;
        case ADVANCED_TECHNOLOGY:
          technology = this.state.advanced_techs[this.state.id];
          break;
        case COMBAT_TECHNOLOGY:
          technology = this.state.combat_techs[this.state.id];
          break;
        default:
            // Unhandled.
            break;
      }
    }

    return (
      <div className="research_lab_layout">
        <div className="cover_layout">
          <h3 className="cover_title">{title}</h3>
          {
            technology &&
            <ElementUpgrade item={technology}
                            selectElement={(id) => this.selectElement(id)}
                            buildElement={(id) => this.buildElement(id)}
                            />
          }
        </div>
        <div className="research_lab_researches_layout">
          <div className="research_lab_section">
            <p className="cover_header">Basic research</p>
            <div className="research_lab_section_layout">
              {
                this.state.fundamental_techs.map((t, id) =>
                  <ElementContainer key={t.id}
                                    id={t.id}
                                    icon={t.icon}
                                    alt={t.name}
                                    title={t.name}
                                    level={t.level}
                                    selectElement={(id) => this.selectElement(id)}
                                    selected={id === this.state.id && this.state.kind === FUNDAMENTAL_TECHNOLOGY}
                                    />
                )
              }
            </div>
          </div>
          <div className="research_lab_section">
            <p className="cover_header">Propulsion research</p>
            <div className="research_lab_section_layout">
              {
                this.state.propulsion_techs.map((t, id) =>
                  <ElementContainer key={t.id}
                                    id={t.id}
                                    icon={t.icon}
                                    alt={t.name}
                                    title={t.name}
                                    level={t.level}
                                    selectElement={(id) => this.selectElement(id)}
                                    selected={id === this.state.id && this.state.kind === PROPULSION_TECHNOLOGY}
                                    />
                )
              }
            </div>
          </div>
          <div className="research_lab_section">
            <p className="cover_header">Advanced research</p>
            <div className="research_lab_section_layout">
              {
                this.state.advanced_techs.map((t, id) =>
                  <ElementContainer key={t.id}
                                    id={t.id}
                                    icon={t.icon}
                                    alt={t.name}
                                    title={t.name}
                                    level={t.level}
                                    selectElement={(id) => this.selectElement(id)}
                                    selected={id === this.state.id && this.state.kind === ADVANCED_TECHNOLOGY}
                                    />
                )
              }
            </div>
          </div>
          <div className="research_lab_section">
            <p className="cover_header">Combat research</p>
            <div className="research_lab_section_layout">
              {
                this.state.combat_techs.map((t, id) =>
                  <ElementContainer key={t.id}
                                    id={t.id}
                                    icon={t.icon}
                                    alt={t.name}
                                    title={t.name}
                                    level={t.level}
                                    selectElement={(id) => this.selectElement(id)}
                                    selected={id === this.state.id && this.state.kind === COMBAT_TECHNOLOGY}
                                    />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResearchLab;
