
// Fetch status.
const DEFENSES_FETCH_SUCCEEDED = "Defenses fetched";
const DEFENSES_FETCH_FAILURE = "Failed to fetch defenses";

class DefensesModule {
  constructor(server) {
    this.server = server;
  }

  async fetchDefenses() {
    // Fetch defenses from the server and discriminate
    // on the request's result.
    let out = {
      status: DEFENSES_FETCH_FAILURE,
      defenses: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.defensesURL())
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch defenses: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = DEFENSES_FETCH_SUCCEEDED;

    // Extract defenses into a meaningful object.
    const rawDefenses = await res.text();
    out.defenses = JSON.parse(rawDefenses);

    return out;
  }
}

export {
  DEFENSES_FETCH_SUCCEEDED,
};

export default DefensesModule;
