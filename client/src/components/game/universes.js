
// Fecthing status.
const UNIVERSES_FETCH_SUCCEEDED = "Universes fetched";
const UNIVERSES_FETCH_FAILURE = "Failed to fetch universes";

const RANKINGS_FETCH_SUCCEEDED = "Rankings fetched";
const RANKINGS_FETCH_FAILURE = "Failed to fetch rankings";

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

  async fetchRankings(uni) {
    // Fetch universes from the server and discriminate
    // on the request's result.
    let out = {
      status: RANKINGS_FETCH_FAILURE,
      universe: uni,
      rankings: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.rankingsURL(uni))
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch rankings: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = RANKINGS_FETCH_SUCCEEDED;

    // Extract rankings into a meaningful object.
    const rawRankings = await res.text();
    out.rankings = JSON.parse(rawRankings);

    return out;
  }

  async fetchAllRankings(unis) {
    const out = [];

    for (let id = 0 ; id < unis.length ; ++id) {
      const res = await this.fetchRankings(unis[id]);
      out.push(res);
    }

    return out;
  }
}

export {
  UNIVERSES_FETCH_SUCCEEDED,
  RANKINGS_FETCH_SUCCEEDED,
};

export default UniversesModule;
