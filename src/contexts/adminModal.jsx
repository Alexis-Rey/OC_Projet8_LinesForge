import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const Ctx = createContext(null);

export function AdminModalProvider({ children }) {
  const [isOpen, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);      // activé après le 1er clic qui dévoile la landing
  const [clicks, setClicks] = useState(0);

  const open  = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  // déclencheur secret : compter les clics une fois "armé"
  const armAdminLogo = useCallback(() => {
    setArmed(true);
    setClicks(0);
  }, []);

  const registerAdminLogoClick = useCallback(() => {
    if (!armed) return;
    setClicks(prev => {
      const next = prev + 1;
      if (next >= 5) { setOpen(true); return 0; }   // ouvre à 5 clics puis reset
      return next;
    });
  }, [armed]);

  // lock du scroll quand la modale est ouverte
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const value = {
    isOpen, open, close,
    armAdminLogo, registerAdminLogoClick,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminModal doit être utiliser dans AdminModalProvider");
  return ctx;
}