
import '../../styles/SessionSelector.css';
import '../../styles/Lobby.css';
import React from 'react';

import UniverseHeader from './UniverseHeader.jsx';
import UniverseDesc from './UniverseDesc.jsx';

import Server from '../game/server.js';
import Universe from '../game/universe.js';
import Session from '../game/session.js';

import SessionsModule from '../game/sessions.js';
import { SESSIONS_FETCH_SUCCEEDED } from '../game/sessions.js';
import { SESSION_FETCH_SUCCEEDED } from '../game/sessions.js';
import { SESSION_REGISTRATION_SUCCEEDED } from '../game/sessions.js';

import UniverseFetcher from '../game/universes.js';
import { UNIVERSES_FETCH_SUCCEEDED } from '../game/universes.js';

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

      // The list of universes in which the user already
      // has an account.
      sessions: [],

      // The list of universes available for the user to
      // create a new session in.
      availableUniverses: [],

      // The list of all universes: this is used so that
      // we can associate valid data for a session.
      universes: [],
    };
  }

  fetchDataFailed(err) {
    alert(err);
  }

  fetchUniversesSucceeded(universes) {
    // Check in case the sessions are already registered
    // in which case we can perform the analysis of the
    // available universes.
    // Otherwise we will just save everything and filter
    // when the sessions are retrieved.
    let filtUnis = universes;

    if (this.state.sessions.length > 0) {
      // Filter universes in case a sessions already exists
      // for this universe.
      const filtered = filtUnis.filter(
        uni => !this.state.sessions.some(sess => sess.universe === uni.id)
      );

      filtUnis = filtered;
    }

    this.setState({
      availableUniverses: filtUnis,
      universes: universes,
    });
  }

  fetchSessionsSucceeded(sessions) {
    // Register the sessions: in case the universes are
    // already registered we will also perform a filter
    // to keep only the ones where no session already
    // exists.
    let unis = this.state.availableUniverses;
    if (unis.length > 0) {
      const filtered = unis.filter(
        uni => !sessions.some(sess => sess.universe === uni.id)
      );

      unis = filtered;
    }

    this.setState({
      sessions: sessions,
      availableUniverses: unis,
    });
  }

  fetchedSessionFailure(err) {
    alert(err);
  }

  fetchedSession(sess) {
    // Update internal state.
    this.state.updateSession(sess);

    console.info("Validated session " + JSON.stringify(sess));

    // Save session to local storage for automatic login on
    // subsequent connections.
    const out = JSON.stringify(sess);
    localStorage.setItem("session", out);

    console.info("Saving session " + out);
  }

  selectSession(session) {
    // Determine whether the session already exists or
    // not: if not, we'll have to create it first.
    const server = new Server();
    const sess = new SessionsModule(server);

    const sessSelector = this;

    // Flatten the session to a format expected by the
    // sessions module.
    const inSess = {
      name: session.name,
      account: session.account,
      universe: session.universe.id,
    };

    if (session.exists()) {
      // We need first to fetch the session and then
      // notify the parent component.
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

      return;
    }

    // We need to first create the session, and then
    // communicate it to the parent.
    sess.register(inSess)
      .then(function (res) {
        if (res.status !== SESSION_REGISTRATION_SUCCEEDED) {
          sessSelector.fetchedSessionFailure(res.status);
        }
        else {
          inSess.id = res.id;
          sessSelector.fetchedSession(inSess);
        }
      })
      .catch(err => sessSelector.fetchedSessionFailure(err));
  }

  componentDidMount() {
    // Fetch the list of universes from the server.
    const server = new Server();
    const sess = new SessionsModule(server);
    const unis = new UniverseFetcher(server);

    const sessSelector = this;

    // Fetch the sessions from the server.
    sess.fetchSessions(this.state.account.id)
      .then(function (res) {
        if (res.status !== SESSIONS_FETCH_SUCCEEDED) {
          sessSelector.fetchDataFailed(res.status);
        }
        else {
          sessSelector.fetchSessionsSucceeded(res.sessions);
        }
      })
      .catch(err => sessSelector.fetchDataFailed(err));

    // Fetch the data from the server.
    unis.fetchUniverses()
      .then(function (res) {
        if (res.status !== UNIVERSES_FETCH_SUCCEEDED) {
          sessSelector.fetchDataFailed(res.status);
        }
        else {
          sessSelector.fetchUniversesSucceeded(res.universes);
        }
      })
      .catch(err => sessSelector.fetchDataFailed(err));

    // Check whether the user already has a saved
    // account: if this is the case we will show
    // the session choosing panel. Otherwise we
    // need to propose to register.
    const storedSession = localStorage.getItem("session");
    const asess = storedSession ? JSON.parse(storedSession) : "haha";
    console.log("Session: " + JSON.stringify(asess));
  }

  /**
   * @brief - Used to generate the list of components used
   *          to represent the sessions where the player
   *          already has an account.
   */
  generateExistingSessions() {
    // In case universes haven't been fetched yet, we can't
    // generate the existing sessions' data.
    if (this.state.universes.length === 0) {
      return [];
    }

    const sessSelec = this;
    return this.state.sessions.map(function (sess) {
      // Fetch the universe associated to this session.
      const uniData = sessSelec.state.universes.find(uni => uni.id === sess.universe)

      // Build the universe structure.
      const uni = new Universe({
        id: uniData.id,
        name: uniData.name,
        country: uniData.country,
        online: "TODO",
        kind: "TODO",
        age: uniData.age
      });

      // Generate the player's data.
      const player = new Session({
        universe: uni,
        account: sess.account,
        player: sess.id,
        name: sess.name,
        rank: "",
      });

      // Return the visual component.
      return (
        <UniverseDesc key={`${sess.id}`}
                      player={player}
                      selectSession={session => sessSelec.selectSession(session)}
                      />
      );
    });
  }

  /**
   * @brief - Used to generate the list of components used
   *          to represent the sessions where the player
   *          does not have an account yet.
   */
  generateAvailableSessions() {
    return this.state.availableUniverses.map(uni => (
      <UniverseDesc key={`${uni.id}`}
                    player={new Session({
                      universe: new Universe({
                        id: uni.id,
                        name: uni.name,
                        country: uni.country,
                        online: "TODO",
                        kind: "TODO",
                        age: uni.age,
                      }),
                      account: this.state.account.id,
                      player: "",
                      name: "",
                      rank: "",
                    })}
                    selectSession={session => this.selectSession(session)}
                    />
    ));
  }

  /**
   * @brief - Handles the creation of the menu representing
   *          the available universe into which the user is
   *          able to create a new session.
   */
  render() {
    return (
      <div className="lobby_layout session_selector_game_selection">
        <div className="session_selector_game_group">
          <p className="session_selector_game_group_title">Your universes</p>
          <UniverseHeader />
          {this.generateExistingSessions()}
        </div>
        <div className="session_selector_game_group">
          <p className="session_selector_game_group_title">Start in a new universe</p>
          <UniverseHeader />
          {this.generateAvailableSessions()}
        </div>
        <div className="session_selector_back_section">
          <button className="session_selector_game_back" onClick = {() => this.setState({sessionMode: "restore"})}>Back</button>
        </div>
      </div>
    );
  }
}

export default SessionSelector;
