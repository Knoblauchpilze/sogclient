
import '../../styles/Overview.css';
import React from 'react';
import OverviewPlanetProp from './OverviewPlanetProp.jsx';

function Overview (props) {
  return (
    <div className="overview_layout">
      <h3 className="overview_title">General view - New London</h3>
      <div className="overview_planet_info">
        <OverviewPlanetProp title={"Diameter"}
                            value={"13215 (180/210)"}
                            link={""}
                            />
        <OverviewPlanetProp title={"Temperature"}
                            value={"11°C to 51°C"}
                            link={""}
                            />
        <OverviewPlanetProp title={"Position"}
                            value={"[5:53:8]"}
                            link={"../galaxy/galaxy.html"}
                            />
        <OverviewPlanetProp title={"Points"}
                            value={"5702399 (Rank 172 out of 2815)"}
                            link={"../rankings/rankings.html"}
                            />
        <OverviewPlanetProp title={"Honorific points"}
                            value={"48837"}
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
