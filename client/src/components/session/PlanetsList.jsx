
import '../../styles/PlanetsList.css';
import React from 'react';
import PlanetContainer from './PlanetContainer.jsx';

function PlanetsList (props) {
  return (
    <div className="planets_list_layout">
      <div className="planets_list_count">9/9 planet(s)</div>
      <PlanetContainer name={"New Hypergate"} galaxy={2} solar_system={222} position={9} active={false}/>
      <PlanetContainer name={"Hyperion"} galaxy={3} solar_system={135} position={9} active={true}/>
      <PlanetContainer name={"Hypergate"} galaxy={3} solar_system={138} position={9} active={false}/>
      <PlanetContainer name={"Oasis Secundus"} galaxy={4} solar_system={129} position={8} active={false}/>
      <PlanetContainer name={"Oasis"} galaxy={4} solar_system={130} position={8} active={false}/>
      <PlanetContainer name={"Colonie"} galaxy={5} solar_system={53} position={1} active={false}/>
      <PlanetContainer name={"Tau Ceti Central"} galaxy={5} solar_system={53} position={7} active={false}/>
      <PlanetContainer name={"New London"} galaxy={5} solar_system={53} position={8} active={false}/>
      <PlanetContainer name={"New Horizons"} galaxy={5} solar_system={53} position={9} active={false}/>
    </div>
  );
}

export default PlanetsList;
