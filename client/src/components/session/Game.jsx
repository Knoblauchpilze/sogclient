
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
      <div>
        <NavigationMenu />
        <Overview />
        <ConstructionList />
        <PlanetsList />
      </div>
    );
  }
}

export default Game;
