import React from "react";
import { Link } from "react-router-dom";
import data from "../data/data.json"; // fichier mock pour le test avant backend
import Card from "../components/Card";
import CarrouselV2 from "../components/CarrouselV2";


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
  return (
    <div className="home">
      <section className="home__services">
        <h2 id="solutions-forgees" className="home__title">Solutions Forgées</h2>
        <div className="cards cards--services">
          {data.services.map(s => (
            <Card key={s.id} goal="solution" title={s.title} desc={s.description} img={s.img} />
          ))}
        </div>
      </section>

      <section className="home__skills">
        <h2 id="arsenal" className="home__title">Arsenal</h2>
           <CarrouselV2
              items={data.skills}
              defaultVisible={4}
              computeVisibleFn={(w) => (w >= 1330 ? 4 : w >= 640 ? 3 : 1)}
              intervalMs={2000}   // 0 pour désactiver l’auto-play
              /* ici pour chaque élément skills de mon tableau, carrousel appelle la fonction render et insère le JSX que je lui retourne, ici il transforme donc chaque 
              skill en un card */
              render={(sk) => (       
                <Card
                  goal="skill"
                  title={sk.title}
                  desc={sk.description}
                  img={sk.img}
                />
              )}
              follow="noindex"
            />
      </section>

      <section className="home__projects">
        <h2 id="realisations" className="home__title">Réalisations</h2>
        <div className="cards cards--projects">
          {data.projects.map(p => (
            <Link key={p.id} to={`projects/${p.id}`} className="home__projects-link">
              <Card
                key={p.id}
                goal="project"
                title={p.title}
                img={p.coverImage}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}


export default Home;