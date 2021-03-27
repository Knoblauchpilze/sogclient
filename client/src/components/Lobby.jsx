
import '../styles/Lobby.css';

function Lobby({cart}) {
  return (
    <div className="lobby_layout">
      <section>
        <ol>
          <li><a href="modules/overview/overview.html">Play</a></li>
          <li><a href="modules/overview/overview.html">Reopen last session</a></li>
        </ol>
      </section>
    </div>
  );
}

export default Lobby
