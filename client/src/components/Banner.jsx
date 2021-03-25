
import '../styles/Banner.css';
import logo from '../assets/oglike.png';

function Banner() {
  const title = "OGLike";

  return (
    <div className="banner_row">
      <img src={logo} alt="OGLike" className="logo" />
      <h1 className="title">{title}</h1>
    </div>
  );
}

export default Banner
