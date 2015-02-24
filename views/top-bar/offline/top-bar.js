var gettext = require('./text.js');


module.exports = function (lang) {

  return '<header id="top-bar">'

    + '<nav>'

      + '<div class=lfloat>'
        + '<a class=socialnetwork href="/">socialnetwork</a>'
      + '</div>'

      + '<div class=rfloat>'
        + '<a href="/signup" class="button1 green">'
          + gettext(lang, 'sign up')
        + '</a>'
        + '<a href="/login" class="button1 grey">'
          + gettext(lang, 'log in')
        + '</a>'
      + '</div>'

    + '</nav>'

  + '</header>';

};
