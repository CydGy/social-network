var sanitizer = require('sanitizer');
var recaptcha = require('recaptcha');

var gettext = require('./text.js');


module.exports = function (req, credentials, checks) {

  var lang = req.lang;

  return '<!DOCTYPE html>'
    + '<html lang="' + lang + '">'

      + '<head>'
        + '<title>socialnetwork / ' + gettext(lang, 'title') + '</title>'
        + '<link rel="stylesheet" href="/reset.css">'
        + '<link rel="stylesheet" href="/defaults.css">'
        + '<link rel="stylesheet" href="/buttons.css">'
        + '<link rel="stylesheet" href="/offline/signup.css">'
      + '</head>'

      + '<body>'

        + '<header>'
          + '<nav>'
            + '<div class="lfloat">'
              + '<a href="/">socialnetwork</a>'
            + '</div>'
            + '<div class="rfloat">'
              + '<a href="/login" class="button1 grey">'
                + gettext(lang, 'a sign in')
              + '</a>'
            + '</div>'
          + '</nav>'
        + '</header>'

        + '<main>'

          + (checks.isLimited && recaptcha.personalize('white', lang) || '')
          + form(lang, credentials, checks)

        + '</main>'

        + '<script src="/valid.js"></script>'
        + '<script src="/offline/signup.js"></script>'
        + '<script src="/analytics.js"></script>'

      + '</body>'

    + '</html>';

};


function form (lang, credentials, checks) {

  // sanitize
  var username = sanitizer.escapeHtml(credentials.username);
  var email = sanitizer.escapeHtml(credentials.email);
  var password = sanitizer.escapeHtml(credentials.password);


  return '<form name=signup action="/signup" method=post accept-charset="utf-8"'
          + ' autocomplete=off novalidate>'
    
      /**
       * Username
       */

      + '<div class="prompt username">'
        + '<label for=username>' + gettext(lang, 'label username') + '</label>'
        + '<div class="field">'

          // input
          + '<input type=text id=username name=username maxlength=15'
            + (username && ' value="' + username + '"' || '') // value
            + (!credentials.username && ' autofocus' || '') // focus
          + '>'

          // bottom-tip
          + '<div class="bottom-tip">'

            + '<p class="url username">'
              + 'http://socialnetwork.com/'
              + '<strong>'
                + (username || gettext(lang, 'tip url username'))
              + '</strong>'
            + '</p>'

            + '<p class="checking">'
              + gettext(lang, 'tip checking')
            + '</p>'

            + '<p class="ok' + (checks.isValidUsername && checks.isAvailableUsername && ' active' || '') + '">' + gettext(lang, 'tip ok') + '</p>' // ok
            + '<p class="error' + (checks.isValidUsername === false && ' active' || '') + '">' + gettext(lang, 'tip error alphanumerics') + '</p>' // invalid
            + '<p class="error' + (checks.isAvailableUsername === false && ' active' || '') + '">' + gettext(lang, 'tip error taken') + '</p>' // taken
          + '</div>'

        + '</div>'
      + '</div>'

      /**
       * Email
       */

      + '<div class="prompt email">'
        + '<label for=email>' + gettext(lang, 'label email') + '</label>'
        + '<div class="field">'

          // right-tip
          + '<div class="right-tip">'
            + '<p class="checking">' + gettext(lang, 'tip checking') + '</p>' // validating
            + '<p class="ok' + (checks.isValidEmail && checks.isAvailableEmail && ' active' || '') + '">' + gettext(lang, 'tip ok 2') + '</p>' // ok
            + '<p class="error' + (checks.isValidEmail === false && ' active' || '') + '">' + gettext(lang, 'tip error invalid email') + '</p>' // invalid
            + '<p class="error taken' + (checks.isAvailableEmail === false && ' active' || '')  + '">' // taken
              + gettext(lang, 'tip error email taken part 1')
              + '<a href="/login">' + gettext(lang, 'a log in') + '</a>'
              + gettext(lang, 'tip error email taken part 2')
              + '<a href="/account/resend_password">' + gettext(lang, 'a resend password') + '</a> ?'
            + '</p>'
          + '</div>'

          // input
          + '<input type=text id=email name=email maxlength=300'
            + (email && ' value="' + email + '"' || '') // value
          + '>'

        + '</div>'
      + '</div>'

      /**
       * Password
       */

      + '<div class="prompt password">'
        + '<label for=password>' + gettext(lang, 'label password') + '</label>'
        + '<div class="field">'

          // right-tip
          + '<div class="right-tip">'
            + '<p class="ok' + (checks.isValidPassword && ' active' || '') + '">' + gettext(lang, 'tip ok 2') + '</p>' // ok
            + '<p class="error' + (checks.isValidPassword === false && ' active' || '') + '">' + gettext(lang, 'tip error invalid password') + '</p>' // invalid
          + '</div>'

          // input
          + '<input type=password id=password name=password maxlength=50'
            + (password && ' value="' + password + '"' || '') // value
          + '>'

        + '</div>'
      + '</div>'


      // limited
      + (checks.recaptcha && checks.recaptcha.err && '<p class="error recaptcha-error">'
        + recaptcha.getErrorMessage(checks.recaptcha.err, lang) + '</p>' || '')
      + (checks.isLimited && recaptcha.display() || '' )

      /////////////////////

      // tos
      + '<p class=tos>'
        + gettext(lang, 'p tos 1')
        + '<a href="/tos">' + gettext(lang, 'tos') + '</a>'
        + gettext(lang, 'p tos 2')
        + '<a href="/privacy">' + gettext(lang, 'privacy') + '</a>'
        + '.'
      + '</p>'

      // submit
      + '<button type=submit class="button1 green">'
        + gettext(lang, 'submit')
      + '</button>'

    + '</form>';

}
