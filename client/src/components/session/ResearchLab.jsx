
import '../../styles/session/ResearchLab.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';
import ElementUpgrade from './ElementUpgrade.jsx';

import Server from '../game/server.js';

import TechnologiesModule from '../game/technologies.js';
import { TECHNOLOGIES_FETCH_SUCCEEDED } from '../game/technologies.js';

import {resources_list} from '../../datas/resources.js';
import {technologies_list} from '../../datas/technologies.js';
import { FUNDAMENTAL_TECHNOLOGY, PROPULSION_TECHNOLOGY, ADVANCED_TECHNOLOGY, COMBAT_TECHNOLOGY } from '../../datas/technologies.js';

function fetchTechnologyLevel(technologies, name) {
  const tech = technologies.find(t => t.name === name);

  if (tech) {
    return tech.level;
  }

  // Assume no level is defined.
  return 0;
}

class ResearchLab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines the info about fundamental research
      // as available for this player.
      fundamental_techs: [],

      // Defines the info about propulsion technologies
      // that have been researched by the player.
      propulsion_techs: [],

      // Defines the info about advanced technologies
      // that are researched by the player.
      advanced_techs: [],

      // Defines the info about combat technologies that
      // are researched by the player.
      combat_techs: [],

      // Defines the selected element so far. This is
      // assigned when the user clicks on a child item.
      id: "",

      // Defines the kind of technology to which the `id`
      // is referring to.
      kind: "",
    };
  }

  componentDidMount() {
    // Fetch the list of buildings from the server.
    const server = new Server();
    const technologies = new TechnologiesModule(server);

    const game = this;

    // Fetch the technologies from the server.
    technologies.fetchTechnologies()
      .then(function (res) {
        if (res.status !== TECHNOLOGIES_FETCH_SUCCEEDED) {
          game.fetchDataFailed(res.status);
        }
        else {
          game.fetchTechnologiesSucceeded(res.technologies);
        }
      })
      .catch(err => game.fetchDataFailed(err));
  }

  fetchDataFailed(err) {
    alert(err);
  }

  fetchTechnologiesSucceeded(technologies) {
    // Update researches from data received from the server.
    const fundResearches = [];
    const propResearches = [];
    const advaResearches = [];
    const combResearches = [];

    for (let id = 0 ; id < technologies_list.length ; id++) {
      const t = technologies.find(t => t.name === technologies_list[id].name);

      if (t) {
        // Fetch the level of this technology on the planet.
        let lvl = fetchTechnologyLevel(this.props.player.technologies, t.name);

        // Compute the costs and register the resources.
        const costs = [];
        const iCosts = t.cost.init_costs;

        let buildable = true;

        for (let rID = 0 ; rID < resources_list.length ; rID++) {
          // We need to find the description of the resource
          // based on the name defined in the data store.
          const r = this.props.resources.find(res => res.name === resources_list[rID].name);

          if (!r) {
            console.error("Failed to register find description for \"" + resources_list[rID].name + "\"");
            continue;
          }

          // We can now determine whether this research uses
          // this resource based on the identifier.
          const rData = iCosts.find(res => res.resource === r.id);

          if (!rData) {
            continue;
          }

          // Compute the total amount based on the progression
          // rule defined for this building.
          const amount = Math.floor(rData.amount * Math.pow(t.cost.progression, lvl));

          // Find whether or not the planet holds enough resources
          // to build this level.
          let enough = false;

          const available = this.props.planet.resources.find(res => res.resource === r.id);
          if (!available) {
            console.error("Failed to find amount of resource \"" + resources_list[rID].name + "\" on planet");
          }
          else {
            enough = (available.amount >= amount);
          }

          if (!enough) {
            buildable = false;
          }

          // We can now register the resource.
          costs.push({
            icon: resources_list[rID].mini,
            name: resources_list[rID].name,
            amount: amount,
            enough: enough,
          });
        }

        const tech = {
          id: t.id,
          name: t.name,
          level: lvl,
          icon: technologies_list[id].icon,
          resources: costs,
          // Technologies don't produce energy.
          energy: 0,
          buildable: buildable,
          // Technologies can't be 'demolished'.
          demolishable: false,
        };

        switch (technologies_list[id].type) {
          case FUNDAMENTAL_TECHNOLOGY:
            fundResearches.push(tech);
            break;
          case PROPULSION_TECHNOLOGY:
            propResearches.push(tech);
            break;
          case ADVANCED_TECHNOLOGY:
            advaResearches.push(tech);
            break;
          case COMBAT_TECHNOLOGY:
            combResearches.push(tech);
            break;
          default:
            // Unknown research type.
            console.error("Unknown research type \"" + technologies_list[id].type + "\"");
            break;
        }
      }
      else {
        console.error("Failed to find technology \"" + technologies_list[id].name + "\" from server's data");
      }
    }

    this.setState({
      fundamental_techs: fundResearches,
      propulsion_techs: propResearches,
      advanced_techs: advaResearches,
      combat_techs: combResearches,
    });
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
            <ElementUpgrade title={technology.name}
                            level={technology.level}
                            icon={technology.icon}
                            duration={"6j 1h 26m"}
                            energy={technology.energy}

                            buildable={technology.buildable}
                            demolishable={technology.demolishable}

                            resources={technology.resources}
                            description={"This is a description"}

                            selectElement={(id) => this.selectElement(id)}
                            />
          }
        </div>
        <div className="research_lab_researches_layout">
          <div className="research_lab_section">
            <p className="cover_header">Basic research</p>
            <div className="research_lab_section_layout">
              {
                this.state.fundamental_techs.map(t =>
                  <ElementContainer key={t.id}
                                    id={t.id}
                                    icon={t.icon}
                                    alt={t.name}
                                    title={t.name}
                                    level={t.level}
                                    selectElement={(id) => this.selectElement(id)}
                                    />
                )
              }
            </div>
          </div>
          <div className="research_lab_section">
            <p className="cover_header">Propulsion research</p>
            <div className="research_lab_section_layout">
              {
                this.state.propulsion_techs.map(t =>
                  <ElementContainer key={t.id}
                                    id={t.id}
                                    icon={t.icon}
                                    alt={t.name}
                                    title={t.name}
                                    level={t.level}
                                    selectElement={(id) => this.selectElement(id)}
                                    />
                )
              }
            </div>
          </div>
          <div className="research_lab_section">
            <p className="cover_header">Advanced research</p>
            <div className="research_lab_section_layout">
              {
                this.state.advanced_techs.map(t =>
                  <ElementContainer key={t.id}
                                    id={t.id}
                                    icon={t.icon}
                                    alt={t.name}
                                    title={t.name}
                                    level={t.level}
                                    selectElement={(id) => this.selectElement(id)}
                                    />
                )
              }
            </div>
          </div>
          <div className="research_lab_section">
            <p className="cover_header">Combat research</p>
            <div className="research_lab_section_layout">
              {
                this.state.combat_techs.map(t =>
                  <ElementContainer key={t.id}
                                    id={t.id}
                                    icon={t.icon}
                                    alt={t.name}
                                    title={t.name}
                                    level={t.level}
                                    selectElement={(id) => this.selectElement(id)}
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
