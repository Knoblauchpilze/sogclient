
import '../styles/StatusBar.css';
import '../styles/Lobby.css';
import React from 'react';

class StatusBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Represents the account to which the user is currently
      // logged into. Allows to display the name and the info
      // of the account.
      account: props.account,

      // Represents the session currently being used by the
      // user. It is always related to the account and is used
      // to further refine the info displayed in the status
      // bar.
      session: props.session,

      // The logout function allows to inform the parent component
      // that the user should be logged out of their current session.
      requestLogout: props.requestLogout,
    };
  }

  render() {
    const loggedIn = (this.state.account.id !== "" && this.state.session.id !== "");
    let classes = "status_bar_logout_button";
    if (loggedIn) {
      classes += " lobby_reject_button";
    }
    else {
      classes += " status_bar_logout_disabled_button";
    }

    return (
      <div className="status_bar_layout">
        <div className="statis_bar_inner_container">
          <div className="status_bar_info_group">
            <div className="status_bar_key">Player:</div>
            <div className="status_bar_value">world</div>
          </div>
          <div className="status_bar_info_group">
          <div className="status_bar_key">Middle</div>
          <div className="status_bar_value">High</div>
          <div className="status_bar_value">Ground</div>
          </div>
          <button className={classes} onClick = {() => loggedIn && this.state.requestLogout()}>Logout</button>
        </div>
      </div>
    );
  }
}

export default StatusBar;
