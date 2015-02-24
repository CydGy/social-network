var sanitizer = require('sanitizer');
var recaptcha = require('recaptcha');

var gettext = require('./text.js');


module.exports = function (req, fields, checks, success) {

  var lang = req.lang;

  if (success) {
    var mainContent = '<p class=success>' + gettext(lang, 'success') + '</p>';
  } else {
    var mainContent = recaptcha.personalize('white', lang)
      + form(lang, fields, checks);
  }

  return '<!DOCTYPE html>'
    + '<html lang="' + lang + '">'

      + '<head>'
        + '<title>socialnetwork / ' + gettext(lang, 'title') + '</title>'
        + '<link rel=stylesheet href="/reset.css">'
        + '<link rel=stylesheet href="/defaults.css">'
        + '<link rel=stylesheet href="/buttons.css">'
        + '<link rel=stylesheet href="/offline/contact.css">'
      + '</head>'

      + '<body>'

        + '<header>'
          + '<nav>'
            + '<div class=lfloat>'
              + '<a href="/">socialnetwork</a>'
            + '</div>'
          + '</nav>'
        + '</header>'

        + '<main>'
          + mainContent
        + '</main>'

        + '<script src="/analytics.js"></script>'

      + '</body>'

    + '</html>';

};


function form (lang, fields, checks) {

  // sanitize
  var email = sanitizer.escapeHtml(fields.email);
  var message = sanitizer.escapeHtml(fields.message);


  return '<form action="/contact" method=post accept-charset="utf-8">'


    + (checks.isLimited
      && '<p class=error>' + gettext(lang, 'p error limited') + '</p>'
      || '')


    /**
     * email
     */

    + (checks.isValidEmail === false
      && '<p class=error>' + gettext(lang, 'p error invalid email') + '</p>'
      || '')

    + '<div class="prompt email">'
      + '<input type=text id=email name=email '
        + 'autocomplete=on maxlength=300 placeholder="' + gettext(lang, 'email placeholder') + '"'
        + (email && ' value="' + email + '"' || '') // value
      + '>'
    + '</div>'

    
    /**
     * message
     */

    + (checks.isValidMessage === false
      && '<p class=error>' + gettext(lang, 'p error invalid message') + '</p>'
      || '')

    + '<div class="prompt message">'
      + '<textarea name=message maxlength=2000>'
        + (message || '')
      + '</textarea>'
    + '</div>'

    
    /**
     * recatpcha
     */

    + (checks.recaptchaErr
      && '<p class="error recaptcha-error">'
          + recaptcha.getErrorMessage(checks.recaptchaErr, lang)
          + '</p>'
      || '')
    + recaptcha.display()

    // submit
    + '<button type=submit class="button1 grey">' + gettext(lang, 'submit') + '</button>'
    
  + '</form>';

};
