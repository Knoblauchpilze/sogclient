
import {resources_list} from '../../datas/resources.js';
import {buildings_list} from '../../datas/buildings.js';
import {technologies_list} from '../../datas/technologies.js';

function formatDuration(duration) {
  // We will divide at most until we reach a duration
  // of a week. Any longer duration will continue to
  // add more weeks.
  const s = Math.floor(duration * 3600.0) % 60;
  const m = Math.floor(duration * 60.0) % 60;
  const h = Math.floor(duration) % 24;
  const d = Math.floor(duration / 24) % 7;
  const w = Math.floor(duration / (24 * 7));

  let out = "";

  // Weeks.
  if (w > 0) {
    out += w;
    out += "w";
  }

  // Days.
  if (d > 0) {
    if (out !== "") {
      out += " ";
    }

    out += d;
    out += "d"
  }

  // Hours.
  if (h > 0) {
    if (out !== "") {
      out += " ";
    }

    out += h;
    out += "h"
  }

  // Minutes.
  if (m > 0) {
    if (out !== "") {
      out += " ";
    }

    out += m;
    out += "m"
  }

  // Seconds.
  if (s > 0) {
    if (out !== "") {
      out += " ";
    }

    out += s;
    out += "s"
  }

  return out;
}

class Planet {
  // The `planet` defines the planet's data that is fetched
  // from the server.
  //
  // The `techs` corresponds to the level of technologies
  // researched by the player owning the planet.
  //
  // The `planets` defines the list of planets available
  // for the player owning this one.
  //
  // The `universe` defines the universe in which the planet
  // is located. This helps with the computation of the
  // duration of the construction of buildings and techs.
  //
  // The `resources` defines the list of resources fetched
  // from the server and represents the base description
  // for all supported resources in the game.
  //
  // The `buildings` defines the list of buildings fetched
  // from the server and represents the base description
  // for all supported buildings in the game.
  //
  // The `technoloiges` defines the list fetched from the
  // server and registering all technologies.
  constructor(planet, techs, planets, universe, resources, buildings, technologies) {
    this.data = {
      planet: planet,
      technologies: techs,
    }

    this.universe = universe;
    this.planets = planets;

    this.resources = resources;
    this.buildings = buildings;
    this.technologies = technologies;
  }

  generateCosts(costs, level) {
    let out = {
      costs: [],
      buildable: true,
      // TODO: Handle demolishable.
      demolishable: false,
    };

    // Make sure to traverse the resources as defined
    // in the list as we know they are sorted by order
    // of 'importance'.
    for (let rID = 0 ; rID < resources_list.length ; rID++) {
      // We need to find the description of the resource
      // based on the name defined in the data store.
      const r = this.resources.find(res => res.name === resources_list[rID].name);

      if (!r) {
        console.error("Failed to register find description for \"" + resources_list[rID].name + "\"");
        continue;
      }

      // We can now determine whether this research uses
      // this resource based on the identifier.
      const rData = costs.init_costs.find(res => res.resource === r.id);

      if (!rData) {
        continue;
      }

      // Compute the total amount based on the progression
      // rule defined for this building.
      const amount = Math.floor(rData.amount * Math.pow(costs.progression, level));

      // Find whether or not the planet holds enough resources
      // to build this level.
      let enough = false;

      const available = this.data.planet.resources.find(res => res.resource === r.id);
      if (!available) {
        console.error("Failed to find amount of resource \"" + resources_list[rID].name + "\" on planet");
      }
      else {
        enough = (available.amount >= amount);
      }

      if (!enough) {
        out.buildable = false;
      }

      // We can now register the resource.
      out.costs.push({
        icon: resources_list[rID].mini,
        name: resources_list[rID].name,
        amount: amount,
        enough: enough,
      });
    }

    return out;
  }

