
// Fecthing status.
const FLEET_OBJECTIVES_FETCH_SUCCEEDED = "Fleet objectives fetched";
const FLEET_OBJECTIVES_FETCH_FAILURE = "Failed to fetch fleet objectives";

class FleetObjectivesModule {
  constructor(server) {
    this.server = server;
  }

  async fetchObjectives() {
    // Fetch fleet objectives from the server and discriminate
    // on the request's result.
    let out = {
      status: FLEET_OBJECTIVES_FETCH_FAILURE,
      objectives: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.fleetObjectivesURL())
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch fleet objectives: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = FLEET_OBJECTIVES_FETCH_SUCCEEDED;

    // Extract objectives into a meaningful object.
    const rawObjectives = await res.text();
    out.objectives = JSON.parse(rawObjectives);

    return out;
  }
}

export {
  FLEET_OBJECTIVES_FETCH_SUCCEEDED,
};

export default FleetObjectivesModule;
