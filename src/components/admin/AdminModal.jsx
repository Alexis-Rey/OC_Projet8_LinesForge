import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useAdminModal } from '../../contexts/adminModal';
import AdminListPanel from './AdminListPanel';
import AdminForm from './AdminForm';
import { FORM_SCHEMAS } from './formSchemas';

Modal.setAppElement('#root');

export default function AdminModal() {
  const { isOpen, close } = useAdminModal(); // modal ouvert ou fermé 
  const [step, setStep] = useState('login'); // "pas" réprentant les pages à afficher
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // id en cours d’édition
  const userRef = useRef(null);
  const passRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    if (isOpen) {
      setStep('login');
      setErr('');
      setLoading(false);
      setEditingId(null);  // reset de l'id pour éviter un ancien 
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    const f = new FormData(e.currentTarget);
    const username = f.get('username')?.toString().trim();
    const password = f.get('password')?.toString();

    if (!username || !password) {
      setErr('Champs requis');
      setLoading(false);
      return;
    }

    try {
      // URL sûre (évite double base)
      const url = new URL('/api/auth/login', API_BASE).toString();

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        const payload = ct.includes('application/json')
          ? await res.json().catch(() => null)
          : await res.text().catch(() => '');

        if (res.status === 401) {
          setErr((payload && payload.message) || 'Identifiants incorrects. Réessayez.');
          if (passRef.current) {
            passRef.current.value = '';
            passRef.current.focus();
          }
          return;
        }

        if (res.status === 429) {
          const retry = res.headers.get('Retry-After');
          setErr(`Trop de tentatives. Réessayez ${retry ? `dans ${retry} s` : 'plus tard'}.`);
          return;
        }

        if (res.status >= 500) {
          setErr('Erreur serveur. Réessayez plus tard.');
          return;
        }

        setErr((payload && payload.message) || `Erreur HTTP ${res.status}`);
        return;
      }

      const { token, user } = await res.json();
      localStorage.setItem('lf_token', token);
      localStorage.setItem('lf_user', JSON.stringify(user));
      setStep('hub');
    } catch (e) {
      setErr('Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      onAfterOpen={() => userRef.current?.focus()}
      contentLabel="Administration LinesForge"
      className={{
        base: 'adminmodal__dialog',
        afterOpen: ' adminmodal__dialog--open',
        beforeClose: ' adminmodal__dialog--close',
      }}
      overlayClassName={{
        base: 'adminmodal__backdrop',
        afterOpen: ' adminmodal__backdrop--open',
        beforeClose: ' adminmodal__backdrop--close',
      }}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
    >
      <button className="adminmodal__close" onClick={close} aria-label="Fermer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true" width={24} height={24}>
          <path fill="currentColor" d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"/>
        </svg>
      </button>

      {step === 'login' && (
        <section className="adminmodal__panel">
          <h2 className="adminmodal__title">Ravie de vous revoir</h2>
          <form className="adminmodal__form" onSubmit={handleLogin} noValidate>
            <label>
              <span>Pseudo</span>
              <input name="username" ref={userRef} required />
            </label>
            <label>
              <span>Mot de passe</span>
              <input name="password" type="password" ref={passRef} required />
            </label>
            {err && <p className="adminmodal__error" role="alert" aria-live="assertive">{err}</p>}
            <button className="adminmodal__cta" disabled={loading}>{loading ? 'Connexion…' : 'Connexion'}</button>
          </form>
        </section>
      )}

      {step === 'hub' && (
        <section className="adminmodal__panel">
          <h2 className="adminmodal__title">Bienvenue Alexis</h2>
          <div className="adminmodal__grid">
            <button className="adminmodal__card" onClick={() => setStep('projects')}>Projets</button>
            <button className="adminmodal__card" onClick={() => setStep('services')}>Services</button>
            <button className="adminmodal__card" disabled>Diplôme</button>
            <button className="adminmodal__card" disabled>Certifs</button>
            <button className="adminmodal__card" disabled>Skills</button>
          </div>
        </section>
      )}

      {step === 'projects' && (
        <AdminListPanel
          type="projects"
          title="Mes projets"
          onBack={() => {setEditingId(null); setStep('hub'); }}
          onNew={() => {setEditingId(null); setStep('projects:new');}}
          onEdit={(id) => {setEditingId(id);setStep('projects:edit')}}
        />
      )}

      {step === 'services' && (
        <AdminListPanel
          type="services"
          title="Mes services"
          onBack={() => {setEditingId(null); setStep('hub'); }}
          onNew={() => {setEditingId(null); setStep('services:new');}}
          onEdit={(id) => {setEditingId(id);setStep('services:edit')}}
        />
      )}

      {step === 'projects:new' && (
        <AdminForm
          schema={FORM_SCHEMAS.projects}
          mode = "create"
          onCancel={() => setStep('projects')}
          onSuccess={() => setStep('projects')}
        />
      )}

      {step === 'services:new' && (
        <AdminForm
          schema={FORM_SCHEMAS.services}
          mode = "create"
          onCancel={() => setStep('services')}
          onSuccess={() => setStep('services')}
        />
      )}

      {step === 'projects:edit' && editingId && (
        <AdminForm
          schema={FORM_SCHEMAS.projects}
          mode = "edit"
          passingId = {editingId}
          onCancel={() => { setEditingId(null); setStep('projects'); }}
          onSuccess={() => { setEditingId(null); setStep('projects'); }}
        />
      )}

      {step === 'services:edit' && editingId && (
        <AdminForm
          schema={FORM_SCHEMAS.services}
          mode = "edit"
          passingId = {editingId}
          onCancel={() => { setEditingId(null); setStep('services'); }}
          onSuccess={() => { setEditingId(null); setStep('services'); }}
        />
      )}
    </Modal>
  );
}