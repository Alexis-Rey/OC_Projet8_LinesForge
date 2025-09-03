import React from "react";
import footerDesktop from "../assets/linked-desk.webp";
import footerMob from "../assets/linked-mob.webp";

function Footer() {
    return <footer>
        <div className="footer">
            <a href="*">Mentions Légales</a>
            <picture>
                <source srcSet={footerMob} media="(max-width: 700px)" />
                <img src={footerDesktop} alt="Pied de page du site Kasa avec logo et copyright" loading="lazy" width={188} height={46} />
            </picture>
            <a href="*">Tous droits réservés</a>
        </div>
    </footer>    
};

export default Footer;