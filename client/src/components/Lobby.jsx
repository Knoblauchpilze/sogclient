
import '../styles/Lobby.css';

function Lobby({cart}) {
  function createSession() {
    console.log("Play");
  }

  function restoreLastSession() {
    console.log("Restore last session");
  }


  return (
    <div className="lobby_layout">
      <div className="lobby_options">
        <button className="lobby_button lobby_play" onClick = {() => createSession()}>Play</button>
        <button className="lobby_button lobby_last_session" onClick = {() => restoreLastSession()}>Last session</button>
      </div>
    </div>
  );
}

export default Lobby
