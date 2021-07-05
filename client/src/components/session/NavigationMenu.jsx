
import '../../styles/session/NavigationMenu.css';
import React from 'react';
import NavigationMenuItem from './NavigationMenuItem.jsx';

import prod_control from '../../assets/production_control.png';
import tech_tree from '../../assets/tech_tree.png';
import fleets_movements from '../../assets/fleet_movements.png';

// Defines the overview menu, displaying general info
// on the planet.
const TAB_OVERVIEW = "overview";

// Defines the resources menu, displaying information
// on the resources production of the selected planet.
const TAB_RESOURCES = "resources";

// Defines the production settings view, displaying and
// allowing to control production factor on a planet.
const TAB_PRODUCTION_SETTINGS = "production";

// Defines the facilities menu, displaying information
// on the support buildings available on this planet.
const TAB_FACILITIES = "facilities";

// Defines the research lab menu, displaying information
// on the research already done by the player's empire.
const TAB_RESEARCH_LAB = "research_lab";

// Defines the technology tree view, displaying information
// on the research needed to unlock additional buildings and
// technologies.
const TAB_TECH_TREE = "tech_tree";

// Defines the shipyard menu, displaying information on
// ships that can be produced on the planet.
const TAB_SHIPYARD = "shipyard";

// Defines the defebses menu, displaying information on
// the defense systems already installed on the planet.
const TAB_DEFENSES = "defenses";

// Defins the fleets menu, displaying information on the
// fleets started and arriving to this planet.
const TAB_FLEETS = "fleets";

// Defines the galaxy menu, displaying information about
// other worlds and empires in the universe.
const TAB_GALAXY = "galaxy";

// Defines the ranking menu, displaying the players of the
// universe and their score.
const TAB_RANKINGS = "rankings";

function NavigationMenu (props) {
  return (
    <div className="navigation_menu_layout">
      <NavigationMenuItem name={"General view"}
                          onClick={() => props.updateGameTab(TAB_OVERVIEW)}
                          />
      <NavigationMenuItem name={"Resources"}
                          data_link={() => props.updateGameTab(TAB_PRODUCTION_SETTINGS)}
                          icon={prod_control}
                          icon_alt={"Prod control"}
                          onClick={() => props.updateGameTab(TAB_RESOURCES)}
                          />
      <NavigationMenuItem name={"Facilities"}
                          onClick={() => props.updateGameTab(TAB_FACILITIES)}
                          />
      <NavigationMenuItem name={"Research lab"}
                          data_link={() => props.updateGameTab(TAB_TECH_TREE)}
                          icon={tech_tree}
                          icon_alt={"Technology tree"}
                          onClick={() => props.updateGameTab(TAB_RESEARCH_LAB)}
                          />
      <NavigationMenuItem name={"Shipyard"}
                          onClick={() => props.updateGameTab(TAB_SHIPYARD)}
                          />
      <NavigationMenuItem name={"Defenses"}
                          onClick={() => props.updateGameTab(TAB_DEFENSES)}
                          />
      <NavigationMenuItem name={"Fleets"}
                          data_link={() => console.log("TODO: Handle fleet movements")}
                          icon={fleets_movements}
                          icon_alt={"Fleets"}
                          onClick={() => props.updateGameTab(TAB_FLEETS)}
                          />
      <NavigationMenuItem name={"Galaxy"}
                          onClick={() => props.updateGameTab(TAB_GALAXY)}
                          />
    </div>
  );
}

export {
  TAB_OVERVIEW,
  TAB_RESOURCES,
  TAB_PRODUCTION_SETTINGS,
  TAB_FACILITIES,
  TAB_RESEARCH_LAB,
  TAB_TECH_TREE,
  TAB_SHIPYARD,
  TAB_DEFENSES,
  TAB_FLEETS,
  TAB_GALAXY,
  TAB_RANKINGS,
};

export default NavigationMenu;
