
import '../../styles/lobby/SessionSelector.css';
import '../../styles/lobby/Lobby.css';
import React from 'react';

import Server from '../game/server.js';

import { NullSession } from '../game/session.js';

import SessionsModule from '../game/sessions.js';
import { SESSION_FETCH_SUCCEEDED } from '../game/sessions.js';

class SessionSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // The account identifier, provided by the parent
      // component and corresponding to the account with
      // which the user successfully logged in.
      account: props.account,

      // This method fetched from the input properties
      // allows to transmit the result of the validated
      // session to the parent component.
      updateSession: props.updateSession,

      // This method fetched from the input properties
      // allows to transmit a request to create a new
      // session rather than loading an existgin saved
      // one.
      createSession: props.createSession,

      // Whether or not a saved session exists in local
      // storage for this item.
      hasSavedSession: false,

      // The session loaded from local storage. Will be
      // used in case the user clicks on the restore last
      // session option.
      session: NullSession,
    };
  }

  fetchedSessionFailure(err) {
    alert(err);
  }

  fetchedSession(sess) {
    // Update internal state.
    this.state.updateSession(sess);

    console.info("Validated session " + sess.id);

    // Save session to local storage for automatic login on
    // subsequent connections.
    const out = JSON.stringify(sess);
    localStorage.setItem("session", out);

    console.info("Saving session " + sess.id);
  }

  selectSession(session) {
    // Create elements to use to perform the validation of
    // the input session.
    const server = new Server();
    const sess = new SessionsModule(server);

    const sessSelector = this;

    // Flatten the session to a format expected by the
    // sessions module.
    const inSess = {
      name: session.name,
      account: session.account,
      universe: session.universe,
    };

    // We are sure that the session is actually valid, so
    // we can proceed to consolidating it with the server.
    sess.fetch(inSess)
      .then(function (res) {
        if (res.status !== SESSION_FETCH_SUCCEEDED) {
          sessSelector.fetchedSessionFailure(res.status);
        }
        else {
          sessSelector.fetchedSession(res.session);
        }
      })
      .catch(err => sessSelector.fetchedSessionFailure(err));
  }

  componentDidMount() {
    // Check whether the user already has a saved
    // session: if this is the case we will enable
    // the button allowing to restore the session.
    const storedSess = localStorage.getItem("session");
    let sess = storedSess ? JSON.parse(storedSess) : NullSession;

    if (sess.id === "") {
      sess = NullSession;
    }

    // Also verify that the session is linked to
    // the account we're connected to.
    if (sess.account !== this.state.account.id) {
      console.info("Removed session " + sess.id + " linked to account " + sess.account);
      sess = NullSession;
    }

    this.setState({
      hasSavedSession: sess.account !== "",
      session: sess
    });
  }

  /**
   * @brief - Handles the creation of the menu representing
   *          the available universe into which the user is
   *          able to create a new session.
   */
  render() {
    const buttonClass = this.state.hasSavedSession ?
      "lobby_validate_button session_selector_last_session" :
      "lobby_validate_button session_selector_last_session_disabled";

    return (
      <div className="lobby_layout">
        <div className="session_selector_options">
          <button className="lobby_validate_button" onClick = {() => this.state.createSession()}>Play</button>
          <button className={buttonClass} onClick = {() => this.state.hasSavedSession && this.selectSession(this.state.session)}>Last session</button>
        </div>
      </div>
    );
  }
}

export default SessionSelector;
