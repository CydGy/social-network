module.exports = function (lang, text) {

  if (!obj[text]) return '';

  return obj[text][lang] || obj[text].en;

};

var obj = {

  "title": {
    en: 'Sign up',
    fr: "S'inscrire"
  },

  "a sign in": {
    en: 'Sign in',
    fr: 'Se connecter'
  },


  "label username": {
    en: 'Choose your username',
    fr: 'Choisis ton pseudo'
  },

  "label email": {
    en: 'Email',
    fr: 'Email'
  },

  "label password": {
    en: 'Password',
    fr: 'Mot de passe'
  },


  "tip url username": {
    en: 'username',
    fr: 'pseudo'
  },

  "tip checking": {
    en: 'Validating...',
    fr: 'Validation...'
  },

  "tip ok": {
    en: 'Yeaaaah!',
    fr: 'Yeaaaah!'
  },

  "tip error alphanumerics": {
    en: 'Alphanumerics only!',
    fr: 'Alphanumériques seulement!'
  },

  "tip error taken": {
    en: 'Already taken!',
    fr: 'Déjà pris!'
  },

  "tip ok 2": {
    en: 'Ok',
    fr: 'Ok'
  },

  "tip error invalid email": {
    en: 'Doesn\'t look like a valid email.',
    fr: 'Ça ne semble pas être un email valide.'
  },

  "tip error email taken part 1": {
    en: 'This email is already registered. Want to ',
    fr: 'Cette adresse email est déjà utilisée. Souhaitez-vous vous ',
  },

  "a log in": {
    en: 'log in',
    fr: 'connecter'
  },

  "tip error email taken part 2": {
    en: ' or ',
    fr: ' ou '
  },

  "a resend password": {
    en: 'recorver your password',
    fr: 'récupérer votre mot de passe'
  },

  "tip error invalid password": {
    en: 'At least 4 characters.',
    fr: 'Au moins 4 caractères.'
  },


  /**
   * tos
   */

  "p tos 1": {
    en: 'By clicking on "Create my account" below, you are agreeing to the ',
    fr: 'En cliquant sur le bouton, vous acceptez les '
  },

  "tos": {
    en: 'Terms of Service',
    fr: 'Conditions d\'Utilisation'
  },
  
  "p tos 2": {
    en: ' and the ',
    fr: ' et la '
  },

  "privacy": {
    en: 'Privacy Policy',
    fr: 'Politique de confidentialité'
  },


  /**
   * submit
   */

  "submit": {
    en: 'Create my account',
    fr: 'Créer mon compte'
  },



  "end": {}

};
