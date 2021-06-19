
import React from 'react';
import AccountSelector from './AccountSelector.jsx';
import SessionSelector from './SessionSelector.jsx';
import SessionCreator from './SessionCreator.jsx';

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

    this.state = {
      // Definition of a function fetched from the input
      // properties to propagate a modification of the
      // login step to the parent component.
      updateLoginStep: props.updateLoginStep,

      // This method fetched from the input properties is
      // used to communicate the selection of a valid
      // account and session to the parent component.
      performLogin: props.performLogin,
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
    this.props.updateAccount(acc);
  }

  backToSessionList() {
    // Defines the state as being back to selecting whether
    // the local session should be loaded or if a new one
    // needs to be created.
    this.state.updateLoginStep(SESSION_SELECTION);
  }

  createSession() {
    // Move to the session creation state if possible.
    if (this.props.loginStep !== SESSION_SELECTION) {
      console.error("Failed to perform creation of session, wrong state (" + this.props.loginStep + ")");
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


    this.state.performLogin(this.props.account, sess);
  }

  /**
   * @brief - Main render function: based on the current
   *          step reached by the user in the logging
   *          journey we will display the corresponding
   *          menu.
   */
  render() {
    return (
      this.props.loginStep === ACCOUNT_SELECTION ?
      <AccountSelector updateAccount={acc => this.updateAccount(acc)} autologin={this.props.autologin}/> :
      this.props.loginStep === SESSION_SELECTION ?
      <SessionSelector account={this.props.account}
                       updateSession={sess => this.updateSession(sess)}
                       createSession={() => this.createSession()}
                       /> :
      <SessionCreator account={this.props.account}
                      updateSession={sess => this.updateSession(sess)}
                      cancelCreation={() => this.backToSessionList()}
                      />
    );
  }
}

export {
  ACCOUNT_SELECTION,
  SESSION_SELECTION,
  SESSION_CREATION,
};

export default Lobby;
