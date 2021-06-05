
export function computeDistance(start, end) {
  // Case where galaxies are different.
  if (start.galaxy !== end.galaxy) {
    return 20000 * Math.abs(start.galaxy - end.galaxy);
  }

  // Case where systems are different.
  if (start.system !== end.system) {
    return 2700 + (95 * Math.abs(start.system - end.system));
  }

  // Case where positions are different.
  if (start.position !== end.position) {
    return 1000 + (5 * Math.abs(start.position - end.position));
  }

  // Within same position the cost is always identical.
  return 5
}

function selectEngine(ship, technologies) {
  // The list of `engines` for this ship is ordered
  // by complexity. We will check which engine has
  // been unlocked and select the most complex one.
  let locked = true;
  let id = 0;

  for (id = 0 ; id < ship.engines.length && locked ; id++) {
    const eng = ship.engines[ship.engines.length - 1 - id];

    // This engine is locked if the minimum level of
    // the technology required is not met.
    const tech = technologies.find(t => t.id === eng.propulsion_desc.propulsion);
    let level = 0;
    if (tech) {
      level = tech.level;
    }

    locked = (level < eng.min_level);
  }

  // Note: by default, we consider that the first
  // engine is always available. There are other
  // means that will guarantee that we prevent the
  // actual creation of ships in the first place
  // if the technology for the engine is not met.
  if (locked) {
    return ship.engines[0];
  }

  return ship.engines[ship.engines.length - id];
}

function computeSpeed(engine, technologies) {
  // Return the level of the technology used by
  // the engine. In case the technology is not
  // researched a `0` value will provided which
  // is fine.
  const tech = technologies.find(t => t.id === engine.propulsion_desc.propulsion);
  let level = 0;
  if (tech) {
    level = tech.level;
  }

  const ratio = 1.0 + (level * engine.propulsion_desc.increase) / 100.0
  const fSpeed = engine.speed * ratio;

  return Math.round(fSpeed);
}

export function computeDuration(distance, speedFactor, ratio, ships, technologies) {
  // Determine maximum speed for this fleet.
  const maxSpeed = computeMaxSpeed(ships, technologies);

  // Compute the duration of the flight given the distance.
  // Note that the speed percentage is interpreted as such:
  //  - 100% -> 10
  //  -  50% -> 5
  //  -  10% -> 1
  const speedRatio = speedFactor * 10.0;
  let flightTimeSec = 35000.0 / speedRatio * Math.sqrt(distance * 10.0 / maxSpeed) + 10.0;

  // Apply the multiplier for the speed of the fleet based
  // on the parent universe's value.
  flightTimeSec *= ratio;

  // Compute the flight time by converting this duration in
  // milliseconds: this will allow to keep more precision.
  return 1000.0 * flightTimeSec;
}

export function computeConsumption(distance, flightTimeMs, deploymentTimeMs, ratio, conso, ships, technologies) {
  // Compute the raw flight time in seconds. Internally
  // it is expressed in milliseconds and also already
  // updated with the parent universe's fleets speed.
  const rawFlightTimeSec = flightTimeMs / (1000 * ratio);

  // Now we can compute the total consumption by summing
  // the individual consumptions of ships.
  let consumption = [];

  for (let id = 0 ; id < ships.length ; ++id) {
    const s = ships[id];
    const engine = selectEngine(s, technologies);
    const speed = computeSpeed(engine, technologies);

    for (let idC = 0 ; idC < s.consumption.length ; ++idC) {
      const fuel = s.consumption[idC];

      // The values and formulas are extracted from here:
      // https://ogame.fandom.com/wiki/Talk:Fuel_Consumption
      // Note that in case the speed of the ship is set to
      // `0` we will consider that it does not contribute
      // to any consumption.
      if (speed === 0) {
        continue;
      }

      const sk = 35000.0 * Math.sqrt(distance * 10.0 / speed) / (rawFlightTimeSec - 10.0);
      const cons = fuel.amount * s.count * distance * Math.pow(1.0 + sk / 10.0, 2.0) / 35000.0;

      let ex = consumption.findIndex(c => c.resource === fuel.resource);
      if (ex === -1) {
        consumption.push({
          resource: fuel.resource,
          amount: cons,
        });
      }
      else {
        consumption[ex].amount += cons;
      }
    }
  }

  // Handle the deployment time of the fleet.
  if (deploymentTimeMs > 0) {
    // For each ship, add the consumption knowing that the
    // deployment time is expressed in seconds.
    const dTimeH = deploymentTimeMs / (3600.0 * 1000.0);

    for (let id = 0 ; id < ships.length ; ++id) {
      const s = ships[id];

      for (let idC = 0 ; idC < s.deployment_cost.length ; ++idC) {
        const fuel = s.deployment_cost[idC];
        const cons = fuel.amount * dTimeH * s.count;

        let ex = consumption.findIndex(c => c.resource === fuel.resource);
        if (ex === -1) {
          consumption.push({
            resource: fuel.resource,
            amount: cons,
          });
        }
        else {
          consumption[ex].amount += cons;
        }
      }
    }
  }

  // Save the data in the fleet itself. We will also
  // use the consumption ratio to scale the amount of
  // fuel needed.
  for (let id = 0 ; id < consumption.length ; ++id) {
    consumption[id].amount *= conso;
  }

  return consumption;
}

export function computeMaxSpeed(ships, technologies) {
  // Compute the maximum speed of the fleet. This will
  // correspond to the speed of the slowest ship in the
  // component.
  // This link describes how to do it:
  // https://www.w3schools.com/jsref/jsref_max_value.asp
  let maxSpeed = Number.MAX_VALUE;

  for (let id = 0 ; id < ships.length ; ++id) {
    const s = ships[id];
    const engine = selectEngine(s, technologies);
    const speed = computeSpeed(engine, technologies);

    if (speed < maxSpeed) {
      maxSpeed = speed;
    }
  }

  return maxSpeed;
}
