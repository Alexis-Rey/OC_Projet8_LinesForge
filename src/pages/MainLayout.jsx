import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainLayout(){
      const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // si on a un #ancre -> scroll à l’ancre 
      const el = document.getElementById(hash.slice(1));
      if (el) {
        const header = document.querySelector(".header");
        const h = header?.offsetHeight ?? 0;
        const y = el.getBoundingClientRect().top + window.pageYOffset - h;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      // pas de hash -> on force tout en haut
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, hash]);
    return <>
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer />
    </>
};

export default MainLayout;