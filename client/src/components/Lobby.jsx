
import '../styles/Lobby.css';
import React from 'react';

function UniverseHeader() {
  return (
    <div className="lobby_universe_headers">
      <div className="lobby_universe_props">
        <div className="lobby_universe_header">Universe</div>
        <div className="lobby_universe_header">Country</div>
        <div className="lobby_universe_header">Online</div>
        <div className="lobby_universe_header">Kind</div>
        <div className="lobby_universe_header">Age</div>
        <div className="lobby_universe_header">Player</div>
        <div className="lobby_universe_header">Rank</div>
      </div>
    </div>
  );
}

function UniverseDesc(props) {
  return (
    <div className="lobby_universe_desc">
      <div className="lobby_universe_props">
        <div className="lobby_universe_value">{props.universe}</div>
        <div className="lobby_universe_value">{props.country}</div>
        <div className="lobby_universe_value">{props.online}</div>
        <div className="lobby_universe_value">{props.kind}</div>
        <div className="lobby_universe_value">{props.age}</div>
        {props.player !== "" && <div className="lobby_universe_value">{props.player}</div>}
        {props.player !== "" && <div className="lobby_universe_value">{props.rank}</div>}
      </div>
      <button onClick = {() => console.log("play")}>Play</button>
    </div>
  );
  // TODO: The onClick should trigger a request to the
  // validate session somehow.
}

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    // Check whether the user already has a saved
    // account: if this is the case we will show
    // the session choosing panel. Otherwise we
    // need to propose to register.
      // TODO: Restore this.
    const savedAccount = null;/*localStorage.getItem("account");*/
    const defAccount = {
      mail: "",
      password: "",
    };
    const account = savedAccount ? JSON.parse(savedAccount) : defAccount;
    const hasAccount = account.mail !== "" && account.password !== "";

    // Similarly, we will check whether an active
    // session can be found: this only occurs in
    // case an active account was found.
    const savedSession = null;/*localStorage.getItem("session");*/
    const defSession = {
      universe: "",
      player: "",
    };
    const session = savedSession ? JSON.parse(savedSession) : defSession;
    const hasSession = session.universe !== "" && session.player !== "";

    this.state = {
      // Defines the current step in the lobby: it
      // helps guide the user's journey with first
      // the selection of its account ("account")
      // then the selection of the session within
      // this account ("session") and potentially
      // the "game" selection where the user can
      // choose to join a new universe.
      // Note that the game state should trigger
      // an exit from this menu.
      step: "account",

      // Defines whether the user is currently trying
      // to define an account or to register to some
      // existing one. Can either be "signin" in case
      // the user wants to log in to a pre-existing
      // account or "register" in case a new account
      // should be created.
      accountMode: "signin",
      hasAccount: hasAccount,
      account: account,

      // Defines whether the user is currently trying
      // to define a new session or to restore an
      // existing one from the local data. Can either
      // be "restore" or "create".
      sessionMode: "restore",
      hasSession: hasSession,
      session: session,
    };
  }

  /**
   * @brief - Used to save the account selected by
   *          the user to local storage.
   */
  saveAccount() {
    const out = JSON.stringify(this.state.account);
    localStorage.setItem("account", out);

    console.log("Saving account " + out);
  }

  /**
   * @brief - Used to save the session selected by
   *          the user to local storage.
   */
  saveSession() {
    const out = JSON.stringify(this.state.session);
    localStorage.setItem("session", out);

    console.log("Saving session " + out);
  }

  /**
   * @brief - Callback used whenever the response from the
   *          server is received to validate the account's
   *          data before proceeding further.
   * @param rawAccounts - the list of accounts returned by
   *                      the server. This is returned as
   *                      a raw object (not yet parsed).
   */
  onAccountValidated(rawAccounts) {
    // Decode the response.
    const accounts = JSON.parse(rawAccounts);

    // Search the account we're expecting to find.
    const account = this.state.account;
    const found = accounts.find(a => a.mail === account.mail && a.password === account.password);

    // In case the account was not found, display
    // an error.
    if (!found) {
      console.log("Unable to validate account " + account);
      return;
    }

    console.log("Validated account " + found);

    // The user now has an account.
    this.setState({
      step: "session",
      hasAccount: true,
      account: found,
    });
  }

  /**
   * @brief - Callback used whenever the response from the
   *          server to validate the account is rejected by
   *          the server.
   * @param err - the failure returned by the server.
   */
  onAccountRejected(err) {
    // TODO: Handle error.
  }

  /**
   * @brief - Callback used whenever the response from the
   *          server is received to validate the session's
   *          data before proceeding further.
   */
  onSessionValidated(rawSessions) {
    // Decode the response.
    const sessions = JSON.parse(rawSessions);

    // Search the session we're expecting to find.
    const session = this.state.session;
    const found = sessions.find(s => s.universe === session.universe && s.account === session.player);

    // In case the account was not found, display
    // an error.
    if (!found) {
      console.log("Unable to validate session " + session);
      return;
    }

    console.log("Validated session " + found);

    // The user now has a session.
    this.setState({
      step: "game",
      hasSession: true,
      session: found,
    });
  }

  /**
   * @brief - Callback used whenever the response from the
   *          server to validate the session is rejected by
   *          the server.
   * @param err - the failure returned by the server.
   */
  onSessionRejected(err) {
    // TODO: Handle error.
  }

  /**
   * @brief - Used to generate the request to the server
   *          to either create or validate the account
   *          defined by the user.
   */
  requestLogin() {
    // Make sure that the account is valid.
    const account = this.state.account;

    if (account.mail === "" || account.password === "") {
      console.log("No account");
      return;
    }

    // Attempt to validate the accounts through the server.
    fetch("http://localhost:3001/accounts").then(
      res => res.text().then(
        data => this.onAccountValidated(data)
      )
    ).catch(
      res => res.text().then(
        data => this.onAccountRejected(data)
      )
    );
  }

  /**
   * @brief - Used to generate the request to the server to
   *          either create or validate the session defined
   *          by the user.
   */
  requestSession() {
    // Make sure the session is valid: in case it is
    // not we will assume the user wants to create a
    // new one.
    const session = this.state.session;

    if (session.universe === "" || session.player === "") {
      this.setState({sessionMode: "create"})
      return;
    }

    // TODO: Should handle validation of session.
    console.log("Validating session " + JSON.Stringify(session));
    this.onSesionValidated();

    // Attempt to validate the accounts through the server.
    fetch("http://localhost:3001/players").then(
      res => res.text().then(
        data => this.onSesionValidated(data)
      )
    ).catch(
      res => res.text().then(
        data => this.onSessionRejected(data)
      )
    );
  }

  /**
   * @brief - Main render function: based on the current
   *          step reached by the user in the logging
   *          journey we will display the corresponding
   *          menu.
   */
  render() {
    return (
      this.state.step === "account" ? this.logInOrRegister() :
      // Assume this.state.step === "session"
      // Check whether the session creation mode is
      // set to create a new one or load an existing
      // one.
      this.state.sessionMode === "restore" ? this.selectGame() :
      // Assume this.state.sessionMode === "create"
      this.createGame()
    );
  }

  /**
   * @brief - Used whenever the user enters some new data
   *          to fill in one of the field available in the
   *          lobby. Depending on the current step reached
   *          in the log in journey the correct element
   *          will be populated with the text.
   */
  handleInput(kind, text) {
    // Check whether we should populate the account or the
    // session data.
    if (this.state.step === "account") {
      const account = this.state.account;

      if (kind === "mail") {
        account.mail = text;
        this.setState({account: account});
      }
      else {
        // Assume password.
        account.password = text;
        this.setState({account: account});
      }

      return;
    }

    // Assume the session should be populated.
    const session = this.state.session;

    if (kind === "universe") {
      session.universe = text;
      this.setState({session: session});
    }
    else {
      // Assume player.
      session.player = text;
      this.setState({session: session});
    }
  }

  /**
   * @brief - Handles the creation of the menu related to
   *          the creation of a new account or the login
   *          process on an existing account.
   */
  logInOrRegister() {
    return (
      <div className="lobby_layout">
        <div className="lobby_session_options">
          <div className="lobby_session_actions">
            <button
              className={this.state.accountMode === "signin" ? "lobby_action_button_selected" : "lobby_action_button"}
              onClick = {() => this.setState({accountMode: "signin"})}
              >
              Sign in
            </button>
            <button
              className={this.state.accountMode === "register" ? "lobby_action_button_selected" : "lobby_action_button"}
              onClick = {() => this.setState({accountMode: "register"})}
              >
              Register
            </button>
          </div>
          <div className="lobby_session_items">
            <div className="lobby_session_item">
              <span>E-mail address:</span>
              {this.state.accountMode === "signin" && <a href="TODO: Get back email">Forgot your e-mail ?</a>}
              <input
                placeholder = "Fill in your e-mail"
                onChange = {(e) => this.handleInput("mail", e.target.value)}
              />
            </div>
            <div className="lobby_session_item">
              <span>Password:</span>
              {this.state.accountMode === "signin" && <a href="TODO: Get back email">Forgot your password ?</a>}
              <input
                placeholder = "Fill in your password"
                onChange = {(e) => this.handleInput("password", e.target.value)}
              />
            </div>
            <button className="lobby_button lobby_play" onClick = {() => this.requestLogin()}>
              {this.state.accountMode === "signin" ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * @brief - Handles the choice between loading the last
   *          session of an account (if it exists) or the
   *          creation of a new session.
   */
  selectGame() {
    return (
      <div className="lobby_layout">
        <div className="lobby_options">
          <button className="lobby_button lobby_play" onClick = {() => this.requestSession()}>Play</button>
          <button className={this.state.hasSession ? "lobby_button lobby_last_session" : "lobby_button lobby_last_session_disabled"} onClick = {() => this.state.hasSession && this.requestSession()}>Last session</button>
        </div>
      </div>
    );
  }

  /**
   * @brief - Handles the creation of the menu representing
   *          the available universe into which the user is
   *          able to create a new session.
   */
  createGame() {
    return (
      <div className="lobby_layout lobby_game_selection">
        <div className="lobby_game_group">
          <p className="lobby_game_group_title">Your universes</p>
          <UniverseHeader />
          <UniverseDesc universe={"Libra"}
                        country={"France"}
                        online={54}
                        kind={"Balanced"}
                        age={1933}
                        player={"tttttttttttttttttttt"}
                        rank={1383}
                        />
        </div>
        <div className="lobby_game_group">
          <p className="lobby_game_group_title">Start in a new universe</p>
          <UniverseHeader />
          <UniverseDesc universe={"Zenith"}
                        country={"France"}
                        online={339}
                        kind={"Balanced"}
                        age={18}
                        player={""}
                        rank={0}
                        />
          <UniverseDesc universe={"Ymir"}
                        country={"France"}
                        online={418}
                        kind={"Peaceful"}
                        age={61}
                        player={""}
                        rank={0}
                        />
        </div>
        <div className="lobby_back_section">
          <button className="lobby_game_back" onClick = {() => this.setState({sessionMode: "restore"})}>Back</button>
        </div>
      </div>
    );
  }
}

export default Lobby
