
// import '../../styles/Lobby.css';
import React from 'react';
import AccountSelector from './AccountSelector.jsx';
import SessionSelector from './SessionSelector.jsx';

import { NullAccount } from '../server.js';

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
    };

    // As explained in this topic:
    // https://stackoverflow.com/questions/35537229/how-to-update-parents-state-in-react
    // As we will be passing the `updateAccount` method
    // around to children component, we need to bind it
    // to this class so that the `this` refers to this
    // class and not to the child.
    // TODO: Check this.
    // this.updateAccount.bind(this);
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

  /**
   * @brief - Main render function: based on the current
   *          step reached by the user in the logging
   *          journey we will display the corresponding
   *          menu.
   */
  render() {
    return (
      this.state.loginStep === ACCOUNT_SELECTION ?
      <AccountSelector updateAccount={acc => this.updateAccount(acc)}/> :
      <SessionSelector />
    );
  }
}

export default Lobby
