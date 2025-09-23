import React, { useEffect, useState } from "react";

// Chaque endpoints doit toujours commencer par / pour correspondance avec le back 
const endpoints = {
  services: "/api/services",
  projects: "/api/projects",
};

export default function AdminListPanel({ type, title, onBack, onNew, onEdit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  // deletingId ici nous sert uniquement côté front pour savoir quels card est en cours de suppression et éviter un double click 
  const [deletingId, setDeletingId] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  // On récupère les informations de la bdd par type
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true); 
      setErr("");
      try {
        const res = await fetch(`${API_BASE}${endpoints[type]}`,{ headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
        const data = await res.json();
        if (!cancel) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancel) setErr(e.message || "Erreur de chargement");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [type]);

  const handleDelete = async (id) => {
      if (!id) return;
      if (!window.confirm("Supprimer cet élément ?")) return;

      const token = localStorage.getItem('lf_token');
      if (!token) { setErr("Veuillez vous reconnecter."); return; }

      try {
        setDeletingId(id);
        const res = await fetch(`${API_BASE}${endpoints[type]}/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          setErr("Session expirée. Veuillez vous reconnecter.");
          return;
        }
        if (!res.ok) {
          const msg = await res.text().catch(()=>'');
          throw new Error(msg || `HTTP ${res.status}`);
        }

        // en cas de succès de suppresion de la bdd on retire l’item de la liste côté front
        setItems(prev => prev.filter(it => it.id !== id));
      } catch (e) {
        setErr(e.message || "Suppression impossible");
      } finally {
        setDeletingId(null);
      }
  };

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
            {items.map((it) => {
              const id = it.id;
              const isDeleting = deletingId === id;
              return (
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
                        <button className="adminlist__icon" title="Éditer" onClick={() => onEdit?.(id)}>✏️</button>
                        <button 
                          className="adminlist__icon" 
                          title="Supprimer" 
                          onClick={() => handleDelete(it.id)}
                          disabled={isDeleting}>{isDeleting ? '…' : '🗑️'}</button>
                      </div>
                    </li>
                    )
              })
            }
          </ul>
        ) : (
          <p className="adminlist__status adminlist__status--empty">Aucun élément.</p>
        )
      )}
    </section>
  );
}