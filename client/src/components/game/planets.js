
// Registration status.
const PLANETS_FETCH_SUCCEEDED = "Planets fetched";
const PLANETS_FETCH_FAILURE = "Failed to fetch planets";

class PlanetsModule {
  constructor(server) {
    this.server = server;
  }

  async fetchPlanets(player) {
    // Fetch planets from the server and discriminate
    // on the request's result.
    let out = {
      status: PLANETS_FETCH_FAILURE,
      planets: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.planetsURL(player))
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch planets: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = PLANETS_FETCH_SUCCEEDED;

    // Extract planets into a meaningful object.
    const rawPlanets = await res.text();
    out.planets = JSON.parse(rawPlanets);

    return out;
  }
}

export {
  PLANETS_FETCH_SUCCEEDED,
};

export default PlanetsModule;
