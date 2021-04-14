
import '../../styles/Game.css';
import React from 'react';
import Overview from './Overview.jsx';
import NavigationMenu from './NavigationMenu.jsx';
import ConstructionList from './ConstructionList.jsx';
import PlanetsList from './PlanetsList.jsx';

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="game_layout">
        <div className="game_internal_layout">
          <NavigationMenu />
          <div className="game_center_layout">
            <Overview />
            <ConstructionList />
          </div>
          <PlanetsList />
        </div>
      </div>
    );
  }
}

export default Game;
