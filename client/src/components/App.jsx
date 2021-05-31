

import '../styles/App.css';
import React from 'react';
import StatusBar from './StatusBar.jsx';
import Banner from './Banner.jsx';
import Lobby from './lobby/Lobby.jsx';
import Game from './session/Game.jsx';
import Footer from './Footer.jsx';

import Server from './game/server.js';

import UniversesModule from './game/universes.js';
import { UNIVERSES_FETCH_SUCCEEDED } from './game/universes.js';

import { NullAccount } from './game/server.js';
import { NullSession } from './game/session.js';
import { NullUniverse } from './game/universe.js';

import { ACCOUNT_SELECTION } from './lobby/Lobby.jsx';
import { SESSION_SELECTION } from './lobby/Lobby.jsx';

// Defines the step corresponding to the selection of
// the account. This is required before launching the
// game with the selected session.
const LOGIN = "login";

// Defines the step corresponding to fetching data
// from the server to prepare for the session that
// has been selected.
const SESSION_FETCH = "fetch";

// Defines the step corresponding to the main game view
// where the user is modifying its session in a given
// universe.
const GAME = "game";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Textual descritpion of the current step reached
      // by the app. Mostly used to determine the items
      // to display visually (and thus the components to
      // render).
      gameState: LOGIN,

      // Textual descritpion of the current login step.
      // Helps guide the login process to make sure the
      // user is verified before accessing to the game's
      // data. This attribute is used to share the state
      // between the lobby and the status bar.
      loginStep: ACCOUNT_SELECTION,

      // Defines whether or not the lobby should perform
      // an automatic login of the user if an account
      // exists in local storage.
      autologin: true,

      // The account data representing the user which
      // is trying to connect. Initialized with a null
      // value at first, the account selector will be
      // in charge of populating and validating it with
      // the server data
      account: NullAccount,

      // The session data representing the game that the
      // user chose to play. Initialized with a null value
      // at first, the session selector will be in charge
      // of populating and validating it with the server's
      // data.
      session: NullSession,

      // The universe data representing the universe that
      // is associated with the account and session the
      // user is logged into.
      universe: NullUniverse,
    };
  }

  updateLoginStep(step) {
    this.setState({
      loginStep: step
    });
  }

  updateAccount(account) {
    this.setState({
      account: account,
      loginStep: SESSION_SELECTION,
    });
  }

  performLogin(account, session) {
    // Perform minimal checks.
    if (account.id === "" || session.id === "") {
      console.error("Failed to login, invalid account (" + account.id + ") or session (" + session.id + ")");
      return;
    }

    // Update the internal state with the account and
    // session and move to game screen.
    this.setState({
      account: account,
      session: session,
      gameState: SESSION_FETCH,
    });

    // Request the server to fetch the needed data to
    // connect the user to their session.
    const server = new Server();
    const universes = new UniversesModule(server);

    const app = this;

    universes.fetchUniverses()
      .then(function (res) {
        if (res.status !== UNIVERSES_FETCH_SUCCEEDED) {
          app.fetchDataFailed(res.status);
        }
        else {
          app.fetchUniversesSucceeded(res.universes);
        }
      })
      .catch(err => app.fetchDataFailed(err));
  }

  fetchDataFailed(err) {
    alert(err);

    // Reset the state to the account selection as we
    // couldn't log in on this one.
    this.logout();
  }

  fetchUniversesSucceeded(universes) {
    // Update internal state: we need to update the
    // universe to keep only the one we wanted to
    // get in the first place and also update the
    // state to the actual game.
    const u = universes.find(u => u.id === this.state.session.universe);
    if (!u) {
      // Can't find the universe linked to the user's
      // account, this is an issue.
      this.fetchDataFailed("Failed to fetch universe \"" + this.state.session.universe + "\"");
      return;
    }

    this.setState({
      universe: u,
      gameState: GAME,
    });

    console.info("Fetched data for universe \"" + u.name + "\"");
  }

  logout() {
    this.setState({
      gameState: LOGIN,
      account: NullAccount,
      session: NullSession,
      loginStep: ACCOUNT_SELECTION,
      autologin: false,
    });
  }

  render() {
    return (
      <div className="app_layout">
        <StatusBar account={this.state.account} session={this.state.session} requestLogout={() => this.logout()}/>
        {this.state.gameState !== GAME && <Banner />}
        {
          this.state.gameState === GAME ?
          <Game account={this.state.account}
                session={this.state.session}
                universe={this.state.universe}
                />
          :
          <Lobby loginStep={this.state.loginStep}
                 updateLoginStep={(step) => this.updateLoginStep(step)}
                 account={this.state.account}
                 updateAccount={(acc) => this.updateAccount(acc)}
                 performLogin={(acc, sess) => this.performLogin(acc, sess)}
                 autologin={this.state.autologin}
                 />
        }
        <Footer />
      </div>
    );
  }
}

export default App;
