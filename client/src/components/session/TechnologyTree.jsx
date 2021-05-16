
import '../../styles/session/TechnologyTree.css';
import React from 'react';
import TechnologyTreeItem from './TechnologyTreeItem.jsx';

import expand from '../../assets/expanded.png';
import collapse from '../../assets/collapsed.png';

import {buildings_list} from '../../datas/buildings.js';
import {technologies_list} from '../../datas/technologies.js';
import {ships_list} from '../../datas/ships.js';
import {defenses_list} from '../../datas/defenses.js';

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
  return <TechnologyTreeItem name={item.name} />;
}

function generateSectionTechTree(items) {
  return (
    <div className="tech_tree_items">
      {items.map(e => <div>{generateItemTechTree(e)}</div>)}
    </div>
  );
}

class TechnologyTree extends React.Component {
  constructor(props) {
    super(props);

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
          this.state.buildings_visible && generateSectionTechTree(buildings_list)
        }
        <div className="tech_tree_section">
          <img className="tech_tree_icon" src={cnTechnologiesIcon} alt={ipTechnologiesStatus} title={ipTechnologiesStatus} onClick={() => this.toggleSection(SECTION_TECHNOLOGIES)}></img>
          <span className="tech_tree_title">Technologies</span>
        </div>
        {
          this.state.technologies_visible && generateSectionTechTree(technologies_list)
        }
        <div className="tech_tree_section">
          <img className="tech_tree_icon" src={cnShipsIcon} alt={ipShipsStatus} title={ipShipsStatus} onClick={() => this.toggleSection(SECTION_SHIPS)}></img>
          <span className="tech_tree_title">Ships</span>
        </div>
        {
          this.state.ships_visible && generateSectionTechTree(ships_list)
        }
        <div className="tech_tree_section">
          <img className="tech_tree_icon" src={cnDefensesIcon} alt={ipDefensesStatus} title={ipDefensesStatus} onClick={() => this.toggleSection(SECTION_DEFENSES)}></img>
          <span className="tech_tree_title">Defenses</span>
        </div>
        {
          this.state.defenses_visible && generateSectionTechTree(defenses_list)
        }
        <div className="tech_tree_section">
          <img className="tech_tree_icon" src={cnMissilesIcon} alt={ipMissilesStatus} title={ipMissilesStatus} onClick={() => this.toggleSection(SECTION_MISSILES)}></img>
          <span className="tech_tree_title">Missiles</span>
        </div>
      </div>
    );
  }
}

export default TechnologyTree;
