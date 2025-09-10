import React from "react";
import logoDesktop from "../assets/LinesForge-desk.webp";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="header">
        <nav className="nav">
          {/* Liens d’ancre */}
          <a href="#solutions-forgees" className="nav__link">Solutions Forgées</a>
          <a href="#arsenal" className="nav__link">Arsenal</a>

          {/* Logo au milieu */}
          <NavLink to="/LinesForge" aria-label="Retour à la page d'accueil" className="nav__logo">
            <h1>
                <img
                  src={logoDesktop}
                  alt="Logo LinesForge"
                  width={213}
                  height={87}
                />
            </h1>
          </NavLink>

          {/* Lien d’ancre */}
          <a href="#realisations" className="nav__link">Réalisations</a>

          {/* Page séparée */}
          <NavLink to="/le-forgeron" className="nav__link">Le Forgeron</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
