import raw from './data.json';

const addBase = (p = '') => {
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;           // URLs externes inchangées
  const base = import.meta.env.BASE_URL;           // "/" en dev, "/OC_Projet8_LinesForge/" en prod
  return base + p.replace(/^\/+/, '');             // enlève les "/" du début
};

const mapImg = (arr = []) => arr.map(addBase);

const data = {
  ...raw,
  services: (raw.services || []).map(s => ({ ...s, img: addBase(s.img) })),
  skills:   (raw.skills   || []).map(s => ({ ...s, img: addBase(s.img) })),
  projects: (raw.projects || []).map(p => ({
    ...p,
    coverImage: addBase(p.coverImage),
    imagesDesk: mapImg(p.imagesDesk),
    imagesMob:  mapImg(p.imagesMob),
  })),
  certificats: (raw.certificats || []).map(c => ({ ...c, img: addBase(c.img) })),
  diplomes:    (raw.diplomes    || []).map(d => ({ ...d, img: addBase(d.img) })),
};

export default data;