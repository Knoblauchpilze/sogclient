
// Fetch status.
const SHIPS_FETCH_SUCCEEDED = "Ships fetched";
const SHIPS_FETCH_FAILURE = "Failed to fetch ships";

class ShipsModule {
  constructor(server) {
    this.server = server;
  }

  async fetchShips() {
    // Fetch ships from the server and discriminate
    // on the request's result.
    let out = {
      status: SHIPS_FETCH_FAILURE,
      ships: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.shipsURL())
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch ships: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = SHIPS_FETCH_SUCCEEDED;

    // Extract ships into a meaningful object.
    const rawShips = await res.text();
    out.ships = JSON.parse(rawShips);

    return out;
  }
}

export {
  SHIPS_FETCH_SUCCEEDED,
};

export default ShipsModule;
