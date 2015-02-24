module.exports = function (photoId) {

  return '<form action="/report/photo" method=post>'

      + '<input type=hidden name=photoId value="' + photoId + '">'

      // radio
      + '<label>'
        + '<input type=radio name=reason value=porno required>'
        + 'This is a pornographic picture'
      + '</label>'
      + '<br>'

      // radio
      + '<label>'
        + '<input type=radio name=reason value=nohuman required>'
        + 'This is not a real human'
      + '</label>'
      + '<br>'

      + '<button type=submit>Report</button>'
    + '</form>'
    
    + '<script src="/analytics.js"></script>';

};
