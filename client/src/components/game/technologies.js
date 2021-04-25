
// Fetch status.
const TECHNOLOGIES_FETCH_SUCCEEDED = "Technologies fetched";
const TECHNOLOGIES_FETCH_FAILURE = "Failed to fetch technologies";

class TechnologiesModule {
  constructor(server) {
    this.server = server;
  }

  async fetchTechnologies() {
    // Fetch technologies from the server and discriminate
    // on the request's result.
    let out = {
      status: TECHNOLOGIES_FETCH_FAILURE,
      technologies: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.technologiesURL())
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch technologies: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = TECHNOLOGIES_FETCH_SUCCEEDED;

    // Extract technologies into a meaningful object.
    const rawTechnologies = await res.text();
    out.technologies = JSON.parse(rawTechnologies);

    return out;
  }
}

export {
  TECHNOLOGIES_FETCH_SUCCEEDED,
};

export default TechnologiesModule;
