import React from "react";

import { Link } from "react-router-dom";

function Role({ role, children, subrole, img }) {
  const handleRole = () => {
    sessionStorage.setItem("role", role);
  };
  return (
    <article className={role}>
      <img className={`${role}__img`} src={img} alt={role} />
      <h3 className={`${role}__title`}>{role}</h3>
      <p>{children}</p>
      <button className={`${role}__button`} onClick={handleRole}><Link to="/LinesForge" className={`${role}__link`}>Accéder à la forge en tant {subrole}</Link></button>
    </article>
  );
}

export default Role;