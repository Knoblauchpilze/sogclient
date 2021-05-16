

import rocket_launcher from '../assets/rocket_launcher.jpeg';
import light_laser from '../assets/light_laser.jpeg';
import heavy_laser from '../assets/heavy_laser.jpeg';
import gauss_cannon from '../assets/gauss_cannon.jpeg';
import ion_cannon from '../assets/ion_cannon.jpeg';
import plasma_turret from '../assets/plasma_turret.jpeg';

import small_shield_dome from '../assets/small_shield_dome.jpeg';
import large_shield_dome from '../assets/large_shield_dome.jpeg';

import antiballistic_missile from '../assets/antiballistic_missile.jpeg';
import interplanetary_missile from '../assets/interplanetary_missile.jpeg';

// Defines a defense system that is installed on a planet.
const GROUND_SYSTEM = 0;

// Defines a defense system that is launched and destroy
// upon being used.
const MISSILE = 1;

export const defenses_list = [
  {
    name: "rocket launcher",
    icon: rocket_launcher,
    kind: GROUND_SYSTEM,
  },
  {
    name: "light laser",
    icon: light_laser,
    kind: GROUND_SYSTEM,
  },
  {
    name: "heavy laser",
    icon: heavy_laser,
    kind: GROUND_SYSTEM,
  },
  {
    name: "gauss cannon",
    icon: gauss_cannon,
    kind: GROUND_SYSTEM,
  },
  {
    name: "ion cannon",
    icon: ion_cannon,
    kind: GROUND_SYSTEM,
  },
  {
    name: "plasma turret",
    icon: plasma_turret,
    kind: GROUND_SYSTEM,
  },

  {
    name: "small shield dome",
    icon: small_shield_dome,
    kind: GROUND_SYSTEM,
  },
  {
    name: "large shield dome",
    icon: large_shield_dome,
    kind: GROUND_SYSTEM,
  },

  {
    name: "anti-ballistic missile",
    icon: antiballistic_missile,
    kind: MISSILE,
  },
  {
    name: "interplanetary missile",
    icon: interplanetary_missile,
    kind: MISSILE,
  },
];

export {
  GROUND_SYSTEM,
  MISSILE,
};
