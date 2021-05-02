
class Server {
  constructor() {
    this.url = "http://localhost";
    this.port = 3001;
  }

  serverURL() {
    return this.url + ":" + this.port;
  }

  accountsURL() {
    return this.serverURL() + "/accounts";
  }

  accountsDataKey() {
    return "account-data";
  }

  accountURL(id) {
    return this.accountsURL() + "/" + id + "/players";
  }

  accountIDFromResponse(response) {
    // The response is expected to look like so:
    // '"[/accounts/id]"'. So first trim until
    // the beginning of the identifier.
    const parts = response.split('/');
    const idAndExtra = parts[parts.length - 1];

    // And then clean the end of the string.
    return idAndExtra.slice(0, idAndExtra.length - 2);
  }

  playersURL() {
    return this.serverURL() + "/players";
  }

  playerURL(id) {
    return this.playersURL() + "/" + id;
  }

  playersDataKey() {
    return "player-data";
  }

  playerIDFromResponse(response) {
    // The response is expected to look like so:
    // '"[/players/id]"'. So first trim until
    // the beginning of the identifier.
    const parts = response.split('/');
    const idAndExtra = parts[parts.length - 1];

    // And then clean the end of the string.
    return idAndExtra.slice(0, idAndExtra.length - 2);
  }

  universesURL() {
    return this.serverURL() + "/universes";
  }

  planetsURL(player) {
    return this.serverURL() + "/planets?player=" + player;
  }

  resourcesURL() {
    return this.serverURL() + "/resources";
  }

  buildingsURL() {
    return this.serverURL() + "/buildings";
  }

  technologiesURL() {
    return this.serverURL() + "/technologies";
  }

  upgradeActionDataKey() {
    return "action-data";
  }

  actionIDFromResponse(response) {
    // The response is expected to look like so:
    // '"[/accounts/id]"'. So first trim until
    // the beginning of the identifier.
    const parts = response.split('/');
    const idAndExtra = parts[parts.length - 1];

    // And then clean the end of the string.
    return idAndExtra.slice(0, idAndExtra.length - 2);
  }

  buildingUpgradeAction(planet) {
    return this.serverURL() + "/planets/" + planet + "/actions/buildings";
  }

  technologyUpgradeAction(planet) {
    return this.serverURL() + "/planets/" + planet + "/actions/technologies";
  }
}

const NullAccount = {
  id: "",
  name: "",
  mail: "",
  password: "",
};

export default Server;
export { NullAccount };
