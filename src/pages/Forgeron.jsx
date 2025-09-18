import React from "react";
import data from "../data";
import Collapse from "../components/Collapse";
import Me from "/utils/me.webp";
import OC from "/utils/Oc.webp";

function Forgeron() {
  const diplomes = data.diplomes || [];           // tableau
  const hasDiplomes = diplomes.length > 0;
  const validDiplomes = diplomes.filter(d => d?.img && d?.title && d?.description);
  const incompleteDiplomes = diplomes.filter(d => !d?.img || !d?.title || !d?.description);

  const certifs= data.certificats || [];           // tableau
  const hasCertifs = certifs.length > 0;
  const validCertifs = certifs.filter(c => c?.img && c?.title && c?.description);
  const incompleteCertifs = certifs.filter(c => !c?.img || !c?.title || !c?.description);

  const role = sessionStorage.getItem("role");
  return (
    <>
    <section className="aboutMe">
        <h2 className="aboutMe__title">Le Forgeron</h2>
        <div className="aboutMe__global">
            <div className="aboutMe__first">
                 <div className="aboutMe__first-content"> 
                    <img className="aboutMe__first-img-hide" src={Me} alt="Image de profil d'Alexis REY, créateur de LinesForge" width={350} height={350} fetchPriority="high"></img>
                    <h2 className="aboutMe__first-title">Qui suis-je ?</h2>
                    <p className="aboutMe__first-para">
                        Je m’appelle Alexis Rey, développeur web formé chez OpenClassrooms.<br></br>
                        Au-delà du code, je suis curieux et persévérant, animé par l’envie de comprendre et de construire. J’aime relever des défis techniques, tout en apportant une touche créative dans chacun de mes projets.<img className="aboutMe__first-img" src={Me} alt="Image de profil d'Alexis REY, créateur de LinesForge" width={350} height={350} fetchPriority="high"></img> <br></br>Pour moi, le développement web est autant un outil qu’un art : il me permet de transformer une idée en expérience concrète et vivante.
                        Cette vision, je la tiens de mon expérience personnelle : passionné depuis toujours par les jeux vidéo, la technologie et le numérique, j’ai aussi nourri mon esprit créatif grâce au dessin et à mon attachement à l’univers animé japonais.
                        <br></br><br></br><u> Pour vos missions</u><br></br><br></br>
                        Si vous êtes à la recherche d’un développeur pour donner vie à votre projet, je peux vous accompagner avec rigueur et créativité. Mon objectif est simple : comprendre vos besoins, trouver des solutions adaptées et livrer un produit clair, fonctionnel et agréable à utiliser.
                        <br></br><br></br><u> Pour le recrutement </u><br></br><br></br>
                        En tant que candidat, je recherche avant tout un environnement où je pourrai contribuer activement, apprendre aux côtés d’une équipe et relever de nouveaux défis.<br></br> Je crois au travail collaboratif et à l’idée qu’un projet web solide naît toujours d’une synergie entre compétences techniques et vision commune.</p>
                </div> 
            </div> 
            <div className="aboutMe__second">  
                <div className="aboutMe__second-content"> 
                  <img className="aboutMe__second-img-hide" src={OC} alt="Logo d'Openclassroom" width={350} height={350} fetchPriority="high"></img>
                    <h2 className="aboutMe__second-title">Mon Parcours Openclassroom</h2> 
                    <p className="aboutMe__second-para">
                        J’ai suivi la formation diplômante « Développeur Web » proposée par OpenClassrooms,<br></br> une formation professionnalisante construite autour de projets concrets.<img className="aboutMe__second-img" src={OC} alt="Logo d'Openclassroom" width={350} height={350} fetchPriority="high"></img> Ce parcours m’a permis d’acquérir des compétences solides en intégration web (HTML, CSS, Sass), en développement front-end moderne (JavaScript, React, Vite), ainsi qu’en back-end (Node.js, Express, MongoDB).<br></br><br></br>
                        Chaque projet a été une étape d’apprentissage progressive : de l’intégration d’une maquette Figma jusqu’à la création complète d’une API sécurisée, en passant par l’optimisation des performances et la gestion de projets selon une méthodologie Agile. À travers ces expériences, j’ai appris à développer des solutions fiables, maintenables et adaptées aux besoins réels des utilisateurs.
                        Aujourd’hui, ce parcours me donne la confiance et les outils nécessaires pour répondre à des missions concrètes, que ce soit en autonomie ou au sein d’une équipe.<br></br><br></br>
                        Enfin, je souhaite adresser un remerciement particulier à mon mentor, Vincent Errante. Son suivi attentif, sa pédagogie et sa capacité à transmettre son expérience ont joué un rôle essentiel dans ma progression.<br></br><br></br> Au-delà de l’aspect technique, ses conseils m’ont permis de prendre du recul, de gagner en rigueur et de développer une vision plus professionnelle de mon métier.<br></br> Son accompagnement bienveillant a marqué mon parcours, et je lui suis sincèrement reconnaissant pour son investissement et sa disponibilité.   
                    </p> 
                </div> 
            </div> 
        </div> 
    </section>

      {/*  --- DIPLÔMES --- */}
{role === "Maître" && (
  <Collapse title="Diplômes" size="large" tag="section">
    {!hasDiplomes ? (
      <p>Diplôme introuvable</p>
    ) : validDiplomes.length > 0 ? (
      <>
        {validDiplomes.map((d, i) => (
          <article key={d.id ?? i}>
            <img
              className="collapse__diplome-img"
              src={d.img}
              alt={`Diplôme : ${d.title}`}
              width={900}
              height={550}
              loading="lazy"
            />
            <h4 className="collapse__diplome-title">{d.title}</h4>
            <p className="collapse__diplome-desc">{d.description}</p>
          </article>
        ))}
        {incompleteDiplomes.length > 0 && (
          <p style={{ marginTop: "1rem", opacity: 0.8 }}>
            {incompleteDiplomes.length} autre(s) diplôme(s) seront ajoutés bientôt.
          </p>
        )}
      </>
    ) : (
      <p>Diplôme en cours d'obtention</p>
    )}
  </Collapse>
)}

{/*  --- CERTIFICATIONS --- */}
{role === "Maître" && (
  <Collapse title="Certifications" size="large" tag="section">
    {!hasCertifs ? (
      <p>Certification introuvable</p>
    ) : validCertifs.length > 0 ? (
      <>
        {validCertifs.map((c, i) => (
          <article key={c.id ?? i}>
            <img
              className="collapse__certif-img"
              src={c.img}
              alt={`Certification : ${c.title}`}
              width={400}
              height={283}
              loading="lazy"
            />
            <h4 className="collapse__certif-title">{c.title}</h4>
            <p className="collapse__certif-desc">{c.description}</p>
          </article>
        ))}
        {incompleteCertifs.length > 0 && (
          <p style={{ marginTop: "1rem", opacity: 0.8 }}>
            {incompleteCertifs.length} autre(s) certification(s) seront ajoutées bientôt.
          </p>
        )}
      </>
    ) : (
      <p>Certifications en cours d'obtention</p>
    )}
  </Collapse>
)}

{/* Bouton contact réservé au Maître */}
{role === "Maître" && (
  <aside className="aboutMe__contact">
    <a href="mailto:theachievementnancy@gmail.com" className="aboutMe__contact-button">
      Contactez-moi !
    </a>
  </aside>
)}
    </>
  );
}

export default Forgeron;