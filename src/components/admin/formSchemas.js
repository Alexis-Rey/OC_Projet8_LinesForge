export const FORM_SCHEMAS = {
  services: {
    title: 'Nouveau service',
    endpoint: '/api/services',
    method: 'POST',
    fields: [
      { type: 'text', name: 'title', label: 'Titre', required: true, maxLength: 150 },
      { type: 'textarea', name: 'description', label: 'Description', required: true, maxLength: 5000 },
      { type: 'file', name: 'image', label: 'Image', required: true, accept: 'image/*' },
    ],
  },

  projects: {
    title: 'Nouveau projet',
    endpoint: '/api/projects',
    method: 'POST',
    fields: [
      { type: 'text', name: 'title', label: 'Titre', required: true, maxLength: 150 },
      { type: 'textarea', name: 'description', label: 'Description (Markdown)', required: true, maxLength: 10000 },
      { type: 'file', name: 'cover', label: 'Cover', required: true, accept: 'image/*' },
      { type: 'files', name: 'imagesDesk', label: 'Images (carrousel desktop)', accept: 'image/*', maxItems: 12 },

      // données “texte”
      { type: 'tags', name: 'languages', label: 'Langages (tags)', required: true, placeholder: 'ex: HTML, CSS, React' },
      { type: 'text', name: 'time', label: 'Durée / temps', required: true },
      { type: 'number', name: 'difficulty', label: 'Difficulté (0–5)', min: 0, max: 5, step: 1, required: true },
      { type: 'url', name: 'gitLink', label: 'Lien GitHub (optionnel)'},
      { type: 'url', name: 'siteLink', label: 'Lien du site (optionnel)' },
      { type: 'textarea', name: 'tips', label: 'Tips (optionnel)', maxLength: 5000 },
      { type: 'textarea', name: 'soutenance', label: 'Soutenance (optionnel)', maxLength: 5000 },

      // tableau d’objets {label, url}
      { type: 'repeater', name: 'sources', label: 'Sources (label + url)', itemFields: [
        { type: 'text', name: 'label', label: 'Label', required: true },
        { type: 'url',  name: 'url',   label: 'URL',   required: true },
      ]},
    ],
  },

  skills: {
    title: 'Nouveau Skill',
    endpoint: '/api/skills',
    method: 'POST',
    fields: [
      { type: 'text', name: 'title', label: 'Titre', required: true, maxLength: 150 },
      { type: 'textarea', name: 'description', label: 'Description', required: true, maxLength: 5000 },
      { type: 'file', name: 'image', label: 'Image', required: true, accept: 'image/*' },
    ],
  },

  diplomes: {
    title: 'Nouveau Diplôme',
    endpoint: '/api/diplomes',
    method: 'POST',
    fields: [
      { type: 'text', name: 'title', label: 'Titre', required: true, maxLength: 150 },
      { type: 'textarea', name: 'description', label: 'Description', required: true, maxLength: 5000 },
      { type: 'file', name: 'image', label: 'Image', required: true, accept: 'image/*' },
    ],
  },

  certifications: {
    title: 'Nouvelle Certification',
    endpoint: '/api/certifications',
    method: 'POST',
    fields: [
      { type: 'text', name: 'title', label: 'Titre', required: true, maxLength: 150 },
      { type: 'textarea', name: 'description', label: 'Description', required: true, maxLength: 5000 },
      { type: 'file', name: 'image', label: 'Image', required: true, accept: 'image/*' },
    ],
  },
};