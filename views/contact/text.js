module.exports = function (lang, text) {

  if (!obj[text]) return '';

  return obj[text][lang] || obj[text].en;

};

var obj = {

  "title": {
    en: 'Contact',
    fr: 'Contact'
  },

  "email placeholder": {
    en: 'Email',
    fr: 'Email'
  },

  "submit": {
    en: 'Submit',
    fr: 'Envoyer'
  },

  "p error invalid email": {
    en: 'Your email is invalid.',
    fr: 'Votre email est invalide.'
  },

  "p error invalid message": {
    en: 'Your message is too long.',
    fr: 'Votre message est trop long.'
  },

  "p error limited": {
    en: 'You\'ve already sent a message, please wait.',
    fr: 'Vous avez déjà envoyé un message, veuillez patientier.'
  },

  "success": {
    en: 'Your message has been sent.',
    fr: 'Votre message vient d\'être envoyé.'
  }

};