  computeBuildingDuration(costs, level) {
    // The duration is computed from the amount of metal
    // and crystal required to build the level and is
    // reduced by each level of robotics and nanite factory
    // on the planet.

    // Fetch relevant costs.
    const m = costs.find(cost => cost.name === "metal");
    const c = costs.find(cost => cost.name === "crystal");

    let mAmount = 0;
    if (m) {
      mAmount = m.amount;
    }
    let cAmount = 0;
    if (c) {
      cAmount = c.amount;
    }

    // Fetch levels of robotics and nanite factories.
    const rf = this.data.planet.buildings.find(b => b.name === "robotics factory");
    const nf = this.data.planet.buildings.find(b => b.name === "nanite factory");

    let rfLvl = 0;
    if (rf) {
      rfLvl = rf.level;
    }
    let nfLvl = 0;
    if (nf) {
      nfLvl = nf.level;
    }

    let hours = (mAmount + cAmount) / (2500.0 * (1.0 + rfLvl) * Math.pow(2.0, nfLvl));

    // Update the duration based on the universe's economic
    // speed: it might reduce the construction time.
    const ratio = 1.0 / this.universe.economic_speed;
    hours *= ratio;

    return formatDuration(hours);
  }

  computeTechnologyDuration(costs, level) {
    return "24m";
  }

  getBuildingData(name) {
    let out = {
      building: {},
      found: false,
    };

    // Find the building in the list of elements registered
    // in the imported data. This will consitute the first
    // basis for the building data.
    const id = buildings_list.findIndex(b => b.name === name);

    // In case the building was not found, return a default
    // value.
    if (id === -1) {
      return out;
    }

    // Search the base characteristics of the building from
    // the list fetched from the server.
    const b = this.buildings.find(b => b.name === buildings_list[id].name);

    // If it can't be found, then return a default value.
    if (!b) {
      return out;
    }

    // Fetch the level of this building on the planet.
    let lvl = 0;
    const pBuilding = this.data.planet.buildings.find(building => building.name === b.name);
    if (pBuilding) {
      lvl = pBuilding.level;
    }

    // Generate resources needed for this building.
    const costs = this.generateCosts(b.cost, lvl);

    // Handle the energy requirement of the building.
    let energy = 0;
    if (b.production) {
      const e = this.resources.find(res => res.name === "energy");
      const eData = b.production.find(r => r.resource === e.id);

      if (eData) {
        const avgTemp = (this.data.planet.min_temperature + this.data.planet.max_temperature) / 2.0;
        const tempDep = eData.temp_offset + avgTemp * eData.temp_coeff;
        energy = Math.floor(eData.init_production * tempDep * Math.pow(eData.progression, lvl));
      }
    }

    // Package the output.
    out.found = true;
    out.building = {
      id: b.id,
      name: b.name,
      level: lvl,
      icon: buildings_list[id].icon,
      resources: costs.costs,
      energy: energy,
      duration: this.computeBuildingDuration(costs.costs, lvl),
      buildable: costs.buildable,
      demolishable: costs.demolishable,
      description: "This is maybe a description",
    };

    return out;
  }

  getTechnologyData(name) {
    let out = {
      technology: {},
      found: false,
    };

    // Find the technology in the list of elements registered
    // in the imported data. This will consitute the first
    // basis for the technology data.
    const id = technologies_list.findIndex(t => t.name === name);

    // In case the technology was not found, return a default
    // value.
    if (id === -1) {
      return out;
    }

    // Search the base characteristics of the technology from
    // the list fetched from the server.
    const t = this.technologies.find(t => t.name === technologies_list[id].name);

    // If it can't be found, then return a default value.
    if (!t) {
      return out;
    }

    // Fetch the level of this technology on the planet.
    let lvl = 0;
    const pTechnology = this.data.technologies.find(technology => technology.name === t.name);
    if (pTechnology) {
      lvl = pTechnology.level;
    }

    // Generate resources needed for this technology.
    const costs = this.generateCosts(t.cost, lvl);

    // Package the output.
    out.found = true;
    out.technology = {
      id: t.id,
      name: t.name,
      level: lvl,
      icon: technologies_list[id].icon,
      resources: costs.costs,
      // Technologies don't produce energy.
      energy: 0,
      duration: this.computeTechnologyDuration(costs.costs, lvl),
      buildable: costs.buildable,
      // Technologies can't be 'demolished'.
      demolishable: false,
      description: "This is not a description",
    };

    return out;
  }
}

export default Planet;
