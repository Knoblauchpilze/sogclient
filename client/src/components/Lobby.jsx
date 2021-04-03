
import '../styles/Lobby.css';
import React from 'react';
import Server from './server.js';
import AccountValidator from './account_validator.js';
import { DUPLICATES_VERIFICATION, CREDENTIALS_VERIFICATION } from './account_validator.js';
import { VALID_ACCOUNT } from './account_validator.js';

import AccountRegistrator from './account_registrator.js';
import { REGISTRATION_SUCCEEDED } from './account_registrator.js';

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

      // The account data as currently filled by the
      // user. Will be checked against server's data
      // when the user wants to log in (or register).
      account: {
        id: "",
        mail: "",
        name: "",
        password: "",
      },
    };
  }

  /**
   * @brief - Used whenever the user enters some new data
   *          to fill in one of the field available in the
   *          lobby. Depending on the current step reached
   *          in the log in journey the correct element
   *          will be populated with the text.
   */
  handleInput(kind, text) {
    const acc = this.state.account;

    if (kind === "mail") {
      acc.mail = text;
      acc.name = text;
    }
    else {
      // Assume password.
      acc.password = text;
    }

    this.setState({account: acc});
  }

  loginFailure(err) {
    alert(err);
  }

  loginSucceeded(acc) {
    // Update internal state.
    this.setState({
      step: "session",
      hasAccount: true,
      account: acc,
    });

    console.info("Account " + JSON.stringify(acc) + " validated");

    // Save account to local storage for automatic login on
    // subsequent connections.
    if (!this.state.autologin) {
      localStorage.removeItem("account");

      console.info("Removing saved account");
      return;
    }

    const out = JSON.stringify(acc);
    localStorage.setItem("account", out);

    console.info("Saving account " + out);
  }

  requestLogin(acc, mode) {
    // Determine whether we're in login or registration mode.
    // This will determine what kind of process we need to
    // start on the account.
    const server = new Server();
    const accVal = new AccountValidator(server);
    const accReg = new AccountRegistrator(server);

    // The user wanst to signin to an existing account.
    if (mode === "signin") {
      const verif = CREDENTIALS_VERIFICATION;
      const lobby = this;

      accVal.validate(acc, verif)
        .then(function (status) {
          if (status !== VALID_ACCOUNT) {
            lobby.loginFailure(status);
          }
          else {
            lobby.setState({
              step: "session",
              hasAccount: true,
              account: acc,
            });
          }
        })
        .catch(err => lobby.loginFailure(err));
    }

    // The user wants to create a new account.
    if (mode === "register") {
      const verif = DUPLICATES_VERIFICATION;
      const lobby = this;

      accVal.validate(acc, verif)
        .then(function (status) {
          if (status !== VALID_ACCOUNT) {
            // lobby.loginFailure(status);
            console.error("suc1: " + status);

            return;
          }
          else {
            accReg.register(acc)
              .then(function (status) {
                if (status !== REGISTRATION_SUCCEEDED) {
                  lobby.loginFailure(status);
                  console.error("suc2: " + status);

                  return;
                }
                else {
                  lobby.loginSucceeded(acc);
                }
              })
              .catch(err => lobby.loginFailure(err));
          }
        })
        .catch(err => lobby.loginFailure(err));
    }
  }

  /**
   * @brief - Main render function: based on the current
   *          step reached by the user in the logging
   *          journey we will display the corresponding
   *          menu.
   */
  render() {
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
            <button className="lobby_button lobby_play" onClick={() => this.requestLogin(this.state.account, this.state.accountMode)}>
              {this.state.accountMode === "signin" ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby
