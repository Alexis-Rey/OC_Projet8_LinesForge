import React from "react";
import logoDesktop from "/LinesForge-desk.webp";
import { NavLink } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

function Header() {
  return (
    <header>
      <div className="placeholder"></div>
      <div className="header">
        <nav className="nav">
          {/* Liens d’ancre */}
          <HashLink smooth to="/LinesForge#solutions-forgees" className="nav__link">Solutions Forgées</HashLink>
          <HashLink smooth to="/LinesForge#arsenal" className="nav__link">Arsenal</HashLink>

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
          <HashLink smooth to="/LinesForge#realisations" className="nav__link">Réalisations</HashLink>

          {/* Page séparée */}
          <NavLink to="le-forgeron" className="nav__link">Le Forgeron</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
