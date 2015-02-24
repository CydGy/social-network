var gettext = require('./footer-text.js');


module.exports = function (lang) {

  return '<footer id=page-footer>'

    + '<div class=lfloat>'
      + '<span class=copyright>&copy; 2014 socialnetwork</span>'
      + '<a href="/tos">' + gettext(lang, 'a tos') + '</a>'
      + '<a href="/privacy">' + gettext(lang, 'a privacy') + '</a>'
      + '<a href="/contact">' + gettext(lang, 'a contact') + '</a>'
      + '<a href="/about">' + gettext(lang, 'a about') + '</a>'
      + '<a href="//dev.socialnetwork.com">' + gettext(lang, 'a dev') + '</a>'
      + '<a href="/lang">' + gettext(lang, 'a lang') + '</a>'
    + '</div>'

    + '<div class=rfloat>'
      + '<a class=twitter href="https://twitter.com/socialnetwork"><img src="somicro/noborder/twitter.png"></a>'
      + '<a class=facebook href="https://facebook.com/socialnetwork"><img src="somicro/noborder/facebook.png"></a>'
      + '<a class=github href="https://github.com/socialnetwork"><img src="somicro/noborder/github.png"></a>'
      + '<a class=gplus href="https://plus.google.com/112619336473378640924"><img src="somicro/noborder/gplus2.png"></a>'
      //+ '<a class=linkedin href="https://linkedin.com/socialnetwork"><img src="somicro/noborder/linkedin.png"></a>'
    + '</div>'

  + '</footer>';

};
