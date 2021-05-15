
import { resources_list } from '../../datas/resources.js';
import { buildings_list } from '../../datas/buildings.js';
import { technologies_list } from '../../datas/technologies.js';
import { ships_list } from '../../datas/ships.js';
import { defenses_list } from '../../datas/defenses.js';

import Server from '../game/server.js';

// Defines a constant indicating that creating an upgrade
// action succeeded.
const UPGRADE_ACTION_POST_SUCCEEDED = "Upgrade action successfully created";

// Defines a constant indicating that creating an upgrade
// action failed.
const UPGRADE_ACTION_POST_FAILED = "Failed to create upgrade action";

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
  //
  // The `ships` defines the list fetched from the sserver
  // and registering all ships.
  //
  // The `defenses` defines the list fetched from the server
  // and registering all defenses.
  constructor(planet, techs, planets, universe, resources, buildings, technologies, ships, defenses) {
    this.data = {
      planet: planet,
      technologies: techs,
    }

    this.universe = universe;
    this.planets = planets;

    this.resources = resources;
    this.buildings = buildings;
    this.technologies = technologies;
    this.ships = ships;
    this.defenses = defenses;
  }

  generateCosts(costs, level) {
    let out = {
      costs: [],
      buildable: true,
      demolishable: (level > 0),
      max: -1,
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
      // rule defined for this item: in case there's no
      // rule defined, we will just use the base amount.
      let amount = rData.amount;
      if (costs.progression) {
        amount = Math.floor(rData.amount * Math.pow(costs.progression, level));
      }

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

      // Compute min and max bound.
      const max = Math.floor(!available ? 0 : available.amount / amount);
      if (out.max < 0) {
        out.max = max;
      }
      else if (out.max > max) {
        out.max = max;
      }

      // While we're at it, determine if there's enough resources
      // to demolish the building: this is true if there are some
      // resources to 'build' the previous level. Of course we
      // only handle the computation in case the demolishable is
      // set to `true` still (which will indicate that the level
      // is actually at least `1`).
      if (out.demolishable) {
        const demolish = Math.floor(rData.amount * Math.pow(costs.progression, level - 1));
        out.demolishable = (available.amount >= demolish);
      }

      // We can now register the resource.
      out.costs.push({
        icon: resources_list[rID].mini,
        name: resources_list[rID].name,
        amount: amount,
        enough: enough,
      });
    }

    // Normalize the min and max amount of elements that can be
    // built for this element.
    if (out.max < 0) {
      out.max = 0;
    }

    return out;
  }

  generateDependencies(element) {
    let out = {
      buildingsPrerequisitesOk: true,
      technologiesPrerequisitesOk: true,
    };

    for (let id = 0 ; id < element.buildings_dependencies.length && out.buildingsPrerequisitesOk ; ++id) {
      // Check the level of the dependency on the planet.
      const dep = element.buildings_dependencies[id];

      const bDep = this.data.planet.buildings.find(e => e.id === dep.id);
      if (!bDep || bDep.level < dep.level) {
        out.buildingsPrerequisitesOk = false;
      }
    }

    for (let id = 0 ; id < element.technologies_dependencies.length && out.technologiesPrerequisitesOk ; ++id) {
      // Check the level of the dependency on the planet.
      const dep = element.technologies_dependencies[id];

      const tDep = this.data.technologies.find(e => e.id === dep.id);
      if (!tDep || tDep.level < dep.level) {
        out.technologiesPrerequisitesOk = false;
      }
    }

    return out;
  }

  computeBuildingDuration(costs) {
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

    // From there the duration can be computed using
    // the economic speed of the universe as a boost.
    let hours = (mAmount + cAmount) / (2500.0 * (1.0 + rfLvl) * Math.pow(2.0, nfLvl));

    const ratio = 1.0 / this.universe.economic_speed;
    hours *= ratio;

    return formatDuration(hours);
  }

  computeTechnologyDuration(costs) {
    // Similarly as for buildings the duration is computed
    // from the cost in metal and crystal. The duration is
    // reduced based on the number of research lab that are
    // participating in the research (controlled by the
    // level of the intergalactic research network).

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

    // Fetch levels of intergalactic research network.
    const igrn = this.data.technologies.find(b => b.name === "intergalactic research network");

    // Keep planets with highest research network.
    const labs = [];
    for (let id = 0 ; id < this.planets.length ; id++) {
      const lab = this.planets[id].buildings.find(b => b.name === "research lab");
      if (!lab) {
        continue;
      }

      labs.push({
        planet: this.planets[id].id,
        level: lab.level,
      });
    }

    labs.sort((a, b) => a.level < b.level);

    // Keep only the amount possible based on the research
    // network level.
    let count = 0;
    if (igrn) {
      count = igrn.level;
    }

    // Keep the `count` highest research lab, excluding the
    // one built on this planet.
    let rPower = 0;
    let processed = 0;

    for (let id = 0 ; processed < count && id < labs.length ; id++) {
      // If this research lab is not build on the current
      // planet, we can add it to the list.
      if (labs[id].planet !== this.data.planet.id) {
        rPower += labs[id].level;
        processed++;
      }
    }

    // Add the research power brought by the lab on this planet.
    const lab = this.data.planet.buildings.find(b => b.name === "research lab");
    if (lab) {
      rPower += lab.level;
    }

    // From there the duration can be computed using
    // the economic speed of the universe as a boost.
    let hours = (mAmount + cAmount) / (1000.0 * (1.0 + rPower));

    const ratio = 1.0 / this.universe.research_speed;
    hours *= ratio;

    return formatDuration(hours);
  }

  computeCombatItemDuration(costs) {
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

    // From there the duration can be computed using
    // the economic speed of the universe as a boost.
    let hours = (mAmount + cAmount) / (2500.0 * (1.0 + rfLvl) * Math.pow(2.0, nfLvl));

    const ratio = 1.0 / this.universe.economic_speed;
    hours *= ratio;

    return formatDuration(hours);
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
    let nextEnergy = 0;

    if (b.production) {
      const e = this.resources.find(res => res.name === "energy");
      const eData = b.production.find(r => r.resource === e.id);

      if (eData) {
        const avgTemp = (this.data.planet.min_temperature + this.data.planet.max_temperature) / 2.0;
        const tempDep = eData.temp_offset + avgTemp * eData.temp_coeff;

        energy = Math.floor(eData.init_production * lvl * tempDep * Math.pow(eData.progression, lvl));
        nextEnergy = Math.floor(eData.init_production * (lvl + 1) * tempDep * Math.pow(eData.progression, lvl + 1));
      }
    }

    // Update buildable and demolishable based on whether
    // the dependencies for this building are researched.
    const deps = this.generateDependencies(b);

    // Package the output.
    out.found = true;
    out.building = {
      id: b.id,
      name: b.name,
      level: lvl,
      icon: buildings_list[id].icon,
      resources: costs.costs,
      energy: energy,
      next_energy: nextEnergy,
      duration: this.computeBuildingDuration(costs.costs),
      buildable: {
        // A building can be added only in case there is no
        // active research.
        queue: (this.data.planet.buildings_upgrade.length === 0),
        resources: costs.buildable,
        buildings: deps.buildingsPrerequisitesOk,
        technologies: deps.technologiesPrerequisitesOk,
      },
      demolishable: costs.demolishable,
      bulk_buildable: false,
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

    // Update buildable and demolishable based on whether
    // the dependencies for this technology are researched.
    const deps = this.generateDependencies(t);

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
      next_energy: 0,
      duration: this.computeTechnologyDuration(costs.costs),
      buildable: {
        // A technology can be added only in case there is no
        // active research.
        queue: (this.data.planet.technologies_upgrade.length === 0),
        resources: costs.buildable,
        buildings: deps.buildingsPrerequisitesOk,
        technologies: deps.technologiesPrerequisitesOk,
      },
      // Technologies can't be 'demolished'.
      demolishable: false,
      bulk_buildable: false,
      description: "This is not a description",
    };

    return out;
  }

  getShipData(name) {
    let out = {
      ship: {},
      found: false,
    };

    // Find the ship in the list of elements registered
    // in the imported data. This will consitute the first
    // basis for the ship data.
    const id = ships_list.findIndex(s => s.name === name);

    // In case the ship was not found, return a default
    // value.
    if (id === -1) {
      return out;
    }

    // Search the base characteristics of the ship from
    // the list fetched from the server.
    const s = this.ships.find(s => s.name === ships_list[id].name);

    // If it can't be found, then return a default value.
    if (!s) {
      return out;
    }

    // Fetch the amount of this ship on the planet.
    let amount = 0;
    const pShip = this.data.planet.ships.find(ship => ship.name === s.name);
    if (pShip) {
      amount = pShip.amount;
    }

    // Generate resources needed for this ship.
    const costs = this.generateCosts(s.cost, 0);

    // Update buildable and demolishable based on whether
    // the dependencies for this ship are researched.
    const deps = this.generateDependencies(s);

    // Package the output.
    out.found = true;
    out.ship = {
      id: s.id,
      name: s.name,
      count: amount,
      icon: ships_list[id].icon,
      resources: costs.costs,
      // Ships don't produce energy.
      energy: 0,
      next_energy: 0,
      duration: this.computeCombatItemDuration(costs.costs),
      buildable: {
        // A ship can always be added to the queue.
        queue: true,
        resources: costs.buildable,
        buildings: deps.buildingsPrerequisitesOk,
        technologies: deps.technologiesPrerequisitesOk,
      },
      // Ships can't be 'demolished'.
      demolishable: false,
      bulk_buildable: true,
      max: costs.max,
      description: "This is maybe a description",
    };

    return out;
  }

  getDefenseData(name) {
    let out = {
      defense: {},
      found: false,
    };

    // Find the defense in the list of elements registered
    // in the imported data. This will consitute the first
    // basis for the defense data.
    const id = defenses_list.findIndex(d => d.name === name);

    // In case the defense was not found, return a default
    // value.
    if (id === -1) {
      return out;
    }

    // Search the base characteristics of the defense from
    // the list fetched from the server.
    const d = this.defenses.find(d => d.name === defenses_list[id].name);

    // If it can't be found, then return a default value.
    if (!d) {
      return out;
    }

    // Fetch the amount of this defense on the planet.
    let amount = 0;
    const pDefense = this.data.planet.defenses.find(defense => defense.name === d.name);
    if (pDefense) {
      amount = pDefense.amount;
    }

    // Generate resources needed for this defense.
    const costs = this.generateCosts(d.cost, 0);

    // Update buildable and demolishable based on whether
    // the dependencies for this defense are researched.
    const deps = this.generateDependencies(d);

    // Package the output.
    out.found = true;
    out.defense = {
      id: d.id,
      name: d.name,
      count: amount,
      icon: defenses_list[id].icon,
      resources: costs.costs,
      // Defenses don't produce energy.
      energy: 0,
      next_energy: 0,
      duration: this.computeCombatItemDuration(costs.costs),
      buildable: {
        // A ship can always be added to the queue.
        queue: true,
        resources: costs.buildable,
        buildings: deps.buildingsPrerequisitesOk,
        technologies: deps.technologiesPrerequisitesOk,
      },
      // Defenses can't be 'demolished'.
      demolishable: false,
      bulk_buildable: true,
      max: costs.max,
      description: "This is maybe a description",
    };

    return out;
  }

  async postUpgradeAction(id, level, desired, route) {
    const out = {
      status: UPGRADE_ACTION_POST_FAILED,
      action: "",
    };

    // Create the action object to post.
    const action = {
      element: id,
      planet: this.data.planet.id,

      current_level: level,
      desired_level: desired,
    }

    // Generate the post request to create the action.
    const server = new Server();

    const formData  = new FormData();
    formData.append(server.upgradeActionDataKey(), JSON.stringify(action));

    let opts = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    };

    // Execute the request.
    let reqStatus = "";

    const res = await fetch(route, opts)
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      out.status = reqStatus;
      return out;
    }

    if (!res.ok) {
      out.status = await res.text();
      return out;
    }

    // Fetch the identifier returned by the server.
    // It is returned through a format that is not
    // exactly pure so we clean it through a server
    // dedicated method.
    const actionID = await res.text();
    out.action = server.actionIDFromResponse(actionID);
    out.status = UPGRADE_ACTION_POST_SUCCEEDED;

    return out;
  }

  async postBuildAction(id, amount, route) {
    const out = {
      status: UPGRADE_ACTION_POST_FAILED,
      action: "",
    };

    // Create the action object to post.
    const action = {
      element: id,
      planet: this.data.planet.id,

      amount: amount,
    }

    // Generate the post request to create the action.
    const server = new Server();

    const formData  = new FormData();
    formData.append(server.upgradeActionDataKey(), JSON.stringify(action));

    let opts = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    };

    // Execute the request.
    let reqStatus = "";

    const res = await fetch(route, opts)
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      out.status = reqStatus;
      return out;
    }

    if (!res.ok) {
      out.status = await res.text();
      return out;
    }

    // Fetch the identifier returned by the server.
    // It is returned through a format that is not
    // exactly pure so we clean it through a server
    // dedicated method.
    const actionID = await res.text();
    out.action = server.actionIDFromResponse(actionID);
    out.status = UPGRADE_ACTION_POST_SUCCEEDED;

    return out;
  }

  async upgradeBuilding(building) {
    // Attempt to get details on the current level of the building
    // on the planet and its general descritpion.
    const built = this.data.planet.buildings.find(b => b.id === building);
    const server = new Server();

    // Post the action to the server.
    return this.postUpgradeAction(
      building,
      built.level,
      built.level + 1,
      server.buildingUpgradeAction(this.data.planet.id)
    );
  }

  async demolishBuilding(building) {
    // Attempt to get details on the current level of the building
    // on the planet and its general descritpion.
    const built = this.data.planet.buildings.find(b => b.id === building);
    const server = new Server();

    // Post the action to the server.
    return this.postUpgradeAction(
      building,
      built.level,
      built.level - 1,
      server.buildingUpgradeAction(this.data.planet.id)
    );
  }

  async upgradeTechnology(technology) {
    // Attempt to get details on the current level of the building
    // on the planet and its general descritpion.
    const built = this.data.technologies.find(t => t.id === technology);
    const server = new Server();

    // Post the action to the server.
    return this.postUpgradeAction(
      technology,
      built.level,
      built.level + 1,
      server.technologyUpgradeAction(this.data.planet.id)
    );
  }

  async upgradeShip(ship, count) {
    const server = new Server();

    // Post the action to the server.
    return this.postBuildAction(
      ship,
      count,
      server.shipUpgradeAction(this.data.planet.id)
    );
  }

  async upgradeDefense(defense, count) {
    const server = new Server();

    // Post the action to the server.
    return this.postBuildAction(
      defense,
      count,
      server.defenseUpgradeAction(this.data.planet.id)
    );
  }
}

export {
  UPGRADE_ACTION_POST_SUCCEEDED,
};

export default Planet;
