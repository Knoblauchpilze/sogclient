
// Registration status.
const UNIVERSES_FETCH_SUCCEEDED = "Universes fetched";
const UNIVERSES_FETCH_FAILURE = "Failed to fetch universes";

class UniversesModule {
  constructor(server) {
    this.server = server;
  }

  async fetchUniverses() {
    // Fetch universes from the server and discriminate
    // on the request's result.
    let out = {
      status: UNIVERSES_FETCH_FAILURE,
      universes: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.universesURL())
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch universes: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = UNIVERSES_FETCH_SUCCEEDED;

    // Extract universes into a meaningful object.
    const rawUniverses = await res.text();
    out.universes = JSON.parse(rawUniverses);

    return out;
  }
}

export {
  UNIVERSES_FETCH_SUCCEEDED,
};

export default UniversesModule;
