
import '../../styles/session/TechnologyTreeItem.css';
import React from 'react';

function generateItemDesc(item, id) {
  let classes = "tech_tree_item_dependency";
  if (item.unlocked) {
    classes += " tech_tree_item_dependency_unlocked";
  }
  else {
    classes += " tech_tree_item_dependency_locked";
  }

  return (
    <div key={id + item.name} className={classes}>
      {item.name + " (level: " + (item.available >= item.level ? "" : item.available + "/") + item.level + ")"}
    </div>
  );
}

function TechnologyTreeItem (props) {
  return (
    <div key={props.item.id} className="tech_tree_item_layout">
      <div className="tech_tree_item_header">
        {props.item.icon && <img className="tech_tree_item_icon" src={props.item.icon} alt={props.item.name} title={props.item.name}/>}
        {props.item.name}
      </div>
      <div className="tech_tree_item_dependencies">
        {
          props.item.buildings_dependencies.map(d => generateItemDesc(d, props.item.id))
        }
        {
          props.item.technologies_dependencies.map(d => generateItemDesc(d, props.item.id))
        }
      </div>
    </div>
  );
}

export default TechnologyTreeItem;
