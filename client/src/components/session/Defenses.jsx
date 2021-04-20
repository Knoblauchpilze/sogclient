
import '../../styles/session/Defenses.css';
import '../../styles/session/Game.css';
import React from 'react';
import UnitContainer from './UnitContainer.jsx';

import rocket_launcher from '../../assets/rocket_launcher.jpeg';
import light_laser from '../../assets/light_laser.jpeg';
import heavy_laser from '../../assets/heavy_laser.jpeg';
import gauss_cannon from '../../assets/gauss_cannon.jpeg';
import ion_cannon from '../../assets/ion_cannon.jpeg';
import plasma_turret from '../../assets/plasma_turret.jpeg';

import small_shield_dome from '../../assets/small_shield_dome.jpeg';
import large_shield_dome from '../../assets/large_shield_dome.jpeg';

import antiballistic_missile from '../../assets/antiballistic_missile.jpeg';
import interplanetary_missile from '../../assets/interplanetary_missile.jpeg';

function Defenses (props) {
  let title = "Defenses - Unknown planet";
  let rlCount = 0;
  let llCount = 0;
  let hlCount = 0;
  let gcCount = 0;
  let icCount = 0;
  let ptCount = 0;

  let ssCount = 0;
  let lsCount = 0;

  let amCount = 0;
  let imCount = 0;

  if (props.planet) {
    title = "Defenses - " + props.planet.name;

    const rl = props.planet.defenses.find(d => d.name === "rocket launcher");
    if (rl) {
      rlCount = rl.amount;
    }
    const ll = props.planet.defenses.find(d => d.name === "light laser");
    if (ll) {
      llCount = ll.amount;
    }
    const hl = props.planet.defenses.find(d => d.name === "heavy laser");
    if (hl) {
      hlCount = hl.amount;
    }
    const gc = props.planet.defenses.find(d => d.name === "gauss cannon");
    if (gc) {
      gcCount = gc.amount;
    }
    const ic = props.planet.defenses.find(d => d.name === "ion cannon");
    if (ic) {
      icCount = ic.amount;
    }
    const pt = props.planet.defenses.find(d => d.name === "plasma turret");
    if (pt) {
      ptCount = pt.amount;
    }

    const ss = props.planet.defenses.find(d => d.name === "small shield dome");
    if (ss) {
      ssCount = ss.amount;
    }
    const ls = props.planet.defenses.find(d => d.name === "large shield dome");
    if (ls) {
      lsCount = ls.amount;
    }

    const am = props.planet.defenses.find(d => d.name === "anti-ballistic missile");
    if (am) {
      amCount = am.amount;
    }
    const im = props.planet.defenses.find(d => d.name === "interplanetary missile");
    if (im) {
      imCount = im.amount;
    }
  }

  return (
    <div className="defenses_layout">
      <div className="cover_layout">
        <h3 className="cover_title">{title}</h3>
      </div>
      <div className="defenses_systems_section">
        <p className="cover_header">Defense systems</p>
        <div className="defenses_systems_layout">
          <UnitContainer icon={rocket_launcher}
                         alt={"Rocket launcher"}
                         title={"Rocket launcher"}
                         count={rlCount}
                         min={0}
                         max={1222}/>
          <UnitContainer icon={light_laser}
                         alt={"Light laser"}
                         title={"Light laser"}
                         count={llCount}
                         min={0}
                         max={359}/>
          <UnitContainer icon={heavy_laser}
                         alt={"Heavy laser"}
                         title={"Heavy laser"}
                         count={hlCount}
                         min={0}
                         max={446}/>
          <UnitContainer icon={gauss_cannon}
                         alt={"Gauss cannon"}
                         title={"Gauss cannon"}
                         count={gcCount}
                         min={0}
                         max={7879}/>
          <UnitContainer icon={ion_cannon}
                         alt={"Ion cannon"}
                         title={"Ion cannon"}
                         count={icCount}
                         min={0}
                         max={0}/>
          <UnitContainer icon={plasma_turret}
                         alt={"Plasma turret"}
                         title={"Plasma turret"}
                         count={ptCount}
                         min={0}
                         max={1}/>
          <UnitContainer icon={small_shield_dome}
                         alt={"Small shield dome"}
                         title={"Small shield dome"}
                         count={ssCount}
                         min={0}
                         max={12}/>
          <UnitContainer icon={large_shield_dome}
                         alt={"Large shield dome"}
                         title={"Large shield dome"}
                         count={lsCount}
                         min={0}
                         max={45}/>
          <UnitContainer icon={antiballistic_missile}
                         alt={"Anti-ballistic missile"}
                         title={"Anti-ballistic missile"}
                         count={amCount}
                         min={0}
                         max={9871}/>
          <UnitContainer icon={interplanetary_missile}
                         alt={"Interplanetary missile"}
                         title={"Interplanetary missile"}
                         count={imCount}
                         min={0}
                         max={127}/>
        </div>
      </div>
    </div>
  );
}

export default Defenses;
