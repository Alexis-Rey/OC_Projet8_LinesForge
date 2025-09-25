// src/hooks/useGoalApi.js
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const EP = {
  services:       "/api/services",
  projects:       "/api/projects",
  skills:         "/api/skills",
  diplomes:       "/api/diplomes",
  certifications: "/api/certifications",
};

// --- LISTE (pour Home) ---
const mapList = {
  services: (arr=[]) => arr.map(s => ({id: s.id, title: s.title,description: s.description, img: s.imageUrl || "",})),

  projects: (arr=[]) => arr.map(p => ({ id: p.id, title: p.title, coverImage: p.coverImage?.url || p.coverImageUrl || "",})),

  skills: (arr=[]) => arr.map(s => ({ id: s.id, title: s.title, description: s.description, img: s.imageUrl || "",})),

  diplomes: (arr=[]) => arr.map(d => ({ id: d.id, title: d.title, description: d.description, img: d.imageUrl || "",})),

  certifications: (arr=[]) => arr.map(c => ({ id: c.id, title: c.title,description: c.description, img: c.imageUrl || "",})),
};

// --- ITEM (pour Project : /projects/:id) ---
const mapOne = {
  projects: (p={}) => {
    const images = Array.isArray(p.imagesDesk)
      ? p.imagesDesk.map(img => (img?.url ?? img)).filter(Boolean)
      : [];

    const languages = Array.isArray(p.languages)
      ? p.languages
          .map(l => (typeof l === "string" ? l : (l.name || l.label || l.lang || l.value || "")))
          .filter(Boolean)
      : [];

    const sources = Array.isArray(p.sources)
      ? p.sources
          .map(s =>
            typeof s === "string"
              ? { url: s, label: s }
              : { url: s.url, label: s.label || s.url }
          )
          .filter(x => x && x.url)
      : [];

    return {
      id: p.id,
      title: p.title,
      description: p.description || "",
      cover: p.coverImage?.url || p.coverImageUrl || "",
      images,
      languages,
      gitLink: p.gitLink || "",
      siteLink: p.siteLink || "",
      time: p.time || "",
      difficulty: p.difficulty ?? 0,
      tips: p.tips || "",
      soutenance: p.soutenance || "",
      sources,
    };
  },
};

/** Retourne { ok:true, data } ou { ok:false, data:false, error } */
export async function fetchGoal({ goal, id } = {}) {
  try {
    const base = EP[goal];
    if (!base) {
      return { ok: false, data: false, error: "Endpoint inconnu" };
    }

    const url = `${API_BASE}${base}${id ? `/${id}` : ""}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });

    // cas : item non trouvé
    if (id && res.status === 404) {
      const msg = `Aucun ${goal} ne correspond à votre demande`
      return { ok: false, data: false, error: msg };
    }

    if (!res.ok) {
      return { ok: false, data: false, error: `HTTP ${res.status}` };
    }

    const json = await res.json();
    const normalized = id ? mapOne[goal](json) : mapList[goal](json);
    return { ok: true, data: normalized };
  } catch {
    return { ok: false, data: false, error: "Impossible de contacter l'API, fichier mock en cours d'utilisation" };
  }
}

/** Hook: retourne { data (normalisée ou false), loading, error } */
export function useGoalApi({ goal, id } = {}) {
  const [data, setData] = useState(null);   // liste/objet normalisé OU false
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError("");
      const { ok, data, error } = await fetchGoal({ goal, id });
      if (!cancel) {
        setData(ok ? data : false);
        if (!ok && error) setError(error);
        setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [goal, id]);

  return { data, loading, error };
}