
// List of possible validation.
const SESSION_FETCH = "fetch_session";
const EXISTENCE_VERIFICATION = "duplicate";

// Validation status.
const VALID_SESSION = "Session is valid";
const VALIDATION_FAILURE = "Failed to perform validation";
const INVALID_SESSION = "Invalid session data";
const DUPLICATED_SESSION = "Session already exists";
const SESSION_NOT_FOUND = "Session does not exist";

// Registration status.
const SESSIONS_FETCH_SUCCEEDED = "Sessions fetched";
const SESSIONS_FETCH_FAILURE = "Failed to fetch sessions";

const SESSION_FETCH_SUCCEEDED = "Session fetched";
const SESSION_FETCH_FAILURE = "Failed to fetch session";

const SESSION_REGISTRATION_SUCCEEDED = "Registration succeeded";
const SESSION_REGISTRATION_FAILURE = "Failed to perform registration";

class SessionsModule {
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

  async validate(session, operation) {
    let res = {
      session: session,
      status: INVALID_SESSION,
    };

    // In case the session is not valid, do nothing.
    // We consider no name as valid as the server
    // will generate one anyway.
    if (session.account === "" || session.universe === "") {
      return res;
    }

    // Fetch sessions.
    let reqStatus = "";
    const out = await this.fetchSessions(session.account).catch(err => reqStatus = err);

    // In case the fetching failed, do nothing.
    if (out.status !== SESSIONS_FETCH_SUCCEEDED) {
      console.error("Failed to fetch sessions: " + out.status);
      res.status = VALIDATION_FAILURE;
      return res;
    }
    if (reqStatus !== "") {
      res.status = reqStatus;
      return res;
    }

    // Attempt to find this session in the list fetched
    // from the server.
    const foundSess = out.sessions.find(s => s.account === session.account && s.universe === session.universe);

    // Return the validation status based on the type of
    // operation to perform on the session.
    res.status = VALID_SESSION;
    if (operation === EXISTENCE_VERIFICATION) {
      if (foundSess) {
        res.status = DUPLICATED_SESSION;
      }
    }
    if (operation === SESSION_FETCH) {
      if (!foundSess) {
        res.status = SESSION_NOT_FOUND;
      }
    }

    // Update the session with the found session if the
    // status indicates that it is valid and a fetch is
    // requested.
    if (res.status === VALID_SESSION && operation === SESSION_FETCH) {
      res.session = foundSess;
    }

    return res;
  }

  async fetch(session) {
    let res = {
      session: session,
      status: SESSION_FETCH_FAILURE,
    };

    // Validate the session first (to make sure it's not
    // already an existing one).
    const valid = await this.validate(session, SESSION_FETCH);
    if (valid.status !== VALID_SESSION) {
      res.status = valid.status;
      return res;
    }

    res.status = SESSION_FETCH_SUCCEEDED;
    res.session = valid.session;

    return res;
  }

  async registerSession(sess) {
    let out = {
      id: "",
      status: SESSION_REGISTRATION_FAILURE,
    };

    // Generate data to send to the server to register
    // the session.
    const formData  = new FormData();
    formData.append(this.server.playersDataKey(), JSON.stringify(sess));

    let opts = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    };

    // Execute the request.
    let reqStatus = "";

    const res = await fetch(this.server.playersURL(), opts)
      .catch(err => reqStatus = err);

    if (reqStatus !== "") {
      out.status = reqStatus;
      return out;
    }

    if (!res.ok) {
      out.status = await res.text();
      return out;
    }

    // Fetch the identifier returned by the server.
    // It is returned through a format that is not
    // exactly pure so we clean it through a server
    // dedicated method.
    const id = await res.text();
    out.id = this.server.playerIDFromResponse(id);
    out.status = SESSION_REGISTRATION_SUCCEEDED;

    return out;
  }

  async register(session) {
    let out = {
      id: "",
      status: SESSION_REGISTRATION_FAILURE,
    };

    // Validate the session first (to make sure it's not
    // already an existing one).
    const valid = await this.validate(session, EXISTENCE_VERIFICATION);
    if (valid.status !== VALID_SESSION) {
      out.status = valid.status;
      return out;
    }

    // Register session.
    let reqStatus = "";
    const res = await this.registerSession(session).catch(err => reqStatus = err);

    // In case the resitration failed, return the status.
    if (res.status !== SESSION_REGISTRATION_SUCCEEDED) {
      out.status = res.status;
      return out;
    }
    if (reqStatus !== "") {
      out.status = reqStatus;
      return out;
    }

    if (res.id === "") {
      return out;
    }

    out.id = res.id;
    out.status = SESSION_REGISTRATION_SUCCEEDED;

    return out;
  }
}

export {
  SESSIONS_FETCH_SUCCEEDED,
  SESSION_FETCH_SUCCEEDED,
  SESSION_REGISTRATION_SUCCEEDED,
};

export default SessionsModule;
