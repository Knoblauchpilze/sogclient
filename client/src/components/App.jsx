

import '../styles/App.css';
import React from 'react';
import StatusBar from './StatusBar.jsx';
import Banner from './Banner.jsx';
import Lobby from './lobby/Lobby.jsx';
import Game from './session/Game.jsx';
import Footer from './Footer.jsx';

import { NullAccount } from './game/server.js';
import { NullSession } from './game/session.js';

// Defines the step corresponding to the selection of
// the account. This is required before launching the
// game with the selected session.
const LOGIN = "login";

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

  performLogin(account, session) {
    // Perform minimal checks.
    console.log("acc: " + JSON.stringify(account));
    console.log("ses: " + JSON.stringify(session));

    // Update the internal state with the account and
    // session and move to game screen.
    this.setState({
      account: account,
      session: session,
      gameState: GAME,
    })
  }

  render() {
    return (
      <div className="app_layout">
        <StatusBar account={this.state.account} session={this.state.session}/>
        <Banner />
        {this.state.gameState === GAME ? <Game /> : <Lobby performLogin={(acc, sess) => this.performLogin(acc, sess)}/>}
        <Footer />
      </div>
    );
  }
}

export default App;
