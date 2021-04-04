
import '../styles/Lobby.css';
import React from 'react';
import Server from './server.js';
import { NullAccount } from './server.js';

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

/**
 * @brief - Used to save the account selected by the user to local storage.
 * @param acc - defines the account to persist to local storage.
 * @param persist - `true` if the account should be persisted. In case this
 *                  value is `false` the local storage will be erased.
 */
function saveAccount(acc, persist) {
  // Only save the account if it exists, otherwise
  // remove it from local storage.
  if (!persist) {
    localStorage.removeItem("account");

    console.log("Removing saved account");
    return;
  }

  const out = JSON.stringify(acc);
  localStorage.setItem("account", out);

  console.log("Saving account " + out);
}

/**
 * @brief - Used to save the session selected by the user to local storage.
 * @param sess - defines the session to persist to local storage.
 * @param persist - `true` if the account should be persisted. In case this
 *                  value is `false` the local storage will be erased.
 */
function saveSession(sess, persist) {
  // Only save the session if it exists, otherwise
  // remove it from local storage.
  if (!persist) {
    localStorage.removeItem("session");

    console.log("Removing saved session");
    return;
  }

  const out = JSON.stringify(sess);
  localStorage.setItem("session", out);

  console.log("Saving session " + out);
}

/**
 * @brief - USed to perform the validation of the input account
 *          against data registered in the server. The caller
 *          is expected to provide two callbacks: one will be
 *          used in case the account could be validated and the
 *          other in case the account couldn't be validated or
 *          if an error occurred while validating it.
 * @param server - the server to contact to validate the data.
 * @param acc - the account to validate.
 * @param operation - the operation to perform for this account.
 *                    Will be passed on to the callbacks.
 * @param cb - the callback to use in case of success.
 * @param cbErr - the error callback.
 */
