
import '../../styles/session/GalaxyNavigator.css';
import '../../styles/session/Galaxy.css';
import React from 'react';

function generateCoordinateSelector(label, current, min, max) {
  return (
    <div className="galaxy_navigator_selector_layout">
      <span className="galaxy_default_label">{label + ":"}</span>
      <button class="galaxy_navigator_selector_button galaxy_navigator_selector_previous"></button>
      <form>
        <input className="galaxy_navigator_selector_current"
               method="post"
               type="number"
               name="selector_index"
               id="selector_index"
               value={current}
               min={min}
               max={max}
               />
      </form>
      <button class="galaxy_navigator_selector_button galaxy_navigator_selector_next"></button>
    </div>
  )
}

function GalaxyNavigator (props) {
  return (
    <div className="galaxy_navigator_layout">
      <div className="galaxy_navigator_inner_layout">
        {generateCoordinateSelector("Galaxy", 0, 0, 9)}
        {generateCoordinateSelector("System", 0, 0, 499)}
        <button className="galaxy_navigator_button">Refresh</button>
      </div>
      <button className="galaxy_navigator_button">Expedition</button>
    </div>
  );
}

export default GalaxyNavigator;
