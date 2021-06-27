
// Defines a constant indicating that fetching the players
// for a universe succeeded.
const PLAYERS_FETCH_SUCCEEDED = "Players fetched";

// Indicates that fetching the players for a universe has
// failed.
const PLAYERS_FETCH_FAILURE = "Failed to fetch players";

// Defines a constant indicating that fetching the fleets
// for a list of planets succeeded.
const FLEETS_FETCH_SUCCEEDED = "Fleets fetching succeeded";

// Indicates that fetching the fleets for a list of some
// planets has failed.
const FLEETS_FETCH_FAILURE = "Failed to fetch fleets";

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

  async fetchFleetsForPlanet(universe, planet, source) {
    // Fetch fleets from the server and discriminate
    // on the request's result.
    let out = {
      status: FLEETS_FETCH_FAILURE,
      fleets: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.planetsFleetsURL(universe, planet, source))
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch fleets for \"" + planet + "\": " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = FLEETS_FETCH_SUCCEEDED;

    // Extract fleets into a meaningful object.
    const rawFleets = await res.text();
    out.fleets = JSON.parse(rawFleets);

    return out;
  }

  async fetchFleetsForPlayer(universe, planets) {
    // Fetch players from the server and discriminate
    // on the request's result.
    let out = {
      status: FLEETS_FETCH_SUCCEEDED,
      fleets: [],
    };

    for (let id = 0 ; id < planets.length ; ++id) {
      const fIn = await this.fetchFleetsForPlanet(universe, planets[id], false);
      const fOut = await this.fetchFleetsForPlanet(universe, planets[id], true);

      let incoming = fIn.fleets;
      let outgoing = fOut.fleets;

      if (fIn.status !== FLEETS_FETCH_SUCCEEDED) {
        console.error("Failed to fetch incoming fleets for planet \"" + planets[id] + "\": " + fIn.status);
        incoming = [];
        out.status = FLEETS_FETCH_FAILURE;
      }
      if (fOut.status !== FLEETS_FETCH_SUCCEEDED) {
        console.error("Failed to fetch outgoing fleets for planet \"" + planets[id] + "\": " + fIn.status);
        outgoing = [];
        out.status = FLEETS_FETCH_FAILURE;
      }

      out.fleets.push({
        planet: planets[id],
        incoming: incoming,
        outgoing: outgoing,
      });
    }

    return out;
  }
}

export {
  PLAYERS_FETCH_SUCCEEDED,
  FLEETS_FETCH_SUCCEEDED,
};

export default PlayersModule;
