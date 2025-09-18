import React, {useState, useRef, useEffect} from "react";
import arrowIcn from "/utils/arrow.webp";
import arrowIcnB from "/utils/arrow-blue.webp";

/* Composant collapse comprenant un titre, contenu et taille
*@params [string] title :  titre du collapse
*@params [string] children : props passé depuis le composant Collapse situé dans About.jsx, contenu du texte ou élément à afficher
*@params [string] title :  indication sur la taille ici entre large ou small*/
function Collapse({title,children,size,tag}) {
    const Tag = tag;
    const [isOpen, setIsOpen] = useState(false);
    // ici on créer une référence vide dans un premier temps mais qui contiendra l'élément DOM auquel ref est attaché soit la div content avec le contenu camouflé ou non
    const contentRef = useRef(null);
    // ici on créer une variable collapseId qui contiendra chaque élément contrôle par le bouton du collapse, cela sera utile
    // pour l'accessibilité pour indiquer aux lecteurs écrans l'élément qui sera animer, cible ou modifié au click bouton - l'expression recherche les espaces pour remplacer par des tirets
    const collapseId = `collapse-content-${title.replace(/\s+/g, "-").toLowerCase()}`;
    const headerId = `collapse-header-${title.replace(/\s+/g, "-").toLowerCase()}`;

    // utilisation de useEffect pour modifier la taille du contenu à afficher lorsque l'élément de son tableau de dépendance change ici: isOpen
    useEffect(()=> {
        const currentContent = contentRef.current;
        if (currentContent) {
        if (isOpen) {
            currentContent.style.height = currentContent.scrollHeight + "px";
        } else {
            currentContent.style.height = "0px";
        }
        }
    },[isOpen]);

    return <Tag className={`collapse collapse--${size}`} aria-labelledby={headerId}>
        <h3 id={headerId} className="collapse__header-title">
            <button 
            className={`collapse__header collapse--${size}`}
            aria-controls={collapseId} 
            aria-expanded={isOpen}
             >
                {title}
                <img 
                    className={`collapse__header-icon ${isOpen ? "on" : "off"}`} 
                    src={isOpen ? arrowIcnB : arrowIcn}
                    aria-hidden="true" 
                    aria-label="Afficher les informations lié à cette section"
                    onClick={() => setIsOpen(!isOpen)}
                />
            </button>
        </h3>
        <div id={collapseId} ref={contentRef}
            className={`collapse__content ${isOpen ? "is-open" : ""}`}
            aria-hidden={!isOpen}>
                <div className="collapse__content-inner">
                    {children}    
                </div>           
        </div>
    </Tag>
};
export default Collapse;