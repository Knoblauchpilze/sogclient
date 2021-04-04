
import '../../styles/SessionSelector.css';
import '../../styles/Lobby.css';
import React from 'react';

import UniverseHeader from './UniverseHeader.jsx';
import UniverseDesc from './UniverseDesc.jsx';

class SessionSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // The account registered for the user.
      account: props.account,

      // This method fetched from the input properties
      // allows to transmit the result of the validated
      // session to the parent component.
      updateSession: props.updateSession,
    };
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
          <UniverseDesc universe={"Libra"}
                        country={"France"}
                        online={54}
                        kind={"Balanced"}
                        age={1933}
                        player={"tttttttttttttttttttt"}
                        rank={1383}
                        />
        </div>
        <div className="session_selector_game_group">
          <p className="session_selector_game_group_title">Start in a new universe</p>
          <UniverseHeader />
          <UniverseDesc universe={"Zenith"}
                        country={"France"}
                        online={339}
                        kind={"Balanced"}
                        age={18}
                        player={""}
                        rank={0}
                        />
          <UniverseDesc universe={"Ymir"}
                        country={"France"}
                        online={418}
                        kind={"Peaceful"}
                        age={61}
                        player={""}
                        rank={0}
                        />
        </div>
        <div className="session_selector_back_section">
          <button className="session_selector_game_back" onClick = {() => this.setState({sessionMode: "restore"})}>Back</button>
        </div>
      </div>
    );
  }
}

export default SessionSelector
