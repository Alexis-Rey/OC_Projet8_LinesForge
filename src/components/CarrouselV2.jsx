// Carousel.jsx
import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";

/**CarrouselV2 - Composant de carrousel réutilisable
 *
 * @param {Array<any>} items - Liste des éléments à afficher (images, objets, etc.)
 * @param {(item: any, index: number) => React.ReactNode} render - Fonction de rendu pour un élément (ex: (item) => <Card {...item} />)
 * @param {number} [intervalMs] - Intervalle en millisecondes pour l’auto-play (0 = désactivé)
 * @param {"index" | "noindex"} [follow] - Si "index", affiche le compteur (ex: 2/6)
 * @param {number} [defaultVisible] - Nombre d’éléments visibles par défaut au montage
 * @param {(width: number) => number} [computeVisibleFn] - Fonction de calcul du nombre visible selon la largeur (ex: (w) => w>=1330?4:w>=640?3:1) pour responsivité du carrousel
 */
export default function CarrouselV2({ items, render,defaultVisible,computeVisibleFn, intervalMs = 3000, follow }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopTransition, setStopTransition] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const total = items.length;

  // gestion responsive
  const viewportRef = useRef(null);
  const [visible, setVisible] = useState(defaultVisible); // par défaut desktop
  // breakpoints: mobile<640=1, tablette 640+=2, desktop 1024+=4
  const computeVisible = computeVisibleFn ?? ((w) => (w >= 1330 ? 4 : w >= 640 ? 3 : 1));

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      const next = computeVisible(w);
      if (next !== visible) {
        setStopTransition(true);      // coupe la transition pendant l'ajustement
        setVisible(next);
        // réactive au frame suivant (évite le "saut")
        requestAnimationFrame(() => requestAnimationFrame(() => setStopTransition(false)));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [items, visible,computeVisible]);

  // clones dynamiques selon visible
  const CLONES = Math.max(0, visible);

  // autoplay (inchangé)
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
      }, 500);
    }
    if (index === total) {
      setTimeout(() => {
        setStopTransition(true);
        setIndex(0);
      }, 500);
    }
  }, [index, items, total]);

  useEffect(() => {
    if (stopTransition) {
      const t = setTimeout(() => setStopTransition(false), 20);
      return () => clearTimeout(t);
    }
  }, [stopTransition]);

  // extended basé sur CLONES (mêmes nb à gauche et à droite)
  const extended = useMemo(() => {
    if (!total) return [];
    const left = items.slice(Math.max(0, total - CLONES));
    const right = items.slice(0, CLONES);
    return [...left, ...items, ...right];
  }, [items, total, CLONES]);

  const displayIndex = (() => {
    if (index === -1) return total;
    if (index === total) return 1;
    return index + 1;
  })();

  //translate en % selon visible, et prise en compte des CLONES
  const stepPct = 100 / Math.max(1, visible);        // 100% / nb visibles
  const translatePct = (index + CLONES) * stepPct;    // décalage cumulé

  return (
    <div className="carousel" role="region" aria-label="Carrousel">
      {/* viewport pour ResizeObserver */}
      <div className="carousel__viewport" ref={viewportRef} style={{ overflow: "hidden" }}>
        <div
          className="carousel__track"
          style={{
            display: "flex",
            transform: `translate3d(-${translatePct}%, 0, 0)`, 
            transition: stopTransition ? "none" : "transform 0.3s ease",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {extended.map((item, i) => {
            // clones = index < CLONES (gauche) || index >= CLONES + total (droite)
            const isClone = i < CLONES || i >= CLONES + total;
            return (
              <div
                className="carousel__slide"
                key={i}
                aria-hidden={isClone ? "true" : undefined}
                // largeur (%) selon visible
                style={{
                  flex: "0 0 auto",
                  width: `${stepPct}%`, // 100/visible
                  boxSizing: "border-box",
                }}
              >
                {render(item, i)}
              </div>
            );
          })}
        </div>
      </div>

      {total > 1 && (
        <>
          <div className="carrousel__controls-nav">
            <button
              className="carrousel__controls-prev"
              type="button"
              aria-label="Photo précédente"
              onClick={() => { prevIndex(); setPaused(true); }}
              disabled={isAnimating}
            >
              {/* SVG prev */}
              <svg className="carrousel__prev-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="50" height="50" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M34.9 239l194-194c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L131.5 256l154 154c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0l-194-194c-9.5-9.4-9.5-24.6-.1-34z" />
              </svg>
            </button>
            <button
              className="carrousel__controls-next"
              type="button"
              aria-label="Photo suivante"
              onClick={() => { nextIndex(); setPaused(true); }}
              disabled={isAnimating}
            >
              {/* SVG next */}
              <svg className="carrousel__next-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="50" height="50" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M285.5 273L91.5 467c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9L188.5 256 34.9 102.5c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l194 194c9.4 9.4 9.4 24.6 0 33.9z"/>
              </svg>
            </button>
          </div>

          {follow === "noindex" && (
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
          )}

          {follow === "index" && (
            <div className="carrousel__index" aria-live="polite" role="status">
            <ul className="carousel__dots" role="tablist" aria-label="Pagination du carrousel">
              {Array.from({ length: total }).map((_, i) => (
                <li key={i} role="presentation">
                  <button
                    type="button"
                    className={`carousel__dot ${index === i ? "is-active" : ""}`}
                    aria-label={`Aller à l'image ${i + 1}`}
                    aria-current={index === i ? "true" : undefined}
                    onClick={() => {
                      setPaused(true);
                      if (!isAnimating) setIndex(i);  // saute à la slide i
                    }}
                    disabled={isAnimating}
                  />
                </li>
              ))}
            </ul>
              <span className="sr-only">Images numéro {displayIndex} sur {total}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}