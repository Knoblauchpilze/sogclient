
import '../styles/Footer.css';
import logo from '../assets/65px-Stop_hand.jpeg';

function Footer() {
  const altText = "KnoblauchPicture";
  const titleText = "Knoblauch picture";

  const linkText = "We need more Pilze";

  return (
    <footer className="footer_layout">
      <img className="footer_icon" src={logo} alt={altText} title={titleText}/>
      <a href="https://github.com/Knoblauchpilze">{linkText}</a>
    </footer>
  );
}

export default Footer
