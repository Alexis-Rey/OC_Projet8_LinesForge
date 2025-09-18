import React from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import data from "../data/data.json";
import CarrouselV2 from "../components/CarrouselV2";
import Collapse from "../components/Collapse";
import logoGit from "/skills/github.webp";
import me from "/LinesForge-desk.webp";
import blueStars from "/utils/blue.webp";
import greyStars from "/utils/grey.webp";

function Project() {
  const { id } = useParams();
  const project = data.projects.find((p) => p.id === id);

  if (!project) return <p>Projet introuvable</p>;

   // Conversion en chiffre de la note
    const numberRating = parseInt(project.difficulty);
    const diffStars = 5 - numberRating;
    const stars= [];
    for (let i=1; i <=numberRating;i++){
        stars.push(blueStars);
    }
    for (let i=1; i <=diffStars;i++){
        stars.push(greyStars);
    }

    const role = sessionStorage.getItem("role");
  return (
    <section className="projects">
      {/* Liste des images */}
      <CarrouselV2
          items={project.imagesDesk}
          defaultVisible={1}
          computeVisibleFn={(w) => (w >= 1330 ? 1 : w >= 640 ? 1 : 1)}
          intervalMs={3000}   
          follow="index"
          render={(deskSrc,i) => (       
          <img className="projects__image" src={deskSrc} alt={`${project.title} visuel ${i + 1}`} width={900} height={550}
          style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} 
          fetchPriority="high"/>
          )}
      />
      
      <article className="project__info">
        {/* Infos principales */}
        <h2 className="project__info-title">Projet {project.title}</h2>

        <div className="project__info-first">
          <a href={project.gitLink} target="_blank" aria-label="Se rendre sur le Github d'Alexis"><img src={logoGit} width={75} height={75} title="Se rendre sur Github"/></a>
          <ul className="project__rating">
            <span>Difficulté:</span>
               {stars.map((star,index)=>(
                    <li className="project__star" key={index}>
                        <img src={star} alt="Etoile accordé en fonction de la difficulté du projet" aria-hidden="true" width={24.75} height={24}/>
                    </li>
               ))}
               <span className="sr-only">Note de {project.difficulty} sur 5</span>
            </ul>
            <a href={project.siteLink} target="_blank" aria-label="Se rendre sur le site du projet"><img src={me} width={125} height={75} title="Se rendre sur le site"/></a>
            {/* Liste des langages */}
            <ul className="project__info-list">
              <span>Langages:</span>
              {project.languages.map((lang, i) => (
                <li key={`lang-${i}`} className="tag" data-lang={lang}>
                  <p>{lang}</p>
                </li>
              ))}
            </ul>
            <ReactMarkdown>
              {project.description}
            </ReactMarkdown>
        </div>

        { role === "Apprentie" && (
        <Collapse title="Guide et Astuce" size="large" tag="aside">
          <p><span>Durée :</span>{project.time}</p>
          <div className="project__tips">
          <ReactMarkdown>
              {project.tips}
          </ReactMarkdown>
          </div>
          <div className="project__soutenance">
          <ReactMarkdown>
              {project.soutenance}
          </ReactMarkdown>
          </div>

          {/* Liste des sources */}
          <ul className="project__info-list">
          <span>Sources utiles :</span>
            {project.sources.map((src, i) => (
              <li key={`src-${i}`}>
                <a href={src} target="_blank" style={{ color : "white"}}>{project.annot[i]} </a>
              </li>
            ))}
          </ul>
        </Collapse>)}
      </article>
    </section>
  );
}

export default Project;