function fetchAccounts(server, acc, operation, cb, cbErr) {
  console.log("acc: " + JSON.stringify(acc));
  // Make sure the input account is valid.
  if (acc.mail === "" || acc.password === "") {
    return;
  }

  console.log("huhu");

  // First, fetch the accounts available on the server.
  fetch(server.accountsURL())
    .then(function (res) {
      if (!res.ok) {
        res.text().then(text => cbErr(text, operation));
        return;
      }

      console.log("hihi " + res.text);
      
      // We successfully fetched the accounts, handle
      // the validation in itself.s
      res.text().then(function(text) {
        // Search the account we're expecting to find.
        const accounts = JSON.parse(text);
        const foundAcc = accounts.find(a => a.mail === acc.mail);

        console.log("acc: " + JSON.stringify(text) + ", found: " + JSON.stringify(foundAcc));

        // We will let the user decide whether it is
        // normal to (not) find the account in the
        // list returned by the server.
        cb(acc, foundAcc, operation);
      });
    })
    .catch(res => res.text().then(text => cbErr(text, operation)));
}

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    // Check whether the user already has a saved
    // account: if this is the case we will show
    // the session choosing panel. Otherwise we
    // need to propose to register.
    const savedAccount = localStorage.getItem("account");
    const account = savedAccount ? JSON.parse(savedAccount) : NullAccount;
    const hasAccount = account.mail !== "" && account.password !== "";

    // Similarly, we will check whether an active
    // session can be found: this only occurs in
    // case an active account was found.
    const savedSession = null;/*localStorage.getItem("session");*/
    const defSession = {
      id: "",
      account: "",
      universe: "",
      name: "",
    };
    const session = savedSession ? JSON.parse(savedSession) : defSession;
    const hasSession = session.universe !== "" && session.player !== "";

    this.state = {
      // Defines the URL to use to contact the
      // server.
      server: new Server(),

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

      // Defines whether or not the account should
      // be saved to local storage so that it can
      // be restored afterwards (on the next user
      // log in mainly).
      autologin: false,

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

    // If the user already has an account, handle the
    // automatic login.
    // if (this.state.hasAccount) {
    //   this.requestLogin();
    // }
  }

  /**
   * @brief - Called whenever all the processing regarding an
   *          account has been handled (verification against
   *          the server's data or registration if needed).
   *          The goal here is to update the internal state
   *          machine to move to the next step of the login
   *          where the user can select a universe where the
   *          account is registered.
   * @param acc - the successfully validated account.
   */
  onAccountValidated(acc) {
    // Update internal state.
    this.setState({
      step: "session",
      hasAccount: true,
      account: acc,
    });

    // Save account to local storage for automatic login on
    // subsequent connections.
    saveAccount(acc, this.state.autologin);

    console.log("Account " + JSON.stringify(acc) + " validated");
  }

  /**
   * @brief - Callback used whenever the response from the
   *          server is received to validate the account's
   *          data before proceeding further.
   * @param inAcc - the account that we wanted to validate.
   * @param foundAcc - the account returned by the server:
   *                   it can be `null` in case the account
   *                   needs to be created rather than verified.
   * @param operation - defines a string representing the type
   *                    of operation that was performed.
   */
  onAccountFetched(inAcc, foundAcc, operation) {
    var lobby = this;

    if (operation === "register" && foundAcc) {
      // We wanted to create the account but one with the same
      // email address already exists: we won't be able to use
      // this account.
      lobby.setState({ hasAccount: false });

        // TODO: Account already exist, build a dialog.
      alert("Account already exists");
    }
    else if (operation === "register") {
      // We want to create an account and it does not exist in
      // the server: we can proceed.
      // See here as to why we need to save this to
      // a local variable:
      // https://expertcodeblog.wordpress.com/2017/12/28/typescript-call-a-this-function-inside-class-method-when-using-promises/
      lobby.state.server.registerAccount(
        inAcc,
        function (res) {
          lobby.onAccountValidated(inAcc);
        },
        (res) => alert(res)
      );
    }
    else if (operation === "signin" && !foundAcc) {
      // We wanted to verify that the account we valid in the
      // server but it does not seem to be the case.
      lobby.setState({
        hasAccount: false,
        account: NullAccount,
      });

      alert("Account does not exist in the server");

    }
    else if (operation === "signin" && foundAcc && foundAcc.password !== inAcc.password) {
      // The account exist but the password is not valid, we
      // need to force the user to re-enter the data.
      inAcc.password = "";
      lobby.setState({
        account: inAcc
      });

      alert("Invalid password for account");
    }
    else {
      // The account exists and the credentials match, we can
      // move on to the next step (which is selected the game
      // associated to the account).
      lobby.onAccountValidated(inAcc);
    }
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
      console.log("Unable to validate session " + JSON.stringify(session));
      return;
    }

    console.log("Validated session " + JSON.stringify(found));

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

    // Attempt to validate the sessions through the server.
    fetch(this.state.server.playersURL()).then(
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
        account.name = text;
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
            <div className="lobby_session_group lobby_session_item">
              <span>E-mail address:</span>
              {this.state.accountMode === "signin" && <a href="TODO: Get back email">Forgot your e-mail ?</a>}
              <input
                placeholder = "Fill in your e-mail"
                onChange = {(e) => this.handleInput("mail", e.target.value)}
              />
            </div>
            <div className="lobby_session_group lobby_session_item">
              <span>Password:</span>
              {this.state.accountMode === "signin" && <a href="TODO: Get back email">Forgot your password ?</a>}
              <input
                placeholder = "Fill in your password"
                onChange = {(e) => this.handleInput("password", e.target.value)}
              />
            </div>
            <div className="lobby_session_item">
              <input type="checkbox"
                     onChange={(e) => this.setState({autologin: e.target.checked})}
                     key="autologin_checkbox"
                     name="haha"
                     checked={this.state.autologin}
              />
              <label htmlFor={"autologin_checkbox"}>Login automatically</label>
            </div>
            <button
              className="lobby_button lobby_play"
              onClick = {() => fetchAccounts(
                this.state.server,
                this.state.account,
                this.state.accountMode,
                this.onAccountFetched,
                function (err, op) {
                  alert("Err: " + err + ", op: " + op);
                  console.log("merdasse: " + err);
                }
              )}>
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
