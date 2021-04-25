
import energy from '../assets/energy.jpeg';
import laser from '../assets/laser.jpeg';
import ions from '../assets/ions.jpeg';
import hyperspace from '../assets/hyperspace.jpeg';
import plasma from '../assets/plasma.jpeg';

import comb_drive from '../assets/combustion_drive.jpeg';
import impu_drive from '../assets/impulse_drive.jpeg';
import hype_drive from '../assets/hyperspace_drive.jpeg';

import espionage from '../assets/espionage.jpeg';
import computers from '../assets/computers.jpeg';
import astrophysics from '../assets/astrophysics.jpeg';
import igrn from '../assets/intergalactic_research_network.jpeg';
import graviton from '../assets/graviton.jpeg';

import weapons from '../assets/weapons.jpeg';
import shielding from '../assets/shielding.jpeg';
import armour from '../assets/armour.jpeg';

// Defines a fundamental research that is not
// allowed by any other previous technology.
const FUNDAMENTAL_TECHNOLOGY = 0;

// Defines a propulsion technology which can
// be used to improve ships' speed.
const PROPULSION_TECHNOLOGY = 1;

// Defines a research that is based on some
// fundamental technology.
const ADVANCED_TECHNOLOGY = 2;

// Defines a combat technology that is used
// to improve ships' combat efficiency.
const COMBAT_TECHNOLOGY = 3;

export const technologies_list = [
  {
    name: "energy",
    icon: energy,
    type: FUNDAMENTAL_TECHNOLOGY,
  },
  {
    name: "laser",
    icon: laser,
    type: FUNDAMENTAL_TECHNOLOGY,
  },
  {
    name: "ions",
    icon: ions,
    type: FUNDAMENTAL_TECHNOLOGY,
  },
  {
    name: "hyperspace",
    icon: hyperspace,
    type: FUNDAMENTAL_TECHNOLOGY,
  },
  {
    name: "plasma",
    icon: plasma,
    type: FUNDAMENTAL_TECHNOLOGY,
  },

  {
    name: "combustion drive",
    icon: comb_drive,
    type: PROPULSION_TECHNOLOGY,
  },
  {
    name: "impulse drive",
    icon: impu_drive,
    type: PROPULSION_TECHNOLOGY,
  },
  {
    name: "hyperspace drive",
    icon: hype_drive,
    type: PROPULSION_TECHNOLOGY,
  },

  {
    name: "espionage",
    icon: espionage,
    type: ADVANCED_TECHNOLOGY,
  },
  {
    name: "computers",
    icon: computers,
    type: ADVANCED_TECHNOLOGY,
  },
  {
    name: "astrophysics",
    icon: astrophysics,
    type: ADVANCED_TECHNOLOGY,
  },
  {
    name: "intergalactic research network",
    icon: igrn,
    type: ADVANCED_TECHNOLOGY,
  },
  {
    name: "graviton",
    icon: graviton,
    type: ADVANCED_TECHNOLOGY,
  },

  {
    name: "weapons",
    icon: weapons,
    type: COMBAT_TECHNOLOGY,
  },
  {
    name: "shielding",
    icon: shielding,
    type: COMBAT_TECHNOLOGY,
  },
  {
    name: "armour",
    icon: armour,
    type: COMBAT_TECHNOLOGY,
  },
];

export {
  FUNDAMENTAL_TECHNOLOGY,
  PROPULSION_TECHNOLOGY,
  ADVANCED_TECHNOLOGY,
  COMBAT_TECHNOLOGY,
};
