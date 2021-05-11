
import light_fighter from '../assets/light_fighter.jpeg';
import heavy_fighter from '../assets/heavy_fighter.jpeg';
import cruiser from '../assets/cruiser.jpeg';
import battleship from '../assets/battleship.jpeg';
import battlecruiser from '../assets/battlecruiser.jpeg';
import bomber from '../assets/bomber.jpeg';
import destroyer from '../assets/destroyer.jpeg';
import deathstar from '../assets/deathstar.jpeg';

import small_cargo from '../assets/small_cargo_ship.jpeg';
import large_cargo from '../assets/large_cargo_ship.jpeg';
import colony_ship from '../assets/colony_ship.jpeg';
import recycler from '../assets/recycler.jpeg';
import espionage_probe from '../assets/espionage_probe.jpeg';
import solar_satellite from '../assets/solar_satellite.jpeg';

// Defines a ship that is mostly not usable in combat and destined
// to civil missions.
const CIVIL_SHIP = 0;

// Defines a ship that is designed for combat.
const COMBAT_SHIP = 1;

export const ships_list = [
  // Civil ships.
  {
    name: "small cargo ship",
    icon: small_cargo,
    kind: CIVIL_SHIP,
  },
  {
    name: "large cargo ship",
    icon: large_cargo,
    kind: CIVIL_SHIP,
  },
  {
    name: "colony ship",
    icon: colony_ship,
    kind: CIVIL_SHIP,
  },
  {
    name: "recycler",
    icon: recycler,
    kind: CIVIL_SHIP,
  },
  {
    name: "espionage probe",
    icon: espionage_probe,
    kind: CIVIL_SHIP,
  },
  {
    name: "solar satellite",
    icon: solar_satellite,
    kind: CIVIL_SHIP,
  },

  // Combat ships.
  {
    name: "light fighter",
    icon: light_fighter,
    kind: COMBAT_SHIP,
  },
  {
    name: "heavy fighter",
    icon: heavy_fighter,
    kind: COMBAT_SHIP,
  },
  {
    name: "cruiser",
    icon: cruiser,
    kind: COMBAT_SHIP,
  },
  {
    name: "battleship",
    icon: battleship,
    kind: COMBAT_SHIP,
  },
  {
    name: "battlecruiser",
    icon: battlecruiser,
    kind: COMBAT_SHIP,
  },
  {
    name: "bomber",
    icon: bomber,
    kind: COMBAT_SHIP,
  },
  {
    name: "destroyer",
    icon: destroyer,
    kind: COMBAT_SHIP,
  },
  {
    name: "deathstar",
    icon: deathstar,
    kind: COMBAT_SHIP,
  },
];

export {
  CIVIL_SHIP,
  COMBAT_SHIP,
};
