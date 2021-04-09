
import React from 'react';
import AccountSelector from './AccountSelector.jsx';
import SessionSelector from './SessionSelector.jsx';
import SessionCreator from './SessionCreator.jsx';

import { NullAccount } from '../game/server.js';
import { NullSession } from '../game/session.js';

// Defines the step corresponding to the selection of
// the account. This is required before moving to the
// selection of a session.
const ACCOUNT_SELECTION = "account";

// Defines the step corresponding to the selection of
// a saved session or the creation of a new one.
const SESSION_SELECTION = "session_selection";

// Defines the step corresponding to the selection of
// the session. A session represents the universe into
// which the account has a 'player' instance.
const SESSION_CREATION = "session_creation";

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    // Initialize step from the props.
    // let step = ACCOUNT_SELECTION;
    // if (props.loginStep) {
    //   step = props.loginStep;
    // }

    this.state = {
      // The account data representing the user which
      // is trying to connect. Initialized with a null
      // value at first, the account selector will be
      // in charge of populating and validating it with
      // the server's data
      account: NullAccount,

      // The session data representing the game that the
      // user chose to play. Initialized with a null value
      // at first, the session selector will be in charge
      // of populating and validating it with the server's
      // data.
      session: NullSession,

      // Definition of a function fetched from the input
      // properties allowing to retrieve the current login
      // step.
      getLoginStep: props.getLoginStep,

      // Definition of a function fetched from the input
      // properties to propagate a modification of the
      // login step to the parent component.
      updateLoginStep: props.updateLoginStep,

      // This method fetched from the input properties is
      // used to communicate the selection of a valid
      // account and session to the parent component.
      performLogin: props.performLogin,
    };

    console.log("g: " + this.state.getLoginStep());
  }

  updateAccount(acc) {
    // Make sure the account is valid (at least from
    // a syntax perspective).
    if (acc.id === "") {
      console.error("Failed to update account with no id " + JSON.stringify(acc));
      return;
    }

    // Update the account and the login step.
    this.setState({
      account: acc,
    });

    this.state.updateLoginStep(SESSION_SELECTION);
  }

  backToSessionList() {
    // Defines the state as being back to selecting whether
    // the local session should be loaded or if a new one
    // needs to be created.
    this.state.updateLoginStep(SESSION_SELECTION);
  }

  createSession() {
    // Move to the session creation state if possible.
    if (this.state.getLoginStep() !== SESSION_SELECTION) {
      console.error("Failed to perform creation of session, wrong state (" + this.state.getLoginStep() + ")");
      return;
    }

    this.state.updateLoginStep(SESSION_CREATION);
  }

  updateSession(sess) {
    // Make sure the session is valid (at least from
    // a syntax perspective).
    if (sess.id === "") {
      console.error("Failed to update session with no id " + JSON.stringify(sess));
      return;
    }

    console.info("Selected session " + sess.id);

    this.setState({
      session: sess,
    });


    this.state.performLogin(this.state.account, sess);
  }

  /**
   * @brief - Main render function: based on the current
   *          step reached by the user in the logging
   *          journey we will display the corresponding
   *          menu.
   */
  render() {
    const loginStep = this.state.getLoginStep();

    return (
      loginStep === ACCOUNT_SELECTION ?
      <AccountSelector updateAccount={acc => this.updateAccount(acc)} /> :
      loginStep === SESSION_SELECTION ?
      <SessionSelector account={this.state.account} updateSession={sess => this.updateSession(sess)} createSession={() => this.createSession()} /> :
      <SessionCreator account={this.state.account} updateSession={sess => this.updateSession(sess)} cancelCreation={() => this.backToSessionList()}/>
    );
  }
}

export {
  ACCOUNT_SELECTION,
  SESSION_SELECTION,
  SESSION_CREATION,
};

export default Lobby;
