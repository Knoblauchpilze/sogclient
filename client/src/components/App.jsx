
import '../styles/App.css';
import Footer from './Footer.jsx';
import Lobby from './lobby/Lobby.jsx';
import Banner from './Banner.jsx';

function App() {
  return (
    <div className="app_layout">
      <Banner />
      <Lobby />
      <Footer />
    </div>
  );
}

export default App;
