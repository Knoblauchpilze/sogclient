
import '../../styles/session/Galaxy.css';
import React from 'react';
import GalaxyNavigator from './GalaxyNavigator.jsx';
import GalaxyPlanet from './GalaxyPlanet.jsx';

class Galaxy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  generateInfo() {
    let probes = 0;
    let recyclers = 0;
    let missiles = 0;

    // TODO: Handle slots.
    let usedSlots = 0;
    let totalSlots = 0;

    if (this.props.planet) {
      // Fetch the description for needed ships.
      if (this.props.ships && this.props.ships.length > 0) {
        let eDesc = this.props.ships.find(e => e.name === "espionage probe");
        if (eDesc) {
          const built = this.props.planet.ships.find(e => e.id === eDesc.id);
          probes = built.amount;
        }

        eDesc = this.props.ships.find(e => e.name === "recycler");
        if (eDesc) {
          const built = this.props.planet.ships.find(e => e.id === eDesc.id);
          recyclers = built.amount;
        }
      }

      if (this.props.defenses && this.props.defenses.length > 0) {
        let eDesc = this.props.defenses.find(e => e.name === "interplanetary missile");
        if (eDesc) {
          const built = this.props.planet.defenses.find(e => e.id === eDesc.id);
          missiles = built.amount;
        }
      }
    }

    return (
      <div className="galaxy_ships_info">
        <span className="galaxy_default_label">{probes + " espionage probe(s)"}</span>
        <span className="galaxy_default_label">{recyclers + " recycler(s)"}</span>
        <span className="galaxy_default_label">{missiles + " interplanetary missile(s)"}</span>
        <span className="galaxy_default_label">{usedSlots + "/" + totalSlots + " slot(s)"}</span>
      </div>
    );
  }

  render() {
    // Note that as the 'planets' list provided in the props
    // only defines the existing planet: we will have to do
    // some generation of the data for planets that are not
    // colonized yet.
    let planets = [];
    for (let id = 0 ; id < this.props.universe.solar_system_size ; ++id) {
      let pID = this.props.system.planets.findIndex(p => p.coordinate.position === id);
      let p;

      if (pID < 0) {
        p = {
          coordinate: {
            position: id,
          },
          name: "",
          player_name: "",
          player: "",
          guild: "",
        };
      }
      else {
        p = this.props.system.planets[pID];

        // Attempt to find the player's name.
        const pl = this.props.players.find(pla => pla.id === p.player);
        p.player_name = pl.name;
      }

      planets.push(p);
    }

    // TODO: Handle the handling of the system data.
    return (
      <div className="galaxy_layout">
        <GalaxyNavigator coordinates={this.props.system.coordinates} updateSystem={this.props.updateSystem} />
        {
          this.generateInfo()
        }

        <div className="galaxy_layout_description">
          <span className="galaxy_system_header">Planet</span>
          <span className="galaxy_system_header">Name</span>
          <span className="galaxy_system_header">Moon</span>
          <span className="galaxy_system_header">Activity</span>
          <span className="galaxy_system_header">Debris</span>
          <span className="galaxy_system_header">Player (status)</span>
          <span className="galaxy_system_header">Guild</span>
          <span className="galaxy_system_header">Actions</span>
        </div>
        <div className="galaxy_system_layout">
          {
            planets.map((p, id) => <GalaxyPlanet key={id} planet={p} />)
          }
        </div>

        <div className="galaxy_view_messages">
          <span className="galaxy_default_label">No messages at the moment</span>
        </div>

        <div className="galaxy_system_info">6 planet(s) colonized</div>
      </div>
    );
  }
}

export default Galaxy;
