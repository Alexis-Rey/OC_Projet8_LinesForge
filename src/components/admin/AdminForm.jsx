import React, { useEffect, useId, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function AdminEntityForm({ schema, onCancel, onSuccess }) {
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});            // { [name]: File | File[] }
  const [previews, setPreviews] = useState({});      // { [name]: string | string[] }
  const [tags, setTags] = useState({});              // { [name]: string[] }
  const [repeaters, setRepeaters] = useState({});    // { [name]: Array<{...}> }
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('lf_token') : null;

  // init structures par défaut
  useEffect(() => {
    setValues({});
    setFiles({});
    setPreviews({});
    setTags({});
    setRepeaters({});
    setErr('');
    setLoading(false);
  }, [schema]);

  const handleChange = (name, val) => setValues(v => ({ ...v, [name]: val }));

  const handleFile = (name, file) => {
    setFiles(f => ({ ...f, [name]: file }));
    setPreviews(p => ({ ...p, [name]: file ? URL.createObjectURL(file) : '' }));
  };

  const handleFiles = (name, fileList, maxItems) => {
    const arr = Array.from(fileList || []);
    const sliced = maxItems ? arr.slice(0, maxItems) : arr;
    setFiles(f => ({ ...f, [name]: sliced }));
    // previews
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

  // Validation basique (required)
  const validate = () => {
    for (const f of schema.fields) {
      if (!f.required) continue;
      if (f.type === 'file' && !files[f.name]) return `${f.label || f.name} requis`;
      if (f.type === 'files' && !(files[f.name] && files[f.name].length)) return `${f.label || f.name} requis`;
      if (f.type === 'tags' && !(tags[f.name] && tags[f.name].length)) return `${f.label || f.name} requis`;
      if (f.type === 'repeater' && !(repeaters[f.name] && repeaters[f.name].length)) return `${f.label || f.name} requis`;
      const v = values[f.name];
      if (['text','textarea','url','number'].includes(f.type) && f.required && (v === undefined || v === null || String(v).trim() === '')) {
        return `${f.label || f.name} requis`;
      }
    }
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const vErr = validate();
    if (vErr) { setErr(vErr); return; }

    try {
      setLoading(true);
      const fd = new FormData();

      // 1) champs simples
      for (const f of schema.fields) {
        if (['text', 'textarea', 'url', 'number'].includes(f.type)) {
          if (values[f.name] !== undefined) fd.append(f.name, String(values[f.name]));
        }
        if (f.type === 'tags') {
          const arr = tags[f.name] || [];
          fd.append(f.name, JSON.stringify(arr)); // ⚠️ côté back: JSON.parse(req.body[name])
        }
        if (f.type === 'repeater') {
          const items = repeaters[f.name] || [];
          fd.append(f.name, JSON.stringify(items)); // ⚠️ côté back: JSON.parse(req.body[name])
        }
        if (f.type === 'file' && files[f.name]) {
          fd.append(f.name, files[f.name]); // single
        }
        if (f.type === 'files' && Array.isArray(files[f.name])) {
          for (const file of files[f.name]) fd.append(f.name, file); // multiple
        }
      }

      const res = await fetch(`${API_BASE}${schema.endpoint}`, {
        method: schema.method || 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // ne PAS fixer Content-Type, le navigateur ajoute le boundary pour FormData
        },
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const created = await res.json().catch(() => ({}));
      onSuccess?.(created);
    } catch (e) {
      setErr(e.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="adminform" onSubmit={submit} noValidate>
      <div className="adminform__header">
        <button type="button" className="adminform__btn adminform__btn--ghost" onClick={onCancel}>← Retour</button>
        <h3 className="adminform__title">{schema.title}</h3>
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
        />
      ))}

      {err && <p className="adminform__error" role="alert" aria-live="polite">{err}</p>}

      <div className="adminform__actions">
        <button type="button" className="adminform__btn adminform__btn--ghost" onClick={onCancel}>Annuler</button>
        <button className="adminform__btn" disabled={loading}>{loading ? '…' : 'Créer'}</button>
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
    const url = previews[field.name];
    return (
      <div className="adminform__row">
        <label className="adminform__label">{field.label || field.name}{field.required ? ' *' : ''}</label>
        <input
          className="adminform__input"
          type="file"
          name={field.name}
          accept={field.accept || 'image/*'}
          required={field.required}
          onChange={e => onFile(field.name, e.target.files?.[0])}
        />
        {url && <div className="adminform__preview"><img src={url} alt="" /></div>}
      </div>
    );
  }

  if (field.type === 'files') {
    const urls = previews[field.name] || [];
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