
import '../styles/Lobby.css';

function Lobby({cart}) {
  return (
    <div className="layout_inner">
      <section className="content">
        <ol>
          <li><a href="modules/overview/overview.html">Play</a></li>
          <li><a href="modules/overview/overview.html">Reopen last session</a></li>
        </ol>

        <div id="test">
        </div>
      </section>
    </div>
  );
}

export default Lobby
