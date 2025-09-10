import React from "react";
import Card from "../components/Card";


/** Composant Card réutilisable.
 *
 * @component
 *
 * @param {Object} props - Propriétés du composant.
 * @param {string} props.goal - Sert à indiquer le type de la card. 
 *    Valeurs possibles : "solution", "skill" ou "project".
 *    - "solution" → affiche titre, image et description visibles.
 *    - "skill" → affiche l’image avec titre et description au survol (dans un carousel).
 *    - "project" → affiche uniquement le titre et l’image.
 * @param {string} props.title - Titre de la card.
 * @param {string} [props.desc] - Description de la card (optionnelle, non utilisée pour "project").
 * @param {string} props.img - Source de l’image affichée.
 *
 * @example
 * <Card goal="solution" title="Développement Web" desc="Création de sites modernes" img="/images/dev.png" />
 * <Card goal="skill" title="React" desc="Bibliothèque JS" img="/images/react.png" />
 * <Card goal="project" title="Portfolio" img="/images/portfolio.png" />
 */
function Home() {
    return <div className="home">
        <section className="home__services">
            <h2 id="solutions-forgees" className="home__title">Solutions Forgées</h2>
            <Card goal="solution" title="" desc="" img="" />
        </section>
        <section className="home__skills">
             <h2 id="arsenal" className="home__title">Arsenal</h2>
             <Card goal="skill" title="" desc="" img="" />
        </section>
        <section className="home__projects">
            <h2 id="realisations" className="home__title">Réalisations </h2>
            <Card goal="project" title="" desc="" img="" />
        </section>
    </div>
};

export default Home;