import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useAdminModal } from '../contexts/adminModal';
// import { login } from '../api/auth'; // quand tu branches l’API
import AdminListPanel from './AdminListPanel';

Modal.setAppElement('#root');

export default function AdminModal() {
    const { isOpen, close } = useAdminModal();
    const [step, setStep] = useState('login');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const userRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
        setStep('login');
        setErr('');
        setLoading(false);
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
        // TODO: branchement réel
        // await login(username, password);
        setStep('hub');
        } catch (e) {
        setErr(e.message || 'Connexion échouée');
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
                <form className="adminmodal__form" onSubmit={handleLogin}>
                    <label><span>Pseudo</span><input name="username" ref={userRef} required /></label>
                    <label><span>Mot de passe</span><input name="password" type="password" required /></label>
                    <button className="adminmodal__cta">Connexion</button>
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
                onBack={() => setStep('hub')}
                onNew={() => {/* plus tard: step 'project:new' */}}
                />
            )}

            {step === 'services' && (
                <AdminListPanel
                type="services"
                title="Mes services"
                onBack={() => setStep('hub')}
                onNew={() => {/* plus tard: step 'service:new' */}}
                />
            )}
        </Modal>
    );
}