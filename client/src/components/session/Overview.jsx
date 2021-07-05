
import '../../styles/session/Overview.css';
import '../../styles/session/Game.css';
import React from 'react';
import OverviewPlanetProp from './OverviewPlanetProp.jsx';

function Overview(props) {
  // Generate default value in case no planet is defined:
  // this will be the case before we fetch the planets
  // from the server.
  let title = "General view - Unknown planet";
  let diameterText = "";
  let tempText = "";
  let coordsText = "";
  let rank = 0;

  let coords = {
    galaxy: 0,
    system: 0
  };

  if (props.planet) {
    title = "General view - " + props.planet.name;

    // Compute used fields.
    const used = props.planet.buildings.reduce(
      (acc, b) => acc + b.level,
      0
    );
    diameterText = props.planet.diameter + " (" + used + "/" + props.planet.fields + ")";

    tempText = props.planet.min_temperature + "°C to " + props.planet.max_temperature + "°C";

    coords.galaxy = props.planet.coordinate.galaxy;
    coords.system = props.planet.coordinate.system;

    coordsText = "[" + (props.planet.coordinate.galaxy + 1);
    coordsText += ":" + (props.planet.coordinate.system + 1);
    coordsText += ":" + (props.planet.coordinate.position + 1);
    coordsText += "]";

    const rk = props.rankings.find(r => r.player === props.planet.player);
    if (rk) {
      rank = rk.rank + 1;
    }
  }

  let points = 0;
  if (props.player) {
    points = Math.floor(props.player.score.economy + props.player.score.research + props.player.score.military);
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
                            link={() => props.viewSystem(coords.galaxy, coords.system)}
                            />
        <OverviewPlanetProp title={"Points"}
                            value={points + " (Rank " + rank + " out of " + props.rankings.length + ")"}
                            link={() => props.viewRankings(props.player.id)}
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
