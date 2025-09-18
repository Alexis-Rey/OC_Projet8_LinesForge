import React from "react";
import { NavLink } from "react-router-dom";

function NotFound() {
    return <div className="error">
        <h2 className="error__title">404</h2>
        <p className="error__content">Oups! La page que <span className="error__break-mobile">vous demandez n'existe pas.</span> </p>
        <NavLink className="error__link" to="/">Retourner sur la page d'accueil</NavLink>
    </div>
};

export default NotFound;