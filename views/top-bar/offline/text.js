module.exports = function (lang, text) {

  if (!obj[text]) return '';

  return obj[text][lang] || obj[text].en;

};

var obj = {

  "sign up": {
    en: 'Sign up',
    fr: 'S\'inscrire'
  },

  "log in": {
    en: 'Log in',
    fr: 'Se connecter'
  }

};
