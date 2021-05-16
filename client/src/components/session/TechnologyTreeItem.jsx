
import '../../styles/session/TechnologyTreeItem.css';
import React from 'react';

function TechnologyTreeItem (props) {
  return (
    <div className="tech_tree_item_layout">
      {props.name}
    </div>
  );
}

export default TechnologyTreeItem;
