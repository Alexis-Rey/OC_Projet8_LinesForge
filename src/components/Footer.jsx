import React from "react";
import footerDesktop from "/LinkedIn-desk.webp";
import footerMob from "/LinkedIn-mob.webp";

function Footer() {
    return <footer>
        <div className="footer">
            <a href="#">Mentions Légales</a>
            <a href="https://www.linkedin.com/in/alexis-rey-333237372/" target="_blank" >
                <picture>
                    <source srcSet={footerMob} media="(max-width: 700px)" />
                    <img src={footerDesktop} alt="Logo LinkedIn" loading="lazy" width={50} height={50} />
                </picture>
            </a>
            <a href="#">Tous droits réservés</a>
        </div>
    </footer>    
};

export default Footer;