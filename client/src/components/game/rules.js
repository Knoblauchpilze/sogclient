
export function computeProduction(rule, level, temp) {
  // Compute both parts of the production (temperature
  // dependent and independent).
  const tempDep = rule.temp_offset + temp * rule.temp_coeff;
  const tempIndep = rule.init_production * level * Math.pow(rule.progression, level);

  return tempDep * tempIndep;
};
