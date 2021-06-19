
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

  playersForUniverse(universe) {
    return this.playersURL() + "?universe=" + universe;
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

  rankingsURL(uni) {
    return this.universesURL() + "/" + uni + "/rankings"
  }

  planetsURL(player) {
    return this.serverURL() + "/planets?player=" + player;
  }

  moonsURL(player) {
    return this.serverURL() + "/moons?player=" + player;
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

  shipsURL() {
    return this.serverURL() + "/ships";
  }

  defensesURL() {
    return this.serverURL() + "/defenses";
  }

  fleetObjectivesURL() {
    return this.serverURL() + "/fleets/objectives";
  }

  upgradeActionDataKey() {
    return "action-data";
  }

  actionIDFromResponse(response) {
    // The response is expected to look like so:
    // '"[/actions/id]"'. So first trim until
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

  shipUpgradeAction(planet) {
    return this.serverURL() + "/planets/" + planet + "/actions/ships";
  }

  defenseUpgradeAction(planet) {
    return this.serverURL() + "/planets/" + planet + "/actions/defenses";
  }

  productionUpdateDataKey() {
    return "planet-data";
  }

  planetIDFromResponse(response) {
    // The response is expected to look like so:
    // '"[/planets/id]"'. So first trim until
    // the beginning of the identifier.
    const parts = response.split('/');
    const idAndExtra = parts[parts.length - 1];

    // And then clean the end of the string.
    return idAndExtra.slice(0, idAndExtra.length - 2);
  }

  productionUpdate(planet) {
    return this.serverURL() + "/planets/" + planet + "/production";
  }

  galaxyURL(galaxy, system) {
    return this.serverURL() + "/planets?galaxy=" + galaxy + "&solar_system=" + system;
  }

  fleetsURL(acs) {
    return this.serverURL() + "/fleets" + (acs ? "/acs" : "");
  }

  fleetDataKey() {
    return "fleet-data";
  }

  fleetIDFromResponse(response) {
    // The response is expected to look like so:
    // '"[/fleets/id]"'. So first trim until
    // the beginning of the identifier.
    const parts = response.split('/');
    const idAndExtra = parts[parts.length - 1];

    // And then clean the end of the string.
    return idAndExtra.slice(0, idAndExtra.length - 2);
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
