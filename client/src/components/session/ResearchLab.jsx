
import '../../styles/session/ResearchLab.css';
import '../../styles/session/Game.css';
import React from 'react';
import ElementContainer from './ElementContainer.jsx';

import energy from '../../assets/energy.jpeg';
import laser from '../../assets/laser.jpeg';
import ions from '../../assets/ions.jpeg';
import hyperspace from '../../assets/hyperspace.jpeg';
import plasma from '../../assets/plasma.jpeg';

import comb_drive from '../../assets/combustion_drive.jpeg';
import impu_drive from '../../assets/impulse_drive.jpeg';
import hype_drive from '../../assets/hyperspace_drive.jpeg';

import espionage from '../../assets/espionage.jpeg';
import computers from '../../assets/computers.jpeg';
import astrophysics from '../../assets/astrophysics.jpeg';
import igrn from '../../assets/intergalactic_research_network.jpeg';
import graviton from '../../assets/graviton.jpeg';

import weapons from '../../assets/weapons.jpeg';
import shielding from '../../assets/shielding.jpeg';
import armour from '../../assets/armour.jpeg';

function ResearchLab (props) {
  let title = "Research - Unknown planet";
  let enLevel = 0;
  let laLevel = 0;
  let ioLevel = 0;
  let hyLevel = 0;
  let plLevel = 0;

  let cdLevel = 0;
  let idLevel = 0;
  let hdLevel = 0;

  let esLevel = 0;
  let coLevel = 0;
  let asLevel = 0;
  let irLevel = 0;
  let grLevel = 0;

  let weLevel = 0;
  let shLevel = 0;
  let arLevel = 0;

  if (props.planet) {
    title = "Research - " + props.planet.name;
  }

  if (props.player) {
    const en = props.player.technologies.find(t => t.name === "energy");
    if (en) {
      enLevel = en.level;
    }
    const la = props.player.technologies.find(t => t.name === "laser");
    if (la) {
      laLevel = la.level;
    }
    const io = props.player.technologies.find(t => t.name === "ions");
    if (io) {
      ioLevel = io.level;
    }
    const hy = props.player.technologies.find(t => t.name === "hyperspace");
    if (hy) {
      hyLevel = hy.level;
    }
    const pl = props.player.technologies.find(t => t.name === "plasma");
    if (pl) {
      plLevel = pl.level;
    }

    const cd = props.player.technologies.find(t => t.name === "combustion drive");
    if (cd) {
      cdLevel = cd.level;
    }
    const id = props.player.technologies.find(t => t.name === "impulse drive");
    if (id) {
      idLevel = id.level;
    }
    const hd = props.player.technologies.find(t => t.name === "hyperspace drive");
    if (hd) {
      hdLevel = hd.level;
    }

    const es = props.player.technologies.find(t => t.name === "espionage");
    if (es) {
      esLevel = es.level;
    }
    const co = props.player.technologies.find(t => t.name === "computers");
    if (co) {
      coLevel = co.level;
    }
    const as = props.player.technologies.find(t => t.name === "astrophysics");
    if (as) {
      asLevel = as.level;
    }
    const ir = props.player.technologies.find(t => t.name === "intergalactic research network");
    if (ir) {
      irLevel = ir.level;
    }
    const gr = props.player.technologies.find(t => t.name === "graviton");
    if (gr) {
      grLevel = gr.level;
    }

    const we = props.player.technologies.find(t => t.name === "weapons");
    if (we) {
      weLevel = we.level;
    }
    const sh = props.player.technologies.find(t => t.name === "shielding");
    if (sh) {
      shLevel = sh.level;
    }
    const ar = props.player.technologies.find(t => t.name === "armour");
    if (ar) {
      arLevel = ar.level;
    }
  }

  return (
    <div className="research_lab_layout">
      <div className="cover_layout">
        <h3 className="cover_title">{title}</h3>
      </div>
      <div className="research_lab_researches_layout">
        <div className="research_lab_section">
          <p className="cover_header">Basic research</p>
          <div className="research_lab_section_layout">
            <ElementContainer icon={energy}
                              alt={"Energy"}
                              title={"Energy"}
                              level={enLevel}
                              />
            <ElementContainer icon={laser}
                              alt={"Laser"}
                              title={"Laser"}
                              level={laLevel}
                              />
            <ElementContainer icon={ions}
                              alt={"Ions"}
                              title={"Ions"}
                              level={ioLevel}
                              />
            <ElementContainer icon={hyperspace}
                              alt={"Hyperspace"}
                              title={"Hyperspace"}
                              level={hyLevel}
                              />
            <ElementContainer icon={plasma}
                              alt={"Plasma"}
                              title={"Plasma"}
                              level={plLevel}
                              />
          </div>
        </div>
        <div className="research_lab_section">
          <p className="cover_header">Propulsion research</p>
          <div className="research_lab_section_layout">
            <ElementContainer icon={comb_drive}
                              alt={"Combustion drive"}
                              title={"Combustion drive"}
                              level={cdLevel}
                              />
            <ElementContainer icon={impu_drive}
                              alt={"Impulse drive"}
                              title={"Impulse drive"}
                              level={idLevel}
                              />
            <ElementContainer icon={hype_drive}
                              alt={"Hyperspace drive"}
                              title={"Hyperspace drive"}
                              level={hdLevel}
                              />
          </div>
        </div>
        <div className="research_lab_section">
          <p className="cover_header">Advanced research</p>
          <div className="research_lab_section_layout">
            <ElementContainer icon={espionage}
                              alt={"Espionage"}
                              title={"Espionage"}
                              level={esLevel}
                              />
            <ElementContainer icon={computers}
                              alt={"Computers"}
                              title={"Computers"}
                              level={coLevel}
                              />
            <ElementContainer icon={astrophysics}
                              alt={"Astrophysics"}
                              title={"Astrophysics"}
                              level={asLevel}
                              />
            <ElementContainer icon={igrn}
                              alt={"Intergalactic Research Network"}
                              title={"Intergalactic Research Network"}
                              level={irLevel}
                              />
            <ElementContainer icon={graviton}
                              alt={"Graviton"}
                              title={"Graviton"}
                              level={grLevel}
                              />
          </div>
        </div>
        <div className="research_lab_section">
          <p className="cover_header">Combat research</p>
          <div className="research_lab_section_layout">
            <ElementContainer icon={weapons}
                              alt={"Weapons"}
                              title={"Weapons"}
                              level={weLevel}
                              />
            <ElementContainer icon={shielding}
                              alt={"Shielding"}
                              title={"Shielding"}
                              level={shLevel}
                              />
            <ElementContainer icon={armour}
                              alt={"Armour"}
                              title={"Armour"}
                              level={arLevel}
                              />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResearchLab;
