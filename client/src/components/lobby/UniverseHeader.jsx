
import '../../styles/lobby/UniverseHeader.css';
import '../../styles/lobby/SessionCreator.css';
import React from 'react';

function UniverseHeader() {
  return (
    <div className="universe_header_layout">
      <div className="universe_header_props">
        <div className="universe_header_prop session_creator_universe_prop_layout">Universe</div>
        <div className="universe_header_prop session_creator_country_prop_layout">Country</div>
        <div className="universe_header_prop session_creator_online_prop_layout">Online</div>
        <div className="universe_header_prop session_creator_kind_prop_layout">Kind</div>
        <div className="universe_header_prop session_creator_age_prop_layout">Age</div>
        <div className="universe_header_prop session_creator_player_prop_layout">Player</div>
        <div className="universe_header_prop session_creator_rank_prop_layout">Rank</div>
      </div>
    </div>
  );
}

export default UniverseHeader;
