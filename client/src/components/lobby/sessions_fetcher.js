
// Registration status.
const SESSIONS_FETCH_SUCCEEDED = "Sessions fetched";
const SESSIONS_FETCH_FAILURE = "Failed to fetch sessions";

class SessionsFetcher {
  constructor(server) {
    this.server = server;
  }

  async fetchSessions(account) {
    // Fetch sessions from the server and discriminate
    // on the request's result.
    let out = {
      status: SESSIONS_FETCH_FAILURE,
      sessions: [],
    };

    let reqStatus = "";

    const res = await fetch(this.server.accountURL(account))
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      console.error("Failed to fetch sessions: " + reqStatus);
      return out;
    }
    if (!res.ok) {
      out.status = res.statusText;
      return out;
    }

    out.status = SESSIONS_FETCH_SUCCEEDED;

    // Extract sessions into a meaningful object.
    const rawSessions = await res.text();
    out.sessions = JSON.parse(rawSessions);

    return out;
  }
}

export {
  SESSIONS_FETCH_SUCCEEDED,
  SESSIONS_FETCH_FAILURE,
};

export default SessionsFetcher;
