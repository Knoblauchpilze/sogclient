
// Fetch status.
const RESOURCES_FETCH_SUCCEEDED = "Resources fetched";
const RESOURCES_FETCH_FAILURE = "Failed to fetch resources";

class ResourcesModule {
  constructor(server) {
    this.server = server;
  }

  async fetchResources() {
    // Fetch resources from the server and discriminate
    // on the request's result.
    let out = {
      status: RESOURCES_FETCH_FAILURE,
      resources: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.resourcesURL())
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch resources: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = RESOURCES_FETCH_SUCCEEDED;

    // Extract resources into a meaningful object.
    const rawResources = await res.text();
    out.resources = JSON.parse(rawResources);

    return out;
  }
}

export {
  RESOURCES_FETCH_SUCCEEDED,
};

export default ResourcesModule;
