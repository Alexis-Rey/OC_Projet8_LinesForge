// Carousel.jsx
import React, { useState, useEffect, useRef } from "react";

/** Fonction carrousel générique pour inclure n'importe quel éléments (image comme card ou autre) avec choix du delai ou non pour un défilement auto sur plusieurs images
 * @param {Array<any>} items - éléments à afficher (ex: data.skills)
 * @param {(item: any, i: number) => React.ReactNode} render - fonction qui rend 1 slide
 * @param {number} [intervalMs=3000] - auto-play (ms). Mettre 0 pour désactiver
 * si on désiré affiché plus d'un item à la fois comme pour la section skills il faut modifier la variable translateX de carrousel__track de 100% à ??% en fonction du nombre désiré
 * dans la même logique il faudra rajoutant le nombre correpondant de clone en fonction du nombre i d'éléments afficher dans le carrousel
 */
export default function Carousel({ items, render, intervalMs = 3000,follow}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopTransition, setStopTransition] = useState(false);
  const total = items.length;
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);

  // autoplay
  useEffect(() => {
    if (total <= 1 || paused || intervalMs <= 0) return;
    const itv = setInterval(() => nextIndex(), intervalMs);
    return () => clearInterval(itv);
  }, [items, paused, intervalMs, total]);

  const prevIndex = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setIndex((old) => old - 1);
    setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
    }, 500);
  };

  const nextIndex = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setIndex((old) => old + 1);
    setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
    }, 500);
  };

  // reset en bord (boucle infinie)
  useEffect(() => {
    if (total <= 1) return;
    if (index === -1) {
      setTimeout(() => {
        setStopTransition(true);
        setIndex(total - 1);
      }, 750);
    }
    if (index === total) {
      setTimeout(() => {
        setStopTransition(true);
        setIndex(0);
      }, 750);
    }
  }, [index, items, total]);

  useEffect(() => {
    if (stopTransition) {
      const t = setTimeout(() => setStopTransition(false), 20);
      return () => clearTimeout(t);
    }
  }, [stopTransition]);

  // clones aux extrémités
  const extended = [items[total - 2],items[total - 1], ...items, items[0],items[1],items[2]];

  const displayIndex = (() => {
    if (index === -1) return total;
    if (index === total) return 1;
    return index + 1;
  })();

  return (
    <div className="carousel" role="region" aria-label="Carrousel">
      <div className="carousel__track "
        style={{
          transform: `translateX(-${(index + 1) * 25}%)`,
          transition: stopTransition ? "none" : "transform 0.3s ease",
        }}
      >
        {extended.map((item, i) => {
          const isClone = i === 0 || i === extended.length - 1;
          return (
            <div className="carousel__slide" key={i}  aria-hidden={isClone ? "true" : undefined}>
              {render(item, i)}
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
            <div className="carrousel__controls-nav">
                <button className="carrousel__controls-prev" type="button" aria-label="Photo précédente" onClick={() => {prevIndex();setPaused(true);}} disabled={isAnimating}>
                    <svg className="carrousel__prev-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="50" height="50" fill="currentColor" aria-hidden="true" focusable="false">
                        <path d="M34.9 239l194-194c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L131.5 256l154 154c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0l-194-194c-9.5-9.4-9.5-24.6-.1-34z" />
                    </svg>
                </button>
                <button className="carrousel__controls-next" type="button" aria-label="Photo suivante" onClick={() => {nextIndex();setPaused(true);}} disabled={isAnimating}>
                    <svg className="carrousel__next-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="50" height="50" fill="currentColor" aria-hidden="true" focusable="false">
        				    <path d="M285.5 273L91.5 467c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9L188.5 256 34.9 102.5c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l194 194c9.4 9.4 9.4 24.6 0 33.9z"/>
      			    </svg>
                </button>
            </div>
            <div className="carrousel__controls-lecture">
                <button className={`carrousel__controls-play carrousel--${paused}`} type="button" onClick={() => setPaused(false)} aria-label="Lecture auto du diaporama">
                    <svg className="carrousel__play-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="50" height="50" fill="currentColor" aria-hidden="true" focusable="false">
                        <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                    </svg>
                </button>
                <button className={`carrousel__controls-stop carrousel--${!paused}`} type="button" onClick={() => setPaused(true)} aria-label="Mettre en pause le diaporama">
                    <svg className="carrousel__stop-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"  width="50" height="50" fill="currentColor" aria-hidden="true" focusable="false">
                        <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/>
                    </svg>
                </button>
            </div>
            {follow === "index" &&
            <div className="carrousel__index" aria-live="polite" role="status">
                <span className="carrousel__index-value">{displayIndex}/{total}</span>
                <span className="sr-only">Images numéro {displayIndex} sur {total}</span>
            </div>
            }
        </>
      )}
    </div>
  );
}