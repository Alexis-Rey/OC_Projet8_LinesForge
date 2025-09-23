import React, { useEffect, useId, useMemo, useState } from 'react';

export default function AdminEntityForm({ schema, mode, passingId, onCancel, onSuccess }) {
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});            // { [name]: File | File[] }
  const [previews, setPreviews] = useState({});      // { [name]: string | string[] }
  const [tags, setTags] = useState({});              // { [name]: string[] }
  const [repeaters, setRepeaters] = useState({});    // { [name]: Array<{...}> }
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
  const token = typeof window !== 'undefined' ? localStorage.getItem('lf_token') : null;
  const editMode = mode === 'edit';

  // reset structures quand le schéma change (entre services, projets, skills, etc..)
  useEffect(() => {
    setValues({});
    setFiles({});
    setPreviews({});
    setTags({});
    setRepeaters({});
    setErr('');
    setLoading(false);
  }, [schema]);

  // Charger l'entité en mode édition pour pré-remplir
  useEffect(() => {
    let cancel = false;
    if (!editMode || !passingId) return; // vérification de sécurité de la présence du mode edit et de l'id

    (async () => {
      try {
        setLoading(true);
        setErr('');
        const url = `${API_BASE}${schema.endpoint}/${passingId}`;
        const res = await fetch(url, {
          headers: {
            Accept: 'application/json',
          },
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => '');
          throw new Error(msg || `HTTP ${res.status}`);
        }
        const data = await res.json();

        if (cancel) return;

        // On va ensuite mapper les valeurs reçues depuis la BDD dans nos états
        const nextValues = {};
        const nextTags = {};
        const nextRepeaters = {};

        for (const f of schema.fields) {
          const v = data[f.name];

          if (['text', 'textarea', 'url', 'number'].includes(f.type)) {
            nextValues[f.name] = v ?? '';
          }

          if (f.type === 'tags') {
            nextTags[f.name] = Array.isArray(v) ? v : [];
          }

          if (f.type === 'repeater') {
            nextRepeaters[f.name] = Array.isArray(v) ? v : [];
          }

          if (f.type === 'file') {
            // On stocke l’URL existante (si le back renvoie "imageUrl" ou le même nom)
            nextValues[f.name] = v || data[`${f.name}Url`] || data.imageUrl || '';
          }

          if (f.type === 'files') {
            // Tableau d'URLs (ou objets { url })
            const arr = Array.isArray(v) ? v : [];
            nextValues[f.name] = arr.map(x => (typeof x === 'string' ? x : (x?.url || ''))).filter(Boolean);
          }
        }

        setValues(nextValues);
        setTags(nextTags);
        setRepeaters(nextRepeaters);
      } catch (e) {
        if (!cancel) setErr(e.message || 'Chargement impossible');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => { cancel = true; };
  }, [editMode, passingId]);

  const handleChange = (name, val) => setValues(v => ({ ...v, [name]: val }));

  const handleFile = (name, file) => {
    setFiles(f => ({ ...f, [name]: file }));
    setPreviews(p => ({ ...p, [name]: file ? URL.createObjectURL(file) : '' }));
  };

  const handleFiles = (name, fileList, maxItems) => {
    const arr = Array.from(fileList || []);
    const sliced = maxItems ? arr.slice(0, maxItems) : arr;
    setFiles(f => ({ ...f, [name]: sliced }));
    const urls = sliced.map(f => URL.createObjectURL(f));
    setPreviews(p => ({ ...p, [name]: urls }));
  };

  const addTag = (fieldName, raw) => {
    const t = (raw || '').trim();
    if (!t) return;
    setTags(m => ({ ...m, [fieldName]: Array.from(new Set([...(m[fieldName] || []), t])) }));
  };
  const removeTag = (fieldName, t) => {
    setTags(m => ({ ...m, [fieldName]: (m[fieldName] || []).filter(x => x !== t) }));
  };

  const addRepeaterItem = (fieldName, itemFields) => {
    const empty = {};
    itemFields.forEach(f => { empty[f.name] = ''; });
    setRepeaters(r => ({ ...r, [fieldName]: [ ...(r[fieldName]||[]), empty ] }));
  };
  const updateRepeaterItem = (fieldName, index, item) => {
    setRepeaters(r => {
      const copy = (r[fieldName] || []).slice();
      copy[index] = item;
      return { ...r, [fieldName]: copy };
    });
  };
  const removeRepeaterItem = (fieldName, index) => {
    setRepeaters(r => {
      const copy = (r[fieldName] || []).slice();
      copy.splice(index,1);
      return { ...r, [fieldName]: copy };
    });
  };

  // Validation: on vérifie la présence des champs requis sinon on le signale avant submit
  const validate = () => {
    for (const f of schema.fields) {
      if (!f.required) continue;

      if (['text','textarea','url','number'].includes(f.type)) {
        const v = values[f.name];
        if (v === undefined || v === null || String(v).trim() === '') return `${f.label || f.name} requis`;
      }

      if (f.type === 'tags') {
        if (!(tags[f.name] && tags[f.name].length)) return `${f.label || f.name} requis`;
      }

      if (f.type === 'repeater') {
        if (!(repeaters[f.name] && repeaters[f.name].length)) return `${f.label || f.name} requis`;
      }

      if (f.type === 'file') {
        const hasNew = !!files[f.name];
        const existing = values[f.name] || values[`${f.name}Url`] || values.imageUrl;
        if (!editMode) {
          if (!hasNew) return `${f.label || f.name} requis`;
        } else {
          if (!hasNew && !existing) return `${f.label || f.name} requis`;
        }
      }

      if (f.type === 'files') {
        const hasNew = Array.isArray(files[f.name]) && files[f.name].length > 0;
        const existingCount = Array.isArray(values[f.name]) ? values[f.name].length : 0;
        if (!editMode) {
          if (!hasNew) return `${f.label || f.name} requis`;
        } else {
          if (!hasNew && existingCount === 0) return `${f.label || f.name} requis`;
        }
      }
    }
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const vErr = validate();
    if (vErr) { setErr(vErr); return; } // si présence d'une erreur de champs incomplet on le signale ici 

    try {
      setLoading(true);
      const fd = new FormData(); //création d'un nouveau formulaire qui contiendra les éléments indiqués dans le schéma

      // 1) champs simples
      for (const f of schema.fields) {
        if (['text', 'textarea', 'url', 'number'].includes(f.type)) {
          if (values[f.name] !== undefined) fd.append(f.name, String(values[f.name]));
        }
        if (f.type === 'tags') {
          const arr = tags[f.name] || [];
          fd.append(f.name, JSON.stringify(arr)); 
        }
        if (f.type === 'repeater') {
          const items = repeaters[f.name] || [];
          fd.append(f.name, JSON.stringify(items)); 
        }
        if (f.type === 'file' && files[f.name]) {
          fd.append(f.name, files[f.name]); // seulement si nouveau fichier
        }
        if (f.type === 'files' && Array.isArray(files[f.name])) {
          for (const file of files[f.name]) fd.append(f.name, file); // seulement les nouveaux
        }
      }

      const url = editMode
        ? `${API_BASE}${schema.endpoint}/${passingId}`
        : `${API_BASE}${schema.endpoint}`;

      const method = editMode ? 'PUT' : (schema.method || 'POST');

      const res = await fetch(url, {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // NE PAS fixer Content-Type pour FormData
        },
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const payload = await res.json().catch(() => ({}));
      onSuccess?.(payload);
    } catch (e) {
      setErr(e.message || (editMode ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="adminform" onSubmit={submit} noValidate>
      <div className="adminform__header">
        <button type="button" className="adminform__btn adminform__btn--ghost" onClick={onCancel}>← Retour</button>
        <h3 className="adminform__title">
          {schema.title}{editMode ? ' — Modifier' : ' — Nouveau'}
        </h3>
        <div />
      </div>

      {schema.fields.map((f) => (
        <FieldRow
          key={f.name}
          field={f}
          value={values[f.name]}
          onChange={handleChange}
          files={files}
          previews={previews}
          onFile={handleFile}
          onFiles={handleFiles}
          tags={tags}
          addTag={addTag}
          removeTag={removeTag}
          repeaters={repeaters}
          addRepeaterItem={addRepeaterItem}
          updateRepeaterItem={updateRepeaterItem}
          removeRepeaterItem={removeRepeaterItem}
          editMode={editMode}
        />
      ))}

      {err && <p className="adminform__error" role="alert" aria-live="polite">{err}</p>}

      <div className="adminform__actions">
        <button type="button" className="adminform__btn adminform__btn--ghost" onClick={onCancel}>Annuler</button>
        <button className="adminform__btn" disabled={loading}>{loading ? '…' : (editMode ? 'Enregistrer' : 'Créer')}</button>
      </div>
    </form>
  );
}

/* --------------------- champs --------------------- */

function FieldRow(props) {
  const {
    field, value, onChange,
    files, previews, onFile, onFiles,
    tags, addTag, removeTag,
    repeaters, addRepeaterItem, updateRepeaterItem, removeRepeaterItem,
    editMode,
  } = props;
  const id = useId();

  if (field.type === 'text' || field.type === 'url' || field.type === 'number') {
    return (
      <div className="adminform__row">
        <label className="adminform__label" htmlFor={id}>{field.label || field.name}{field.required ? ' *' : ''}</label>
        <input
          id={id}
          className="adminform__input"
          type={field.type === 'number' ? 'number' : (field.type === 'url' ? 'url' : 'text')}
          name={field.name}
          required={field.required}
          maxLength={field.maxLength}
          min={field.min}
          max={field.max}
          step={field.step}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={e => onChange(field.name, e.target.value)}
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="adminform__row">
        <label className="adminform__label" htmlFor={id}>{field.label || field.name}{field.required ? ' *' : ''}</label>
        <textarea
          id={id}
          className="adminform__textarea"
          name={field.name}
          required={field.required}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={e => onChange(field.name, e.target.value)}
          rows={6}
        />
      </div>
    );
  }

  if (field.type === 'file') {
    // preview locale si nouveau fichier, sinon URL existante du back (value)
    const url = previews[field.name] || value || '';
    return (
      <div className="adminform__row">
        <label className="adminform__label">{field.label || field.name}{field.required ? ' *' : ''}</label>
        <input
          className="adminform__input"
          type="file"
          name={field.name}
          accept={field.accept || 'image/*'}
          // en édition, on ne rend pas obligatoire si une image existe déjà
          required={field.required && !editMode}
          onChange={e => onFile(field.name, e.target.files?.[0])}
        />
        {url && (
          <div className="adminform__preview">
            <img src={url} alt="" />
            {editMode && !previews[field.name] && <small>Image actuelle — laissez vide pour la conserver.</small>}
          </div>
        )}
      </div>
    );
  }

  if (field.type === 'files') {
    // Si pas de nouveaux fichiers sélectionnés, on affiche les URLs existantes (value = array d’urls)
    const urls = (previews[field.name] && previews[field.name].length)
      ? previews[field.name]
      : (Array.isArray(value) ? value : []);

    return (
      <div className="adminform__row">
        <label className="adminform__label">{field.label || field.name}</label>
        <input
          className="adminform__input"
          type="file"
          name={field.name}
          accept={field.accept || 'image/*'}
          multiple
          onChange={e => onFiles(field.name, e.target.files, field.maxItems)}
        />
        {urls.length > 0 && (
          <div className="adminform__previewgrid">
            {urls.map((u, i) => <img key={i} src={u} alt="" />)}
          </div>
        )}
        {editMode && !previews[field.name] && urls.length > 0 && (
          <small>Images actuelles — ne rien choisir pour les conserver.</small>
        )}
      </div>
    );
  }

  if (field.type === 'tags') {
    const list = tags[field.name] || [];
    const [input, setInput] = useState('');
    return (
      <div className="adminform__row">
        <label className="adminform__label">{field.label || field.name}{field.required ? ' *' : ''}</label>
        <div className="adminform__tags">
          <input
            className="adminform__input"
            type="text"
            placeholder={field.placeholder || 'Ajoutez un tag puis Entrée'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); addTag(field.name, input); setInput(''); }
            }}
          />
          <div className="adminform__taglist">
            {list.map(t => (
              <button key={t} type="button" className="adminform__tag" onClick={() => removeTag(field.name, t)}>{t} ×</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (field.type === 'repeater') {
    const items = repeaters[field.name] || [];
    return (
      <div className="adminform__row">
        <label className="adminform__label">{field.label || field.name}</label>
        <div className="adminform__repeater">
          {items.map((item, idx) => (
            <div key={idx} className="adminform__repeater-item">
              {field.itemFields.map((sub) => (
                <div className="adminform__repeater-col" key={sub.name}>
                  <label className="adminform__subLabel">{sub.label || sub.name}{sub.required ? ' *' : ''}</label>
                  <input
                    className="adminform__input"
                    type={sub.type === 'url' ? 'url' : 'text'}
                    value={item[sub.name] || ''}
                    onChange={e => updateRepeaterItem(field.name, idx, { ...item, [sub.name]: e.target.value })}
                    required={sub.required}
                  />
                </div>
              ))}
              <button type="button" className="adminform__btn adminform__btn--ghost" onClick={() => removeRepeaterItem(field.name, idx)}>Supprimer</button>
            </div>
          ))}
          <button type="button" className="adminform__btn" onClick={() => addRepeaterItem(field.name, field.itemFields)}>Ajouter</button>
        </div>
      </div>
    );
  }

  return null;
}