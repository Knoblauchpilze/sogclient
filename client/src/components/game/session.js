
import Universe from './universe.js';

class Session {
  constructor(props) {
    // Defines the base properties for a player: these values
    // must be provided by the input data.
    this.universe = props.universe;
    this.account = props.account;

    // Register additional properties: this will be populated
    // if available in the input data.
    this.player = "";
    this.name = "";
    this.rank = "";

    const {player, name, rank} = props;
    if (player) {
      this.player = player;
    }
    if (name) {
      this.name = name;
    }
    if (rank) {
      this.rank = rank;
    }
  }

  /**
   * @brief - Determine whether or not this player exists for
   *          now. This means that its identifier is set to a
   *          non zero value.
   */
  exists() {
    return this.player !== "";
  }

  valid() {
    return this.exists() && this.account !== "" && this.universe.valid();
  }

}

const NullSession = new Session({
  universe: new Universe({
    id: "",
    name: "",
    country: "",
    online: 0,
    kind: "",
    age: 0,

    fleet_speed: 1,
    economic_speed: 1,
    research_speed: 1,
  }),
  account: "",

  player: "",
  name: "",
  rank: -1,
});

export default Session;
export { NullSession };
