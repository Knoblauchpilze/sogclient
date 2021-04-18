
import '../../styles/session/Overview.css';
import '../../styles/session/Game.css';
import React from 'react';
import OverviewPlanetProp from './OverviewPlanetProp.jsx';

function Overview (props) {
  // Generate default value in case no planet is defined:
  // this will be the case before we fetch the planets
  // from the server.
  let title = "General view - Unknown planet";
  let diameterText = "";
  let tempText = "";
  let coordsText = "";

  if (props.planet) {
    title = "General view - " + props.planet.name;

    // Compute used fields.
    const used = props.planet.buildings.reduce(
      (acc, b) => acc + b.level,
      0
    );
    diameterText = props.planet.diameter + " (" + used + "/" + props.planet.fields + ")";

    tempText = props.planet.min_temperature + "°C to " + props.planet.max_temperature + "°C";

    coordsText = "[" + props.planet.coordinate.galaxy;
    coordsText += ":" + props.planet.coordinate.system;
    coordsText += ":" + props.planet.coordinate.position;
    coordsText += "]";
  }

  return (
    <div className="cover_layout">
      <h3 className="cover_title">{title}</h3>
      <div className="overview_planet_info">
        <OverviewPlanetProp title={"Diameter"}
                            value={diameterText}
                            link={""}
                            />
        <OverviewPlanetProp title={"Temperature"}
                            value={tempText}
                            link={""}
                            />
        <OverviewPlanetProp title={"Position"}
                            value={coordsText}
                            link={"../galaxy/galaxy.html"}
                            />
        <OverviewPlanetProp title={"Points"}
                            value={"TODO (Rank TODO out of TODO)"}
                            link={"../rankings/rankings.html"}
                            />
        <OverviewPlanetProp title={"Honorific points"}
                            value={"TODO"}
                            link={""}
                            />
        <div className="overview_planet_bonus">
          <a href="../galaxy/galaxy.html">Move (2)</a>
          <a href="TODO: abandon rename">Abandon/Rename</a>
        </div>
      </div>
    </div>
  );
}

export default Overview;
