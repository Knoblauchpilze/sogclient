
import '../styles/Banner.css';
import logo from '../assets/oglike.png';

function Banner() {
  return (
    <div className="banner_layout">
      <img src={logo} alt="OGLike" className="banner_logo"/>
      <h1 className="banner_text">OGLike: the space strategy game</h1>
    </div>
  );
}

export default Banner;
