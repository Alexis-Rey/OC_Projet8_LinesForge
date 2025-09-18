import React from "react";

function Card({ goal, title, desc, img }) {
  return (
        <>
        {goal === "solution" && (
            <article className={`card card--${goal}`}>
                <div className="card__content">
                    <h3 className="card__title">{title}</h3>
                    <img className="card__image" src={img} alt={title} width={100} height={100} fetchPriority="high"/>
                    <p className="card__desc">{desc}</p>
                </div>
            </article>
        )}

        
        {goal === "skill" && (
            <article className={`card card--${goal}`}>
                <img className="card__image" src={img} alt={title} width={100} height={100} loading="lazy"/>
                <div className="card__overlay" aria-hidden="true">
                    <h3 className="card__title">{title}</h3>
                    <p className="card__desc">{desc}</p>
                </div>
            </article>
        )}

        
        {goal === "project" && (
            <article className={`card card--${goal}`}>
                <img className="card__image" src={img} alt={title} width={400} height={250} loading="lazy"/>
                <div className="card__project-img">
                    <h3 className="card__title">{title}</h3>
                </div>
            </article>
        )}
    </>
  );
}

export default Card;