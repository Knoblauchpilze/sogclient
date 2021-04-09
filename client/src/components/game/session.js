
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

const NullSession = {
  id: "",
  account: "",
  universe: "",
  name: ""
};

export default Session;
export { NullSession };
