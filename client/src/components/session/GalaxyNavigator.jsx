
import '../../styles/session/GalaxyNavigator.css';
import '../../styles/session/Galaxy.css';
import React from 'react';

function GalaxyNavigator (props) {
  return (
    <div className="galaxy_navigator_layout">
      <div className="galaxy_navigator_inner_layout">

        <div className="galaxy_navigator_selector_layout">
          <span className="galaxy_default_label">{"Galaxy:"}</span>
          <button className="galaxy_navigator_selector_button galaxy_navigator_selector_previous"
                  onClick={() => props.updateSystem(props.coordinates.galaxy - 1, props.coordinates.solar_system)}
                  />
          <form>
          <input className="galaxy_navigator_selector_current"
                method="post"
                type="number"
                name="selector_index"
                id="selector_index"
                value={props.coordinates.galaxy}
                onChange={e => props.updateSystem(e.target.value, props.coordinates.solar_system)}
                />
          </form>
          <button className="galaxy_navigator_selector_button galaxy_navigator_selector_next"
                  onClick={() => props.updateSystem(props.coordinates.galaxy + 1, props.coordinates.solar_system)}
                  />
        </div>

        <div className="galaxy_navigator_selector_layout">
          <span className="galaxy_default_label">{"System:"}</span>
          <button className="galaxy_navigator_selector_button galaxy_navigator_selector_previous"
                  onClick={() => props.updateSystem(props.coordinates.galaxy, props.coordinates.solar_system - 1)}
                  />
          <form>
          <input className="galaxy_navigator_selector_current"
                method="post"
                type="number"
                name="selector_index"
                id="selector_index"
                value={props.coordinates.solar_system}
                onChange={e => props.updateSystem(props.coordinates.galaxy, e.target.value)}
                />
          </form>
          <button className="galaxy_navigator_selector_button galaxy_navigator_selector_next"
                  onClick={() => props.updateSystem(props.coordinates.galaxy, props.coordinates.solar_system + 1)}
                  />
        </div>
        <button className="galaxy_navigator_button"
                onClick={() => props.updateSystem(props.coordinates.galaxy, props.coordinates.solar_system)}
                >
          Refresh
        </button>
      </div>
      <button className="galaxy_navigator_button">Expedition</button>
    </div>
  );
}

export default GalaxyNavigator;
