
import '../../styles/NavigationMenuItem.css';
import React from 'react';

function NavigationMenuItem (props) {
  return (
    <div className="navigation_menu_item_layout">
      <div class="navigation_menu_item_wrapper">
        <a class="navigation_menu_item" href={props.item_link}>{props.name}</a>
        </div>
      <a class="navigation_menu_item_data" href={props.data_link}>
        <img class="navigation_menu_item_icon" src={props.icon} alt={props.icon_alt} />
      </a>
    </div>
  );
}

export default NavigationMenuItem;
