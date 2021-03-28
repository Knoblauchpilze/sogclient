
import '../styles/Lobby.css';
import React from 'react';

class Lobby extends React.Component {

  constructor(props) {
    super(props);

    // Check whether the user already has a saved
    // session: if this is the case we will show
    // the game choosing panel otherwise we need
    // to propose to register.
      // TODO: Restore this.
    const save = null;/*localStorage.getItem("session");*/
    const def = {
      mail: "",
      password: "",
    };

    this.state = {
      hasSession: save ? true : false,
      session: save ? JSON.parse(save) : def,
      mode: "signin",
    };
  }

  saveSession() {
    const out = JSON.stringify(this.state.session);
    localStorage.setItem("session", out);

    console.log("Saving session " + out);
  }

  handleInput(mode, text) {
    const session = this.state.session;

    if (mode === "mail") {
      session.mail = text;
      this.setState({session: session});
    }
    else {
      // Assume password.
      session.password = text;
      this.setState({session: session});
    }

    console.log("Session: " + JSON.stringify(this.state));
  }

  loginToSession() {
    // Make sure that the session is valid.
    const session = this.state.session;

    if (session.mail === "" || session.password === "") {
      console.log("No session");
      return;
    }

    console.log("A session, yay: mail: " + session.mail + ", pwd: " + session.password);
  }

  render() {
    return (this.state.hasSession ? this.restoreLastSession() : this.createSession());
  }

  createSession() {
    return (
      <div className="lobby_layout">
        <div className="lobby_session_options">
          <div className="lobby_session_actions">
            <button
              className={this.state.mode === "signin" ? "lobby_action_button_selected" : "lobby_action_button"}
              onClick = {() => this.setState({mode: "signin"})}
              >
              Sign in
            </button>
            <button
              className={this.state.mode === "register" ? "lobby_action_button_selected" : "lobby_action_button"}
              onClick = {() => this.setState({mode: "register"})}
              >
              Register
            </button>
          </div>
          <div className="lobby_session_items">
            <div className="lobby_session_item">
              <span>E-mail address:</span>
              {this.state.mode === "signin" && <a href="TODO: Get back email">Forgot your e-mail ?</a>}
              <input
                placeholder = "Fill in your e-mail"
                onChange = {(e) => this.handleInput("mail", e.target.value)}
              />
            </div>
            <div className="lobby_session_item">
              <span>Password:</span>
              {this.state.mode === "signin" && <a href="TODO: Get back email">Forgot your password ?</a>}
              <input
                placeholder = "Fill in your password"
                onChange = {(e) => this.handleInput("password", e.target.value)}
              />
            </div>
            <button className="lobby_button lobby_play" onClick = {() => this.loginToSession()}>
              {this.state.mode === "signin" ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  restoreLastSession() {
    return (
      <div className="lobby_layout">
        <div className="lobby_options">
          <button className="lobby_button lobby_play" onClick = {() => chooseGame()}>Play</button>
          <button className="lobby_button lobby_last_session" onClick = {() => restoreLastGame()}>Last session</button>
        </div>
      </div>
    );
  }
}

/**
 * @brief - Choose a new game among the ones available
 *          for this user.
 */
function chooseGame() {
  console.log("Play");
}

/**
 * @brief - Restores the last game played by the user.
 */
function restoreLastGame() {
  console.log("Restore last game");
}

export default Lobby
