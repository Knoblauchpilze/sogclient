
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
