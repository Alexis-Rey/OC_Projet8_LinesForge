import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const endpoints = {
  services: "/api/services",
  projects: "/api/projects",
};

export default function AdminListPanel({ type, title, onBack, onNew }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true); setErr("");
      try {
        const res = await fetch(`${API_BASE}${endpoints[type]}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
        if (!cancel) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancel) setErr(e.message || "Erreur de chargement");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [type]);

  const thumb = (it) => {
    if (type === "services") return it.imageUrl;
    if (type === "projects") return it.coverImage?.url || it.coverImageUrl;
    return "";
  };

  return (
    <section className="adminlist">
      <div className="adminlist__bar">
        <button className="adminlist__btn adminlist__btn--back" onClick={onBack}>Retour</button>
        <h2 className="adminlist__title">{title}</h2>
        <button className="adminlist__btn adminlist__btn--new" onClick={onNew}>New</button>
      </div>

      {loading && <p className="adminlist__status adminlist__status--loading">Chargement…</p>}
      {err && <p className="adminlist__status adminlist__status--error">{err}</p>}

      {!loading && !err && (
        items.length ? (
          <ul className="adminlist__grid">
            {items.map((it) => (
              <li key={it.id || it._id} className="adminlist__card">
                <div className="adminlist__thumb">
                  {thumb(it)
                    ? <img src={thumb(it)} alt="" loading="lazy" />
                    : <div className="adminlist__thumb--empty">—</div>}
                </div>
                <div className="adminlist__meta">
                  <strong className="adminlist__item-title">{it.title}</strong>
                </div>
                <div className="adminlist__actions">
                  <button className="adminlist__icon" title="Éditer">✏️</button>
                  <button className="adminlist__icon" title="Supprimer">🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="adminlist__status adminlist__status--empty">Aucun élément.</p>
        )
      )}
    </section>
  );
}