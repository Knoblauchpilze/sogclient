
import '../../styles/session/Facilities.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';

import robotics_factory from '../../assets/robotics_factory.jpeg';
import shipyard from '../../assets/shipyard.jpeg';
import research_lab from '../../assets/research_lab.jpeg';
import alliance_depot from '../../assets/alliance_depot.jpeg';
import missile_silo from '../../assets/missile_silo.jpeg';
import nanite_factory from '../../assets/nanite_factory.jpeg';
import terraformer from '../../assets/terraformer.jpeg';
import space_dock from '../../assets/space_dock.jpeg';

function Facilities (props) {
  let title = "Facilities - Unknown planet";
  let rfLevel = 0;
  let syLevel = 0;
  let rlLevel = 0;
  let adLevel = 0;
  let msLevel = 0;
  let nfLevel = 0;
  let tfLevel = 0;
  let sdLevel = 0;

  if (props.planet) {
    title = "Facilities - " + props.planet.name;

    const rf = props.planet.buildings.find(b => b.name === "robotics factory");
    if (rf) {
      rfLevel = rf.level;
    }
    const sy = props.planet.buildings.find(b => b.name === "shipyard");
    if (sy) {
      syLevel = sy.level;
    }
    const rl = props.planet.buildings.find(b => b.name === "research lab");
    if (rl) {
      rlLevel = rl.level;
    }
    const ad = props.planet.buildings.find(b => b.name === "alliance depot");
    if (ad) {
      adLevel = ad.level;
    }
    const ms = props.planet.buildings.find(b => b.name === "missile silo");
    if (ms) {
      msLevel = ms.level;
    }
    const nf = props.planet.buildings.find(b => b.name === "nanite factory");
    if (nf) {
      nfLevel = nf.level;
    }
    const tf = props.planet.buildings.find(b => b.name === "terraformer");
    if (tf) {
      tfLevel = tf.level;
    }
    const sd = props.planet.buildings.find(b => b.name === "space dock");
    if (sd) {
      sdLevel = sd.level;
    }
  }

  return (
    <div className="facilities_layout">
      <div className="cover_layout">
        <h3 className="cover_title">{title}</h3>
      </div>
      <div className="facilities_buildings_section">
        <p className="cover_header">Production and research</p>
        <div className="facilities_buildings_layout">
          <ElementContainer icon={robotics_factory}
                            alt={"Robotics factory"}
                            title={"Robotics factory"}
                            level={rfLevel}
                            />
          <ElementContainer icon={shipyard}
                            alt={"Shipyard"}
                            title={"Shipyard"}
                            level={syLevel}
                            />
          <ElementContainer icon={research_lab}
                            alt={"Research lab"}
                            title={"Research lab"}
                            level={rlLevel}
                            />
          <ElementContainer icon={alliance_depot}
                            alt={"Alliance depot"}
                            title={"Alliance depot"}
                            level={adLevel}
                            />
          <ElementContainer icon={missile_silo}
                            alt={"Missile silo"}
                            title={"Missile silo"}
                            level={msLevel}
                            />
          <ElementContainer icon={nanite_factory}
                            alt={"Nanite factory"}
                            title={"Nanite factory"}
                            level={nfLevel}
                            />
          <ElementContainer icon={terraformer}
                            alt={"Terraformer"}
                            title={"Terraformer"}
                            level={tfLevel}
                            />
          <ElementContainer icon={space_dock}
                            alt={"Space dock"}
                            title={"Space dock"}
                            level={sdLevel}
                            />
        </div>
      </div>
    </div>
  );
}

export default Facilities;
