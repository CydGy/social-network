module.exports = function (currentLang) {

  return '<!DOCTYPE html>'
  + '<html>'

    + '<head>'
      + '<title>socialnetwork / Languages</title>'
      + '<link rel=stylesheet href="/reset.css">'
      + '<link rel=stylesheet href="/defaults.css">'
      + '<link rel=stylesheet href="/lang.css">'
    + '</head>'

    + '<body>'

      + '<header>'
        + '<nav>'
          + '<a href="/">socialnetwork</a>'
        + '</nav>'
      + '</header>'

      + '<main>'

        // en
        + '<a href="/lang?lang=en"' + isCurrentLang('en') + '>'
          + (currentLang === 'en' && '> ' || '')
          + 'English'
        + '</a>'

        // fr
        + '<a href="/lang?lang=fr"' + isCurrentLang('fr') + '>'
          + (currentLang === 'fr' && '> ' || '')
          + 'français'
        + '</a>'

      + '</main>'

      + '<script src="/analytics.js"></script>'

    + '</body>'
  + '</html>';

  function isCurrentLang (lang) {
    if (lang === currentLang) return ' style="font-weight: bold;"';
    else return '';
  }

};
