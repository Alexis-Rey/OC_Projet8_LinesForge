import React from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import mock from "../data";
import { useGoalApi } from "../hook/useGoalApi"; 
import CarrouselV2 from "../components/CarrouselV2";
import Collapse from "../components/Collapse";
import logoGit from "/skills/github.webp";
import me from "/LinesForge-desk.webp";
import blueStars from "/utils/blue.webp";
import greyStars from "/utils/grey.webp";

// normalise un projet issu du mock pour matcher le shape API
function normalizeProjectFromMock(m) {
  if (!m) return null;
  const images = Array.isArray(m.imagesDesk) ? m.imagesDesk.slice() : [];
  const sources =
    Array.isArray(m.sources) && m.sources.length
      ? m.sources.map((url, i) => ({ url, label: (m.annot && m.annot[i]) || url }))
      : [];
  return {
    id: m.id,
    title: m.title,
    description: m.description,
    cover: m.coverImage || m.coverImageUrl,
    images,
    languages: m.languages || [],
    gitLink: m.gitLink || "",
    siteLink: m.siteLink || "",
    time: m.time || "",
    difficulty: m.difficulty ?? 0,
    tips: m.tips || "",
    soutenance: m.soutenance || "",
    sources,
  };
}

export default function Project() {
  const { id } = useParams();

  // 1) API pour UN projet
  const { data, loadingP, errorP } = useGoalApi({ goal: "projects", id });

  // 2) Fallback mock si API indispo (data === false)
  const project =
    data === false
      ? normalizeProjectFromMock(mock.projects.find((p) => p.id === id)): data; 

  if (!project) return <p>Projet introuvable.</p>;

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
       {/* états de chargement / erreurs (facultatifs) */}
      {( loadingP ) && <p style={{opacity:.6}}>Chargement…</p>}
      {( errorP ) && <p style={{color:"crimson"}}>{ errorP }</p>}
      {/* Carrousel images */}
      <CarrouselV2
        items={project.images || []}
        defaultVisible={1}
        computeVisibleFn={() => 1}
        intervalMs={3000}
        follow="index"
        render={(src, i) => (
          <img
            className="projects__image"
            src={src}
            alt={`${project.title} visuel ${i + 1}`}
            width={900}
            height={550}
            style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
            fetchPriority="high"
          />
        )}
      />

      <article className="project__info">
        <h2 className="project__info-title">Projet {project.title}</h2>

        <div className="project__info-first">
          {project.gitLink && (
            <a href={project.gitLink} target="_blank" rel="noreferrer" aria-label="Se rendre sur GitHub">
              <img src={logoGit} width={75} height={75} title="Se rendre sur Github" />
            </a>
          )}

          <ul className="project__rating">
            <span>Difficulté&nbsp;:</span>
            {stars.map((star, index) => (
              <li className="project__star" key={index}>
                <img src={star} alt="" aria-hidden="true" width={24.75} height={24} />
              </li>
            ))}
            <span className="sr-only">Note de {numberRating} sur 5</span>
          </ul>

          {project.siteLink && (
            <a href={project.siteLink} target="_blank" rel="noreferrer" aria-label="Se rendre sur le site du projet">
              <img src={me} width={125} height={75} title="Se rendre sur le site" />
            </a>
          )}

          {/* Langages */}
          <ul className="project__info-list">
            <span>Langages&nbsp;:</span>
            {project.languages.map((lang, i) => (
              <li key={`lang-${i}`} className="tag" data-lang={lang}>
                <p>{lang}</p>
              </li>
            ))}
          </ul>

          <ReactMarkdown>{project.description || ""}</ReactMarkdown>
        </div>

        {role === "Apprentie" && (
          <Collapse title="Guide et Astuce" size="large" tag="aside">
            {project.time && <p><span>Durée&nbsp;:</span>{project.time}</p>}

            {project.tips && (
              <div className="project__tips">
                <ReactMarkdown>{project.tips}</ReactMarkdown>
              </div>
            )}

            {project.soutenance && (
              <div className="project__soutenance">
                <ReactMarkdown>{project.soutenance}</ReactMarkdown>
              </div>
            )}

            <ul className="project__info-list">
              <span>Liens des sources utiles&nbsp;:</span>
              {project.sources.map((src, i) => (
                <li key={`src-${i}`}>
                  <a href={src.url} target="_blank" rel="noreferrer" style={{ color: "white" }}>
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
            
          </Collapse>
        )}
      </article>
    </section>
  );
}