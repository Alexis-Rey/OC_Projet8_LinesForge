import React from "react";
import { useState } from "react";
import logoLandingDesk from "/LinesForge-landing.webp";
import logoLandingMob from "/LinesForge-desk.webp";
import logoForgeronDesk from "/forgeron-desk.webp";
import logoForgeronMob from "/forgeron-mob.webp";
import logoPro from "/pro-desk.webp";
import logoStudent from "/student-desk.webp";
import Role from "../components/Role";

function Landing(){
    const [showMain, setShowMain] = useState(false);
    const handleMain = () =>{
        setShowMain(true);
    }
    return <>
        <header id="landing" className={`landing__logo ${showMain ? "landing-open" : ""}`}>
            <button 
            type="button" 
            className="landing__logo-button" 
            onClick={handleMain} aria-controls="landing__content" 
            aria-expanded={showMain} 
            aria-label="Cliquez pour faire apparaitre le contenu">
                <h1>
                    <picture className="landing__logo-picture" >
                        <source srcSet={logoLandingMob}  media="(max-width: 600px)" width={213} height={87}/>
                        <source srcSet={logoLandingDesk}  media="(max-width: 1000px)" width={500} height={203}/>
                        <img src={logoLandingDesk} alt="Logo LinesForge" width={829} height={337}/>
                    </picture>
                </h1>
            </button>
        </header>
        <main id="landing__content" className={`landing__subject ${showMain ? "is-visible" : ""}`} aria-hidden={!showMain}>
            <section className="landing__main">
                <picture className="landing__main-picture">
                     <source srcSet={logoForgeronMob} media="(max-width: 700px)" width={150} height={155} />
                    <img src={logoForgeronDesk} alt="Logo d'un forgeron en train de forger du code" width={282} height={291}/>
                </picture>
                <div className="landing__main-text">
                    <h2 className="landing__main-title">Forger des solutions web, lignes après lignes</h2>
                    <p className="landing__main-subject">
                        Bienvenue sur LinesForge, l’atelier où se façonnent vos projets numériques.
                        Ici, vous découvrirez mon savoir-faire en développement web à travers des réalisations concrètes, mes services forgés sur mesure, 
                        ainsi que les compétences et outils que j’utilise au quotidien.<br/><br/>
                        Que vous soyez étudiant en quête d’inspiration ou professionnel à la recherche de solutions efficaces,
                        ce site vous ouvre les portes de mon univers : démonstrations de projets, présentation de mon parcours, certifications et technologies de mon arsenal.
                        Chaque ligne de code est pensée comme un coup de marteau, pour donner vie à des sites modernes, performants et durables.
                    </p>
                </div>
            </section>
            <section className="landing__choice">
                <Role role="Apprentie" subrole="qu'étudiant" img={logoStudent} >
                    En tant qu’étudiant, tu accèdes à un espace pensé pour t’accompagner dans ton apprentissage.<br/><br/><br/><br/>
                    Tu y trouveras des projets concrets issus de mon parcours, présentés avec des explications claires, 
                    des astuces issues de mon expérience, ainsi que des ressources utiles pour progresser plus vite.
                    Mon objectif est de t’aider à mieux comprendre la logique derrière chaque réalisation et de te donner des repères 
                    pour réussir tes propres projets et soutenances.</Role>
                <Role role="Maître" subrole="que professionnel" img={logoPro} >
                    En tant que professionnel, vous accédez à un portfolio clair et structuré, pensé comme une vitrine de mes compétences.<br/><br/><br/><br/>
                    Vous y découvrirez mes services, mes projets réalisés, ainsi que mes compétences techniques mises en pratique.
                    Ce rôle vous donne également un accès exclusif à mes diplômes, mes certifications et à un formulaire de contact dédié, 
                    afin de faciliter la prise de contact pour un projet, une mission freelance ou une opportunité de recrutement.
                    <br/><br/><br/>
                    Vous recrutez ?<br/><br/>
                    Découvrez mes projets, mes compétences et contactez-moi directement : ce rôle est fait pour rendre le recrutement simple et transparent.
                </Role>
            </section>
        </main>
    </>
};

export default Landing;