
import '../../styles/session/TechnologyTree.css';
import React from 'react';
import TechnologyTreeItem from './TechnologyTreeItem.jsx';

import {buildings_list} from '../../datas/buildings.js';
import {technologies_list} from '../../datas/technologies.js';
import {ships_list} from '../../datas/ships.js';
import {defenses_list} from '../../datas/defenses.js';
import { GROUND_SYSTEM, MISSILE } from '../../datas/defenses.js';

import expand from '../../assets/expanded.png';
import collapse from '../../assets/collapsed.png';

// Defines the buildings section of the technology tree.
const SECTION_BUILDINGS = "overview";

// Defines the technologies section of the technology tree.
const SECTION_TECHNOLOGIES = "technologies";

// Defines the ships section of the technology tree.
const SECTION_SHIPS = "ships";

// Defines the defenses section of the technology tree.
const SECTION_DEFENSES = "defenses";

// Defines the missiles section of the technology tree.
const SECTION_MISSILES = "missiles";

function generateItemTechTree(item) {
  return <TechnologyTreeItem key={item.id} item={item} />;
}

function generateSectionTechTree(items) {
  return (
    <div className="tech_tree_items">
      {items.map(e => generateItemTechTree(e))}
    </div>
  );
}

function generateDependencies(items, buildings, technologies, buildingsData, technologiesData) {
  const out = [];

  for (let id = 0 ; id < items.length ; ++id) {
    const e = items[id];

    let eOut = {
      id: e.id,
      name: e.name,
      buildings_dependencies: [],
      technologies_dependencies: [],
    };

    // Search for the icon in every possible type of element.
    let iData = buildings_list.find(d => d.name === e.name);
    if (!iData) {
      iData = technologies_list.find(d => d.name === e.name);
    }
    if (!iData) {
      iData = ships_list.find(d => d.name === e.name);
    }
    if (!iData) {
      iData = defenses_list.find(d => d.name === e.name);
    }
    if (!iData) {
      console.error("Failed to get icon for item \"" + e.name + "\"");
      continue;
    }

    eOut.icon = iData.icon;

    for (let dID = 0 ; dID < e.buildings_dependencies.length ; ++dID) {
      const eDep = e.buildings_dependencies[dID];

      const eDesc = buildings.find(it => it.id === eDep.id);
      if (!eDesc) {
        console.error("Failed to resolve building dependency for \"" + e.name + "\" on \"" + eDep.id + "\"");
        continue;
      }

      const eData = buildingsData.find(it => it.id === eDep.id);
      let available = 0;
      if (eData) {
        available = eData.level;
      }

      eOut.buildings_dependencies.push({
        name: eDesc.name,
        level: eDep.level,
        available: available,
        unlocked: eDep.level <= available,
      });
    }

    for (let dID = 0 ; dID < e.technologies_dependencies.length ; ++dID) {
      const eDep = e.technologies_dependencies[dID];

      const eDesc = technologies.find(it => it.id === eDep.id);
      if (!eDesc) {
        console.error("Failed to resolve technology dependency for \"" + e.name + "\" on \"" + eDep.id + "\"");
        continue;
      }

      const eData = technologiesData.find(it => it.id === eDep.id);
      let available = 0;
      if (eData) {
        available = eData.level;
      }

      eOut.technologies_dependencies.push({
        name: eDesc.name,
        level: eDep.level,
        available: available,
        unlocked: eDep.level <= available,
      });
    }

    out.push(eOut);
  }

  return out;
}

class TechnologyTree extends React.Component {
  constructor(props) {
    super(props);

    let buildings_deps = [];
    let technologies_deps = [];
    let ships_deps = [];
    let defenses_deps = [];
    let missiles_deps = [];

    if (props.buildings.length > 0 && props.technologies.length > 0 && props.planet.buildings.length > 0 && props.player.technologies.length > 0) {
      buildings_deps = generateDependencies(props.buildings, props.buildings, props.technologies, props.planet.buildings, props.player.technologies);
      technologies_deps = generateDependencies(props.technologies, props.buildings, props.technologies, props.planet.buildings, props.player.technologies);
      ships_deps = generateDependencies(props.ships, props.buildings, props.technologies, props.planet.buildings, props.player.technologies);

      const groundSystems = props.defenses.filter(function(e) {
        const bData = defenses_list.find(it => it.name === e.name);
        if (!bData) {
          return true;
        }

        return bData.kind === GROUND_SYSTEM;
      });

      defenses_deps = generateDependencies(
        groundSystems,
        props.buildings,
        props.technologies,
        props.planet.buildings,
        props.player.technologies
      );

      const missileSystems = props.defenses.filter(function(e) {
        const bData = defenses_list.find(it => it.name === e.name);
        if (!bData) {
          return true;
        }

        return bData.kind === MISSILE;
      });

      missiles_deps = generateDependencies(
        missileSystems,
        props.buildings,
        props.technologies,
        props.planet.buildings,
        props.player.technologies
      );
    }

    this.state = {
      // Whether or not the buildings section is collapsed.
      buildings_visible: false,

      // Whether or not the technologies section is collapsed.
      technologies_visible: false,

      // Whether or not the ships section is collapsed.
      ships_visible: false,

      // Whether or not the defenses section is collapsed.
      defenses_visible: false,

      // Whether or not the missiles section is collapsed.
      missiles_visible: false,

      // The processed list of buildings, containing the names
      // of the dependencies.
      buildings: buildings_deps,

      // The processed list of technologies, containing the names
      // of the dependencies.
      technologies: technologies_deps,

      // The processed list of ships, containing the names
      // of the dependencies.
      ships: ships_deps,

      // The processed list of defenses, containing the names
      // of the dependencies.
      defenses: defenses_deps,

      // The processed list of missiles, containing the names
      // of the dependencies.
      missiles: missiles_deps,
    };
  }

