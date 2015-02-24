var sanitizer = require('sanitizer');
var recaptcha = require('recaptcha');

var gettext = require('./text.js');


module.exports = function (req, credentials, errors) {

  var lang = req.lang;

  return '<!DOCTYPE html>'
    + '<html lang="' + lang + '">'

      + '<head>'
        + '<title>socialnetwork / ' + gettext(lang, 'title') + '</title>'
        + '<link rel=stylesheet href="/reset.css">'
        + '<link rel=stylesheet href="/defaults.css">'
        + '<link rel=stylesheet href="/buttons.css">'
        + '<link rel=stylesheet href="/offline/login.css">'
      + '</head>'

      + '<body>'

        + '<header>'
          + '<nav>'
            + '<div class=lfloat>'
              + '<a href="/">socialnetwork</a>'
            + '</div>'
            + '<div class=rfloat>'
              + '<a href="/signup" class="button1 green">' + gettext(lang, 'a sign up') + '</a>'
            + '</div>'
          + '</nav>'
        + '</header>'

        + '<main>'
          + (errors.isLimited && recaptcha.personalize('white', lang) || '')
          + form(lang, credentials, errors)
        + '</main>'

        + '<script src="/analytics.js"></script>'

      + '</body>'

    + '</html>';

};


function form (lang, credentials, errors) {

  // sanitize
  var login = sanitizer.escapeHtml(credentials.login);

  // focus
  var focus = 'login';
  if (errors.isLimited) focus = null;
  else if (errors.wrong && credentials.login) focus = 'password';


  return '<form action="/login" method=post accept-charset="utf-8">'

    + (errors.wrong && '<p class=error>' + gettext(lang, 'p error wrong') + '</p>' || '')

    // login
    + '<div class="prompt login">'
      + '<input type=text id=login name="login" autocomplete=on maxlength=300 placeholder="' + gettext(lang, 'login placeholder') + '"'
        + (login && ' value="' + login + '"' || '') // value
        + (focus === 'login' && ' autofocus' || '') // focus
      + '>'
    + '</div>'

    // password
    + '<div class="prompt password">'
      + '<input type=password id=password name="password" maxlength=50 placeholder="' + gettext(lang, 'password placeholder') + '"'
        + (focus === 'password' && ' autofocus' || '') // focus
      + '>'
    + '</div>'

    // recaptcha
    + (errors.recaptchaErr && '<p class="error recaptcha-error">' + recaptcha.getErrorMessage(errors.recaptchaErr, lang) + '</p>' || '')
    + (errors.isLimited && recaptcha.display() || '')

    // submit
    + '<button type=submit class="button1 grey">' + gettext(lang, 'submit') + '</button>'
    
    // remember
    + '<label id=remember><input type=checkbox name=remember value=1 checked>' + gettext(lang, 'checkbox remember') + '</label>'

    // other
    + '<p class="link">'
      + '<a href="/account/send_password_reset">' + gettext(lang, 'a forgot password') + '</a>'
    + '</p>'

  + '</form>';

};
