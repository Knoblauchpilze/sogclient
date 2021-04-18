
import '../styles/StatusBar.css';
import '../styles/lobby/Lobby.css';
import React from 'react';

function StatusBar(props) {
  const loggedIn = (props.account.id !== "" && props.session.id !== "");
  let classes = "status_bar_logout_button";
  if (loggedIn) {
    classes += " lobby_reject_button";
  }
  else {
    classes += " status_bar_logout_disabled_button";
  }

  return (
    <div className="status_bar_layout">
      {loggedIn &&
        <div className="statis_bar_inner_container">
          <div className="status_bar_info_group">
            {props.account.id !== "" && <div className="status_bar_key">Account:</div>}
            <div className="status_bar_value">{props.account.name}</div>
          </div>
          <div className="status_bar_info_group">
            {props.session.id !== "" && <div className="status_bar_key">Player:</div>}
            <div className="status_bar_value">{props.session.name}</div>
          </div>
          <div className="status_bar_info_group">
            <div className="status_bar_value">Notes</div>
            <div className="status_bar_value">Friends</div>
            <div className="status_bar_value">Options</div>
            <div className="status_bar_value">Support</div>
          </div>
        <button className={classes} onClick = {() => loggedIn && props.requestLogout()}>Logout</button>
      </div>
      }
    </div>
  );
}

export default StatusBar;
