
import '../../styles/NavigationMenu.css';
import React from 'react';
import NavigationMenuItem from './NavigationMenuItem.jsx';

function NavigationMenu (props) {
  return (
    <div className="navigation_menu_layout">
      <NavigationMenuItem name={"General view"} />
      <NavigationMenuItem name={"Resources"} />
      <NavigationMenuItem name={"Facilities"} />
      <NavigationMenuItem name={"Research lab"} />
      <NavigationMenuItem name={"Shipyard"} />
      <NavigationMenuItem name={"Defenses"} />
      <NavigationMenuItem name={"Fleets"} />
      <NavigationMenuItem name={"Galaxy"} />
    </div>
  );
}

export default NavigationMenu;
