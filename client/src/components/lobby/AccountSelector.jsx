
import '../../styles/AccountSelector.css';
import '../../styles/Lobby.css';
import React from 'react';

import Server from '../server.js';
import { NullAccount } from '../server.js';

import AccountValidator from './account_validator.js';
import { DUPLICATES_VERIFICATION, CREDENTIALS_VERIFICATION } from './account_validator.js';
import { VALID_ACCOUNT } from './account_validator.js';

import AccountRegistrator from './account_registrator.js';
import { REGISTRATION_SUCCEEDED } from './account_registrator.js';

class AccountSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defines whether or not the account should
      // be saved to local storage so that it can
      // be restored afterwards (on the next user
      // log in mainly).
      autologin: true,

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
      account: NullAccount,

      // This method fetched from the input properties
      // allows to transmit the result of the validated
      // account to the parent component.
      updateAccount: props.updateAccount,
    };
  }

  /**
   * @brief - Used whenever the user enters some new data
   *          to fill in one of the field available in the
   *          account selector. Depending on the current
   *          step reached in the log in journey the correct
   *          element will be populated with the text.
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
    this.state.updateAccount(acc);

    console.info("Validated account " + JSON.stringify(acc));

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
      const accSelector = this;

      accVal.validate(acc, verif)
        .then(function (res) {
          if (res.status !== VALID_ACCOUNT) {
            accSelector.loginFailure(res.status);
          }
          else {
            accSelector.loginSucceeded(res.account);
          }
        })
        .catch(err => accSelector.loginFailure(err));

      return;
    }

    // The user wants to create a new account.
    if (mode === "register") {
      const verif = DUPLICATES_VERIFICATION;
      const accSelector = this;

      accVal.validate(acc, verif)
        .then(function (status) {
          if (status !== VALID_ACCOUNT) {
            accSelector.loginFailure(status);
          }
          else {
            accReg.register(acc)
              .then(function (status) {
                if (status !== REGISTRATION_SUCCEEDED) {
                  accSelector.loginFailure(status);
                }
                else {
                  accSelector.loginSucceeded(acc);
                }
              })
              .catch(err => accSelector.loginFailure(err));
          }
        })
        .catch(err => accSelector.loginFailure(err));

        return;
    }
  }

  updateAccountMode(mode) {
    this.setState({
      accountMode: mode
    });
  }

  updateAutologin(autologin) {
    this.setState({
      autologin: autologin
    });
  }

  /**
   * @brief - This method is called right after this component
   *          is inserted in the DOM. According to the doc:
   *          https://fr.reactjs.org/docs/react-component.html#componentdidmount
   *          It is the right place to put any call to external
   *          data source and possibly fetch DOM elements.
   */
  componentDidMount() {
    // Check whether the user already has a saved
    // account: if this is the case we will show
    // the session choosing panel. Otherwise we
    // need to propose to register.
    const storedAcc = localStorage.getItem("account");
    const acc = storedAcc ? JSON.parse(storedAcc) : NullAccount;

    if (acc.mail !== "" && acc.password !== "") {
      this.requestLogin(acc, this.state.accountMode);
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
        <div className="account_selector_session_options">
          <div className="account_selector_session_actions">
            <button
              className={this.state.accountMode === "signin" ? "account_selector_action_button_selected" : "account_selector_action_button"}
              onClick = {() => this.updateAccountMode("signin")}
              >
              Sign in
            </button>
            <button
              className={this.state.accountMode === "register" ? "account_selector_action_button_selected" : "account_selector_action_button"}
              onClick = {() => this.updateAccountMode("register")}
              >
              Register
            </button>
          </div>
          <div className="account_selector_session_items">
            <div className="account_selector_session_group account_selector_session_item">
              <span>E-mail address:</span>
              {this.state.accountMode === "signin" && <a href="TODO: Get back email">Forgot your e-mail ?</a>}
              <input
                placeholder = "Fill in your e-mail"
                onChange = {(e) => this.handleInput("mail", e.target.value)}
              />
            </div>
            <div className="account_selector_session_group account_selector_session_item">
              <span>Password:</span>
              {this.state.accountMode === "signin" && <a href="TODO: Get back email">Forgot your password ?</a>}
              <input
                placeholder = "Fill in your password"
                onChange = {(e) => this.handleInput("password", e.target.value)}
              />
            </div>
            <div className="account_selector_session_item">
              <input type="checkbox"
                     onChange={(e) => this.updateAutologin(e.target.checked)}
                     key="autologin_checkbox"
                     name="haha"
                     checked={this.state.autologin}
              />
              <label htmlFor={"autologin_checkbox"}>Login automatically</label>
            </div>
            <button className="account_selector_button account_selector_play" onClick={() => this.requestLogin(this.state.account, this.state.accountMode)}>
              {this.state.accountMode === "signin" ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountSelector
