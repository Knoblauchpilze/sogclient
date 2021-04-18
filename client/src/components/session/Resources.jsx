
import '../../styles/session/Resources.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';

import metal_mine from '../../assets/metal_mine.jpeg';
import crystal_mine from '../../assets/crystal_mine.jpeg';
import deuterium_synthetizer from '../../assets/deuterium_synthetizer.jpeg';

import metal_storage from '../../assets/metal_storage.jpeg';
import crystal_storage from '../../assets/crystal_storage.jpeg';
import deuterium_tank from '../../assets/deuterium_tank.jpeg';

import solar_plant from '../../assets/solar_plant.jpeg';
import fusion_reactor from '../../assets/fusion_reactor.jpeg';

function Resources (props) {
  let title = "Resources - Unknown planet";
  let mmLevel = 0;
  let cmLevel = 0;
  let dsLevel = 0;

  let msLevel = 0;
  let csLevel = 0;
  let dtLevel = 0;

  let spLevel = 0;
  let frLevel = 0;

  if (props.planet) {
    title = "Resources - " + props.planet.name;

    const mm = props.planet.buildings.find(b => b.name === "metal mine");
    if (mm) {
      mmLevel = mm.level;
    }
    const cm = props.planet.buildings.find(b => b.name === "crystal mine");
    if (cm) {
      cmLevel = cm.level;
    }
    const ds = props.planet.buildings.find(b => b.name === "deuterium synthetizer");
    if (ds) {
      dsLevel = ds.level;
    }

    const ms = props.planet.buildings.find(b => b.name === "metal storage");
    if (ms) {
      msLevel = ms.level;
    }
    const cs = props.planet.buildings.find(b => b.name === "crystal storage");
    if (cs) {
      csLevel = cs.level;
    }
    const dt = props.planet.buildings.find(b => b.name === "deuterium tank");
    if (dt) {
      dtLevel = dt.level;
    }

    const sp = props.planet.buildings.find(b => b.name === "solar plant");
    if (sp) {
      spLevel = sp.level;
    }
    const fr = props.planet.buildings.find(b => b.name === "fusion reactor");
    if (fr) {
      frLevel = fr.level;
    }
  }

  return (
    <div className="resources_layout">
      <div className="cover_layout">
        <h3 className="cover_title">{title}</h3>
      </div>
      <div className="resources_buildings_section">
        <p className="resources_buildings_header">Energy and resources</p>
        <div className="resources_buildings_layout">
          <ElementContainer icon={metal_mine}
                            alt={"Metal mine"}
                            title={"Metal mine"}
                            level={mmLevel}
                            />
          <ElementContainer icon={crystal_mine}
                            alt={"Crystal mine"}
                            title={"Crystal mine"}
                            level={cmLevel}
                            />
          <ElementContainer icon={deuterium_synthetizer}
                            alt={"Deuterium synthetizer"}
                            title={"Deuterium synthetizer"}
                            level={dsLevel}
                            />
          <ElementContainer icon={solar_plant}
                            alt={"Solar plant"}
                            title={"Solar plant"}
                            level={spLevel}
                            />
          <ElementContainer icon={fusion_reactor}
                            alt={"Fusion reactor"}
                            title={"Fusion reactor"}
                            level={frLevel}
                            />
          <ElementContainer icon={metal_storage}
                            alt={"Metal storage"}
                            title={"Metal storage"}
                            level={msLevel}
                            />
          <ElementContainer icon={crystal_storage}
                            alt={"Crystal storage"}
                            title={"Crystal storage"}
                            level={csLevel}
                            />
          <ElementContainer icon={deuterium_tank}
                            alt={"Deuterium tank"}
                            title={"Deuterium tank"}
                            level={dtLevel}
                            />
        </div>
      </div>
    </div>
  );
}

export default Resources;
