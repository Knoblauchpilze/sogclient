
// import '../../styles/Lobby.css';
import React from 'react';
import AccountSelector from './AccountSelector.jsx';
import SessionSelector from './SessionSelector.jsx';

import { NullAccount } from '../game/server.js';
import { NullSession } from '../game/session.js';

// Defines the step corresponding to the selection of
// the account. This is required before moving to the
// selection of a session.
const ACCOUNT_SELECTION = "account";

// Defines the step corresponding to the selection of
// the session. A session represents the universe into
// which the account has a 'player' instance.
const SESSION_SELECTION = "session";

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Textual descritpion of the current login step.
      // Helps guide the login process to make sure the
      // user is verified before accessing to the game's
      // data.
      // Always starts by selecting an account.
      loginStep: ACCOUNT_SELECTION,

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

  updateSession(sess) {
    // Make sure the session is valid (at least from
    // a syntax perspective).
    if (sess.id === "") {
      console.error("Failed to update session with no id " + JSON.stringify(sess));
      return;
    }

    this.setState({
      session: sess,
    });
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
      <SessionSelector account={this.state.account} updateSession={sess => this.updateSession(sess)} />
    );
  }
}

export default Lobby;
