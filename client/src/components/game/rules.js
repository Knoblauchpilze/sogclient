
export function computeProduction(rule, level, temp, ratio) {
  // Compute both parts of the production (temperature
  // dependent and independent).
  const tempDep = rule.temp_offset + temp * rule.temp_coeff;
  const tempIndep = rule.init_production * level * Math.pow(rule.progression, level);

  return ratio * tempDep * tempIndep;
}

export function computeStorage(rule, level) {
  const factor = rule.multiplier * Math.exp(rule.progress * level);
  return rule.init_storage * Math.floor(factor);
}

export function computeFleetSlots(technologies) {
  // Fetch the level of the `computes` technology.
  const comp = technologies.find(t => t.name === "computers");
  const ast = technologies.find(t => t.name === "astrophysics");

  // Compute fleet slots, and then expedition slots. Formulas
  // are taken from here: https://ogame.fandom.com/wiki/Astrophysics
  let fleets = 0;
  if (comp) {
    fleets = comp.level + 1;
  }

  let expeditions = 0;
  if (ast) {
    expeditions = Math.floor(Math.sqrt(ast.level));
  }

  return {
    fleets: fleets,
    expeditions: expeditions,
  };
}

export function computePlanetsSlots(technologies) {
  // Fetch the level of the `astrophysics` technology.
  const ast = technologies.find(t => t.name === "astrophysics");
  if (!ast) {
    // No astrophysics technology, assume only one planet
    // is possible (the homeworld).
    return 1;
  }

  return Math.floor(2 + (ast.level - 1) / 2);
}