  toggleSection(section) {
    // Update section collapsed status.
    switch (section) {
      case SECTION_BUILDINGS:
        this.setState({
          buildings_visible: !this.state.buildings_visible,
        });
        break
      case SECTION_TECHNOLOGIES:
        this.setState({
          technologies_visible: !this.state.technologies_visible,
        });
        break;
      case SECTION_SHIPS:
        this.setState({
          ships_visible: !this.state.ships_visible,
        });
        break;
      case SECTION_DEFENSES:
        this.setState({
          defenses_visible: !this.state.defenses_visible,
        });
        break;
      case SECTION_MISSILES:
        this.setState({
          missiles_visible: !this.state.missiles_visible,
        });
        break;
      default:
        console.error("Failed to interpret expand/collapse of section \"" + section + "\"");
        break;
    }
  }

  render() {
    const ipBuildingsStatus = (this.state.buildings_visible ? "collapse" : "expand");
    const cnBuildingsIcon = (this.state.buildings_visible ? expand : collapse);

    const ipTechnologiesStatus = (this.state.technologies_visible ? "collapse" : "expand");
    const cnTechnologiesIcon = (this.state.technologies_visible ? expand : collapse);

    const ipShipsStatus = (this.state.ships_visible ? "collapse" : "expand");
    const cnShipsIcon = (this.state.ships_visible ? expand : collapse);

    const ipDefensesStatus = (this.state.defenses_visible ? "collapse" : "expand");
    const cnDefensesIcon = (this.state.defenses_visible ? expand : collapse);

    const ipMissilesStatus = (this.state.missiles_visible ? "collapse" : "expand");
    const cnMissilesIcon = (this.state.missiles_visible ? expand : collapse);

    return (
      <div className="tech_tree_layout">
        <div className="tech_tree_section">
          <img className="tech_tree_icon" src={cnBuildingsIcon} alt={ipBuildingsStatus} title={ipBuildingsStatus} onClick={() => this.toggleSection(SECTION_BUILDINGS)}></img>
          <span className="tech_tree_title">Buildings</span>
        </div>
        {
          this.state.buildings_visible && generateSectionTechTree(this.state.buildings)
        }
        <div className="tech_tree_section">
          <img className="tech_tree_icon" src={cnTechnologiesIcon} alt={ipTechnologiesStatus} title={ipTechnologiesStatus} onClick={() => this.toggleSection(SECTION_TECHNOLOGIES)}></img>
          <span className="tech_tree_title">Technologies</span>
        </div>
        {
          this.state.technologies_visible && generateSectionTechTree(this.state.technologies)
        }
        <div className="tech_tree_section">
          <img className="tech_tree_icon" src={cnShipsIcon} alt={ipShipsStatus} title={ipShipsStatus} onClick={() => this.toggleSection(SECTION_SHIPS)}></img>
          <span className="tech_tree_title">Ships</span>
        </div>
        {
          this.state.ships_visible && generateSectionTechTree(this.state.ships)
        }
        <div className="tech_tree_section">
          <img className="tech_tree_icon" src={cnDefensesIcon} alt={ipDefensesStatus} title={ipDefensesStatus} onClick={() => this.toggleSection(SECTION_DEFENSES)}></img>
          <span className="tech_tree_title">Defenses</span>
        </div>
        {
          this.state.defenses_visible && generateSectionTechTree(this.state.defenses)
        }
        <div className="tech_tree_section">
          <img className="tech_tree_icon" src={cnMissilesIcon} alt={ipMissilesStatus} title={ipMissilesStatus} onClick={() => this.toggleSection(SECTION_MISSILES)}></img>
          <span className="tech_tree_title">Missiles</span>
        </div>
        {
          this.state.missiles_visible && generateSectionTechTree(this.state.missiles)
        }
      </div>
    );
  }
}

export default TechnologyTree;
