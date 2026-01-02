import Logo from "../images/logo.svg";
import "../styles/header.css";

export default function Header({
  onViewGallery,
  dateLabel,
  imagesCount,
}) {
  return (
    <header className="logo-section">

      <div className="left-section">
        <span className="date">{dateLabel}</span>

      </div>

      <h1>
        <img
          draggable={false}
          loading="lazy"
          className="logo"
          src={Logo}
          alt="Atelier"
        />
      </h1>

      <div className="right-section">
        <span
          className="view-gallery"
          onClick={onViewGallery}
        >
          View Gallery
        </span>

        <span className="images-length">
          ({imagesCount})
        </span>
      </div>
    </header>
  );
}
