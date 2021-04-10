
import '../../styles/UniverseDesc.css';
import '../../styles/SessionCreator.css';
import React from 'react';

import flag_ge from '../../assets/flag-ge.png';
import flag_fr from '../../assets/flag-fr.png';
import flag_sp from '../../assets/flag-sp.png';

import kind_balanced from '../../assets/kind-balanced.png';
import kind_military from '../../assets/kind-military.png';
import kind_peaceful from '../../assets/kind-peaceful.png';

import { BALANCED_UNIVERSE } from '../game/universe.js';
import { MILITARY_UNIVERSE } from '../game/universe.js';
import { PEACEFUL_UNIVERSE } from '../game/universe.js';


function UniverseDesc (props) {
  const uni = props.player.universe;
  const player = props.player;

  let ageText = uni.age + " day";
  if (uni.age > 1) {
    ageText = uni.age + " days";
  }

  let imgFlag = flag_ge;
  switch (uni.country) {
    case "france":
      imgFlag = flag_fr;
      break;
    case "spain":
      imgFlag = flag_sp;
      break;
    case "germany":
    default:
      imgFlag = flag_ge;
  }

  let kindFlag = kind_balanced;
  switch (uni.kind) {
    case MILITARY_UNIVERSE:
      kindFlag = kind_military;
      break;
    case PEACEFUL_UNIVERSE:
      kindFlag = kind_peaceful;
      break;
    case BALANCED_UNIVERSE:
    default:
      kindFlag = kind_balanced;
  }

  return (
    <div className="universe_desc_layout">
      <div className="universe_desc_props">
        <div className="universe_desc_value session_creator_universe_prop_layout">{uni.name}</div>
        <div className="universe_desc_value session_creator_country_prop_layout">
          <img src={imgFlag} alt={uni.country} className="universe_desc_country_image"/>
        </div>
        <div className="universe_desc_value session_creator_online_prop_layout">{uni.online}</div>
        <div className="universe_desc_value session_creator_kind_prop_layout">
          <img src={kindFlag} alt={uni.kind} className="universe_desc_kind_image"/>
        </div>
        <div className="universe_desc_value session_creator_age_prop_layout">{ageText}</div>
        {player.exists() && <div className="universe_desc_value session_creator_player_prop_layout">{player.name}</div>}
        {player.exists() && <div className="universe_desc_value session_creator_rank_prop_layout">{player.rank}</div>}
      </div>
      <button onClick = {() => props.selectSession(player)}>Play</button>
    </div>
  );
}

export default UniverseDesc;
