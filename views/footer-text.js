module.exports = function (lang, text) {

  if (!obj[text]) return '';

  return obj[text][lang] || obj[text].en;

};

var obj = {

  "a tos": {
    en: 'Terms',
    fr: 'Conditions'
  },

  "a privacy": {
    en: 'Privacy',
    fr: 'Confidentialité'
  },

  "a contact": {
    en: 'Contact',
    fr: 'Contact'
  },

  "a about": {
    en: 'About',
    fr: 'À propos'
  },

  "a dev": {
    en: 'Developers',
    fr: 'Développeurs'
  },

  "a lang": {
    en: 'Language',
    fr: 'Langue'
  }

};
