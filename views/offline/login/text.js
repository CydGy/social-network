module.exports = function (lang, text) {

  if (!obj[text]) return '';

  return obj[text][lang] || obj[text].en;

};

var obj = {

  "title": {
    en: 'Log in',
    fr: 'Se connecter'
  },

  "a sign up": {
    en: 'Sign up',
    fr: 'S\'inscrire'
  },

  "p error wrong": {
    en: 'Wrong Username/Email and password combination.',
    fr: 'Mauvaise combinaison de Pseudo/Email et mot de passe.'
  },

  "login placeholder": {
    en: 'Username or email',
    fr: 'Pseudo ou email'
  },

  "password placeholder": {
    en: 'Password',
    fr: 'Mot de passe'
  },
  
  "submit": {
    en: 'Sign in',
    fr: 'Se connecter'
  },

  "checkbox remember": {
    en: 'Remember me',
    fr: 'Se souvenir de moi'
  },

  "a forgot password": {
    en: 'Forgot password',
    fr: 'Mot de passe oublié'
  }

};
