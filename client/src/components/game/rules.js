
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
