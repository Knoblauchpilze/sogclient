
import '../../styles/UniverseHeader.css';
import React from 'react';

function UniverseHeader() {
  return (
    <div className="universe_header_layout">
      <div className="universe_header_props">
        <div className="universe_header_prop">Universe</div>
        <div className="universe_header_prop">Country</div>
        <div className="universe_header_prop">Online</div>
        <div className="universe_header_prop">Kind</div>
        <div className="universe_header_prop">Age</div>
        <div className="universe_header_prop">Player</div>
        <div className="universe_header_prop">Rank</div>
      </div>
    </div>
  );
}

export default UniverseHeader;
