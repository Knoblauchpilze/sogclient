
import '../../styles/SessionSelector.css';
import '../../styles/Lobby.css';
import React from 'react';

import UniverseHeader from './UniverseHeader.jsx';
import UniverseDesc from './UniverseDesc.jsx';

import Server from '../server.js';

import SessionsFetcher from './sessions_fetcher.js';
import { SESSIONS_FETCH_SUCCEEDED } from './sessions_fetcher.js';
import UniverseFetcher from './universe_fetcher.js';
import { UNIVERSES_FETCH_SUCCEEDED } from './universe_fetcher.js';

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

  componentDidMount() {
    // Fetch the list of universes from the server.
    const server = new Server();
    const sess = new SessionsFetcher(server);
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
  }

  /**
   * @brief - Handles the creation of the menu representing
   *          the available universe into which the user is
   *          able to create a new session.
   */
  render() {
    // Default values for player and universe.
    return (
      <div className="lobby_layout session_selector_game_selection">
        <div className="session_selector_game_group">
          <p className="session_selector_game_group_title">Your universes</p>
          <UniverseHeader />
          {
            this.state.sessions.map(sess => (
              <UniverseDesc key={`${sess.id}`}
                            universe={this.state.universes.find(uni => uni.id === sess.universe)}
                            player={{}}
                            />
            ))
          }
        </div>
        <div className="session_selector_game_group">
          <p className="session_selector_game_group_title">Start in a new universe</p>
          <UniverseHeader />
          {
            this.state.availableUniverses.map(uni => (
              <UniverseDesc key={`${uni.id}`} universe={uni} player={{}}/>
            ))
          }
        </div>
        <div className="session_selector_back_section">
          <button className="session_selector_game_back" onClick = {() => this.setState({sessionMode: "restore"})}>Back</button>
        </div>
      </div>
    );
  }
}

export default SessionSelector;
