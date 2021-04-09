
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
    let step = ACCOUNT_SELECTION;
    if (props.loginStep) {
      step = props.loginStep;
      console.log("Overriding step: " + props.loginStep);
    }
    // TODO: Remove debug log.
    console.log("Final step: " + step + ", props: " + JSON.stringify(props));

    this.state = {
      // Textual descritpion of the current login step.
      // Helps guide the login process to make sure the
      // user is verified before accessing to the game's
      // data.
      loginStep: step,

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
    };
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
      loginStep: SESSION_SELECTION,
      account: acc,
    });
  }

  backToSessionList() {
    // Defines the state as being back to selecting whether
    // the local session should be loaded or if a new one
    // needs to be created.
    this.setState({
      loginStep: SESSION_SELECTION,
    });
  }

  createSession() {
    // Move to the session creation state if possible.
    if (this.state.loginStep !== SESSION_SELECTION) {
      console.error("Failed to perform creation of session, wrong state (" + this.state.loginStep + ")");
      return;
    }

    this.setState({
      loginStep: SESSION_CREATION
    });
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

    // TODO: Move to game state.
  }

  /**
   * @brief - Main render function: based on the current
   *          step reached by the user in the logging
   *          journey we will display the corresponding
   *          menu.
   */
  render() {
    return (
      this.state.loginStep === ACCOUNT_SELECTION ?
      <AccountSelector updateAccount={acc => this.updateAccount(acc)} /> :
      this.state.loginStep === SESSION_SELECTION ?
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
