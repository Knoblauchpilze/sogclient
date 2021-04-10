
// Defines a balanced universe kind.
const BALANCED_UNIVERSE = "balanced";

// Defines a peaceful universe kind.
const MILITARY_UNIVERSE = "military";

// Defines a military universe kind.
const PEACEFUL_UNIVERSE = "peaceful";

function determineKind(uni) {
  const ms = uni.fleet_speed;
  const es = uni.economic_speed;
  const rs = uni.research_speed;

  const avgME = (ms + es) / 2.0;
  const avgMR = (ms + rs) / 2.0;
  const avgER = (es + rs) / 2.0;

  const ratioMER = ms / avgER;
  const ratioEMR = es / avgMR;
  const ratioRME = rs / avgME;

  // Peaceful universe in case the ratio
  // of military speed on other speeds is
  // less than `0.2`.
  if (ratioMER <= 0.2) {
    return PEACEFUL_UNIVERSE;
  }

  // Military universe in case the ratio
  // of military speed on other speeds is
  // higher than `0.8`.
  if (ratioMER >= 0.8) {
    return MILITARY_UNIVERSE;
  }

  // Balanced universe in case the ratio
  // of economic speed on other speeds is
  // smaller than `1.0`.
  if (ratioEMR < 1.0) {
    return BALANCED_UNIVERSE;
  }

  // Peaceful universe in case the ratio
  // of research speed on other speeds is
  // larger than `1.2`.
  if (ratioRME > 1.2) {
    return PEACEFUL_UNIVERSE;
  }

  // Default is balanded.
  return BALANCED_UNIVERSE;
}

class Universe {
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.country = props.country;
    this.online = "TODO";
    this.kind = determineKind(props);
    this.age = props.age;
  }

  valid() {
    return this.id !== "";
  }

}

export {
  BALANCED_UNIVERSE,
  MILITARY_UNIVERSE,
  PEACEFUL_UNIVERSE
};

export default Universe;
