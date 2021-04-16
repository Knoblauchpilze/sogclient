
import '../../styles/NavigationMenu.css';
import React from 'react';
import NavigationMenuItem from './NavigationMenuItem.jsx';

import prod_control from '../../assets/production_control.png';
import tech_tree from '../../assets/tech_tree.png';
import fleets_movements from '../../assets/fleet_movements.png';

function NavigationMenu (props) {
  return (
    <div className="navigation_menu_layout">
      <NavigationMenuItem name={"General view"}
                          item_link={"../overview/overview.html"}
                          />
      <NavigationMenuItem name={"Resources"}
                          item_link={"../resources/resources.html"}
                          data_link={"../resources/production_settings.html"}
                          icon={prod_control}
                          icon_alt={"Prod control"}
                          />
      <NavigationMenuItem name={"Facilities"}
                          item_link={"../facilities/facilities.html"}
                          />
      <NavigationMenuItem name={"Research lab"}
                          item_link={"../research_lab/research_lab.html"}
                          data_link={"../research_lab/technologies_list.html"}
                          icon={tech_tree}
                          icon_alt={"Technology tree"}
                          />
      <NavigationMenuItem name={"Shipyard"}
                          item_link={"../shipyard/shipyard.html"}
                          />
      <NavigationMenuItem name={"Defenses"}
                          item_link={"../defenses/defenses.html"}
                          />
      <NavigationMenuItem name={"Fleets"}
                          item_link={"../fleets/fleets_step_1.html"}
                          data_link={"../fleets/fleets_movements.html"}
                          icon={fleets_movements}
                          icon_alt={"Fleets"}
                          />
      <NavigationMenuItem name={"Galaxy"}
                          item_link={"../galaxy/galaxy.html"}
                          />
    </div>
  );
}

export default NavigationMenu;
