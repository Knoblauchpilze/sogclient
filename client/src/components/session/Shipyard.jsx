
import '../../styles/session/Shipyard.css';
import '../../styles/session/Game.css';
import React from 'react';
import UnitContainer from './UnitContainer.jsx';

import light_fighter from '../../assets/light_fighter.jpeg';
import heavy_fighter from '../../assets/heavy_fighter.jpeg';
import cruiser from '../../assets/cruiser.jpeg';
import battleship from '../../assets/battleship.jpeg';
import battlecruiser from '../../assets/battlecruiser.jpeg';
import bomber from '../../assets/bomber.jpeg';
import destroyer from '../../assets/destroyer.jpeg';
import deathstar from '../../assets/deathstar.jpeg';

import small_cargo from '../../assets/small_cargo_ship.jpeg';
import large_cargo from '../../assets/large_cargo_ship.jpeg';
import colony_ship from '../../assets/colony_ship.jpeg';
import recycler from '../../assets/recycler.jpeg';
import espionage_probe from '../../assets/espionage_probe.jpeg';
import solar_satellite from '../../assets/solar_satellite.jpeg';

function Shipyard (props) {
  let title = "Shipyard - Unknown planet";
  let lfCount = 0;
  let hfCount = 0;
  let crCount = 0;
  let bsCount = 0;
  let bcCount = 0;
  let boCount = 0;
  let deCount = 0;
  let dsCount = 0;

  let scCount = 0;
  let lcCount = 0;
  let csCount = 0;
  let reCount = 0;
  let epCount = 0;
  let ssCount = 0;

  if (props.planet) {
    title = "Shipyard - " + props.planet.name;

    const lf = props.planet.ships.find(s => s.name === "light fighter");
    if (lf) {
      lfCount = lf.amount;
    }
    const hf = props.planet.ships.find(s => s.name === "heavy fighter");
    if (hf) {
      hfCount = hf.amount;
    }
    const cr = props.planet.ships.find(s => s.name === "cruiser");
    if (cr) {
      crCount = cr.amount;
    }
    const bs = props.planet.ships.find(s => s.name === "battleship");
    if (bs) {
      bsCount = bs.amount;
    }
    const bc = props.planet.ships.find(s => s.name === "battlecruiser");
    if (bc) {
      bcCount = bc.amount;
    }
    const bo = props.planet.ships.find(s => s.name === "bomber");
    if (bo) {
      boCount = bo.amount;
    }
    const de = props.planet.ships.find(s => s.name === "destroyer");
    if (de) {
      deCount = de.amount;
    }
    const ds = props.planet.ships.find(s => s.name === "deathstar");
    if (ds) {
      dsCount = ds.amount;
    }

    const sc = props.planet.ships.find(s => s.name === "small cargo ship");
    if (sc) {
      scCount = sc.amount;
    }
    const lc = props.planet.ships.find(s => s.name === "large cargo ship");
    if (lc) {
      lcCount = lc.amount;
    }
    const cs = props.planet.ships.find(s => s.name === "colony ship");
    if (cs) {
      csCount = cs.amount;
    }
    const re = props.planet.ships.find(s => s.name === "recycler");
    if (re) {
      reCount = re.amount;
    }
    const ep = props.planet.ships.find(s => s.name === "espionage probe");
    if (ep) {
      epCount = ep.amount;
    }
    const ss = props.planet.ships.find(s => s.name === "solar satellite");
    if (ss) {
      ssCount = ss.amount;
    }
  }

  return (
    <div className="shipyard_layout">
      <div className="cover_layout">
        <h3 className="cover_title">{title}</h3>
      </div>
      <div className="shipyard_ships_layout">
        <div className="shipyard_section">
          <p class="cover_header">Combat ships</p>
          <div className="shipyard_section_layout">
            <UnitContainer icon={light_fighter}
                          alt={"Light fighter"}
                          title={"Light fighter"}
                          count={lfCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={heavy_fighter}
                          alt={"Heavy fighter"}
                          title={"Heavy fighter"}
                          count={hfCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={cruiser}
                          alt={"Cruiser"}
                          title={"Cruiser"}
                          count={crCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={battleship}
                          alt={"Battleship"}
                          title={"Battleship"}
                          count={bsCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={battlecruiser}
                          alt={"Battlecruiser"}
                          title={"Battlecruiser"}
                          count={bcCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={bomber}
                          alt={"Bomber"}
                          title={"Bomber"}
                          count={boCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={destroyer}
                          alt={"Destroyer"}
                          title={"Destroyer"}
                          count={deCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={deathstar}
                          alt={"Deathstar"}
                          title={"Deathstar"}
                          count={dsCount}
                          min={0}
                          max={1222}/>
          </div>
        </div>

        <div className="shipyard_section">
          <p class="cover_header">Civil ships</p>
          <div className="shipyard_section_layout">
            <UnitContainer icon={small_cargo}
                          alt={"Small cargo"}
                          title={"Small cargo"}
                          count={scCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={large_cargo}
                          alt={"Large cargo"}
                          title={"Large cargo"}
                          count={lcCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={colony_ship}
                          alt={"Colony ship"}
                          title={"Colony ship"}
                          count={csCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={recycler}
                          alt={"Recycler"}
                          title={"Recycler"}
                          count={reCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={espionage_probe}
                          alt={"Espionage probe"}
                          title={"Espionage probe"}
                          count={epCount}
                          min={0}
                          max={1222}/>
            <UnitContainer icon={solar_satellite}
                          alt={"Solar satellite"}
                          title={"Solar satellite"}
                          count={ssCount}
                          min={0}
                          max={1222}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shipyard;
