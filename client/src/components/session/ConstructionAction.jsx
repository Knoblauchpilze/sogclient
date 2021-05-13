
import '../../styles/session/ConstructionAction.css';
import React from 'react';

function formatInterval(interval) {
  const init = Math.floor(Math.abs(interval) / 1000.0);
  const s = init % 60;
  let m = Math.floor(init / 60) % 60;
  let h = Math.floor(init / (60 * 60)) % 24;
  let d = Math.floor(init / (60 * 60 * 24)) % 7;
  let w = Math.floor(init / (60 * 60 * 24 * 7));

  let out = "";
  if (w > 0) {
    out += w;
    out += "w";
  }
  if (d > 0) {
    out += d;
    out += "d";
  }
  if (h > 0) {
    out += h;
    out += "h";
  }
  if (m > 0) {
    out += m;
    out += "m";
  }
  if (s > 0 || out === "") {
    out += s;
    out += "s";
  }

  if (interval < 0) {
    out += " ago";
  }

  return out;
}

function ConstructionAction(props) {
  return (
    <div className="construction_action_layout">
      <div className="construction_action_title">
        <div>{props.title}</div>
      </div>
      <div className="construction_action_value">
        {
          props.actions.length === 0 &&
          <div className="construction_action_data_title">{"No construction at the moment"}</div>
        }
        {
          props.actions.length !== 0 &&
          <div className="construction_action_list_layout">
            <div key={props.actions[0].id} className="construction_action_data_layout">
              <div className="construction_action_data_title">{props.actions[0].name}</div>
              <div className="construction_action_data_internal_layout">
                <img className="construction_action_data_icon" src={props.actions[0].icon} alt={props.actions[0].name} title={props.actions[0].name} />
                <div>
                  <p className="construction_action_data_prop construction_action_data_key">Currently building</p>
                  <p className="construction_action_data_prop construction_action_data_level">{"Level " + props.actions[0].level}</p>
                  <p className="construction_action_data_prop construction_action_data_key">Remaining:</p>
                  <p className="construction_action_data_prop construction_action_data_time">{formatInterval(props.actions[0].remaining)}</p>
                </div>
              </div>
            </div>
          </div>
        }
        {
          props.actions.length > 1 &&
          <div className="construction_action_queue_layout">
            {
              props.actions.slice(1).map(a =>
                <div className="construction_action_queue_item">
                  <img className="construction_action_queue_icon" src={a.icon} alt={a.name} title={a.name} />
                  <span className="construction_action_queue_text">{a.level ? a.level : a.amount}</span>
                </div>
              )
            }
          </div>
        }
      </div>
    </div>
  );
}

export default ConstructionAction;
