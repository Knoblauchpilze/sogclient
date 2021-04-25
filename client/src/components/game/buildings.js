
// Fecthing status.
const BUILDINGS_FETCH_SUCCEEDED = "Buildings fetched";
const BUILDINGS_FETCH_FAILURE = "Failed to fetch buildings";

class BuildingsModule {
  constructor(server) {
    this.server = server;
  }

  async fetchBuildings() {
    // Fetch buildigns from the server and discriminate
    // on the request's result.
    let out = {
      status: BUILDINGS_FETCH_FAILURE,
      buildings: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.buildingsURL())
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch buildings: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = BUILDINGS_FETCH_SUCCEEDED;

    // Extract buildings into a meaningful object.
    const rawBuildings = await res.text();
    out.buildings = JSON.parse(rawBuildings);

    return out;
  }
}

export {
  BUILDINGS_FETCH_SUCCEEDED,
};

export default BuildingsModule;
