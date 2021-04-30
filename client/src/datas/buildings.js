
import metal_mine from '../assets/metal_mine.jpeg';
import crystal_mine from '../assets/crystal_mine.jpeg';
import deuterium_synthetizer from '../assets/deuterium_synthetizer.jpeg';

import metal_storage from '../assets/metal_storage.jpeg';
import crystal_storage from '../assets/crystal_storage.jpeg';
import deuterium_tank from '../assets/deuterium_tank.jpeg';

import solar_plant from '../assets/solar_plant.jpeg';
import fusion_reactor from '../assets/fusion_reactor.jpeg';

import robotics_factory from '../assets/robotics_factory.jpeg';
import shipyard from '../assets/shipyard.jpeg';
import research_lab from '../assets/research_lab.jpeg';
import alliance_depot from '../assets/alliance_depot.jpeg';
import missile_silo from '../assets/missile_silo.jpeg';
import nanite_factory from '../assets/nanite_factory.jpeg';
import terraformer from '../assets/terraformer.jpeg';
import space_dock from '../assets/space_dock.jpeg';

// Defines a buildings that is either producing resources
// or used in the storage of it.
const RESOURCE_BUILDING = 0;

// Defines a buildings that is linked to the infrastructure
// built on a planet.
const FACILITY = 1;

export const buildings_list = [
  // Resources.
  {
    name: "metal mine",
    icon: metal_mine,
    kind: RESOURCE_BUILDING,
  },
  {
    name: "crystal mine",
    icon: crystal_mine,
    kind: RESOURCE_BUILDING,
  },
  {
    name: "deuterium synthetizer",
    icon: deuterium_synthetizer,
    kind: RESOURCE_BUILDING,
  },

  {
    name: "metal storage",
    icon: metal_storage,
    kind: RESOURCE_BUILDING,
  },
  {
    name: "crystal storage",
    icon: crystal_storage,
    kind: RESOURCE_BUILDING,
  },
  {
    name: "deuterium tank",
    icon: deuterium_tank,
    kind: RESOURCE_BUILDING,
  },

  {
    name: "solar plant",
    icon: solar_plant,
    kind: RESOURCE_BUILDING,
  },
  {
    name: "fusion reactor",
    icon: fusion_reactor,
    kind: RESOURCE_BUILDING,
  },

  // Facilities
  {
    name: "robotics factory",
    icon: robotics_factory,
    kind: FACILITY,
  },
  {
    name: "shipyard",
    icon: shipyard,
    kind: FACILITY,
  },
  {
    name: "research lab",
    icon: research_lab,
    kind: FACILITY,
  },
  {
    name: "alliance depot",
    icon: alliance_depot,
    kind: FACILITY,
  },
  {
    name: "missile silo",
    icon: missile_silo,
    kind: FACILITY,
  },
  {
    name: "nanite factory",
    icon: nanite_factory,
    kind: FACILITY,
  },
  {
    name: "terraformer",
    icon: terraformer,
    kind: FACILITY,
  },
  {
    name: "space dock",
    icon: space_dock,
    kind: FACILITY,
  },
];

export {
  RESOURCE_BUILDING,
  FACILITY,
};
