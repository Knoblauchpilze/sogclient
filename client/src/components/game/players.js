
// Fetch status.
const PLAYERS_FETCH_SUCCEEDED = "Players fetched";
const PLAYERS_FETCH_FAILURE = "Failed to fetch players";

class PlayersModule {
  constructor(server) {
    this.server = server;
  }

  async fetchPlayersForUniverse(universe) {
    // Fetch players from the server and discriminate
    // on the request's result.
    let out = {
      status: PLAYERS_FETCH_FAILURE,
      players: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.playersForUniverse(universe))
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch players: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = PLAYERS_FETCH_SUCCEEDED;

    // Extract players into a meaningful object.
    const rawPlayers = await res.text();
    out.players = JSON.parse(rawPlayers);

    return out;
  }
}

export {
  PLAYERS_FETCH_SUCCEEDED,
};

export default PlayersModule;
