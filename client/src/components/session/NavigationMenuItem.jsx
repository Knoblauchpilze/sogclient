
import '../../styles/session/NavigationMenuItem.css';
import React from 'react';

function NavigationMenuItem (props) {
  return (
    <div className="navigation_menu_item_layout">
      <div className="navigation_menu_item_wrapper" onClick={props.onClick}>
        {props.name}
      </div>
      {
        props.data_link &&
        <a className="navigation_menu_item_data" href={props.data_link}>
          <img className="navigation_menu_item_icon" src={props.icon} alt={props.icon_alt} />
        </a>
      }
      {
        !props.data_link &&
        <div className="navigation_menu_item_data">
          <div className="navigation_menu_item_icon"/>
        </div>
      }
    </div>
  );
}

export default NavigationMenuItem;
