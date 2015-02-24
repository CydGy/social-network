module.exports = function (req) {

  return '<header id="top-bar">'

    + '<nav>'

      + '<div class=lfloat>'
        + '<a class=socialnetwork href="/">socialnetwork</a>'
      + '</div>'

      + '<div class=rfloat>'
        + '<a href="/' + req.user_doc.username + '">' + req.user_doc.username + '</a>'
      + '</div>'

    + '</nav>'

  + '</header>';

};
