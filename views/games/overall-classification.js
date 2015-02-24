// TODO rename to "allFace"

var topBarOffline = require('../top-bar/offline/top-bar.js');
var topBarOnline = require('../top-bar/online/top-bar.js');
var footer = require('../footer.js');


module.exports = function (req, user_doc, embedded_photos, pagesCount, page) {

  return '<!DOCTYPE html>'
    + '<html lang=' + req.lang + '>'

    + '<head>'
      //+ '<meta charset="utf-8">'
      //+ '<meta name=description content="">' // index only
      + '<title>socialnetwork | All faces</title>'
      + '<link rel=stylesheet href="/reset.css">'
      + '<link rel=stylesheet href="/defaults.css">'
      + '<link rel=stylesheet href="/buttons.css">'
      + '<link rel=stylesheet href="/top-bar/top-bar-online.css">'
      + '<link rel=stylesheet href="/top-bar/top-bar-offline.css">'
      + '<link rel=stylesheet href="/page/allFaces.css">'
      + '<link rel=stylesheet href="/footer.css">'
    + '</head>'

    + '<body>'

      + (user_doc && topBarOnline(req) || topBarOffline(req.lang))

      + '<main id=content>'

        + '<div class="all-faces-wrapper">'
          + '<ul class="faces-list">'
            + getFaces(embedded_photos)
          + '</ul>'
        + '</div>'

        + '<div class="pages">'
          + '<ul class="pages-list">'
            + getPages(pagesCount, page)
          + '</ul>'
        + '</div>'

      + '</main>'

      + footer(req.lang)

      + '<script src="/analytics.js"></script>'

    + '</body>'

  + '</html>';

};


function getFaces (embedded_photos) {
  
  var content = '';
  var likesCount, dislikesCount, judgmentsCount;

  for (var i = 0, c = embedded_photos.length; i < c; i++) {

    likesCount = embedded_photos[i].photo_doc.likesCount;
    dislikesCount = embedded_photos[i].photo_doc.dislikesCount;
    judgmentsCount = likesCount + dislikesCount;

    content += '<li class="faces-list-item">'
          + '<a href="/'
            + embedded_photos[i].user_doc.username
            + '/photo/'
            + embedded_photos[i].photo_doc._id.toHexString()
          + '">'

            + '<img src="' + embedded_photos[i].photo_doc.path + '200x200.jpg">'

            // inspired by youtube
            + '<div class="face-info">'

              + '<span class="face-counts">' + likesCount + ' - ' + dislikesCount + '</span>'

              // 800 likes           // 8000
              // 200 dislikes        // 2000
              // ++++ ++++ --        // ++++ ++++ --
              // 80% 20%             // 80% 20%

              + '<div class="face-sparkbars">'
                + '<div class="face-sparkbar-likes" style="width: ' + ((likesCount / judgmentsCount) * 100) + '%"></div>'
                + '<div class="face-sparkbar-dislikes" style="width: ' + ((dislikesCount / judgmentsCount) * 100) + '%"></div>'
              + '</div>'

            + '</div>'

          + '</a>'
        + '</li>';

  }

  return content;

}


function getPages (pagesCount, page) {
  
  var content = '';

  for (var i = 1 ; i <= pagesCount ; i++ ) {

    content += '<li>'
        + '<a href="/?page=' + i + '"' + (page === i && ' class=current' || '') + '>' + i + '</a>'
      + '</li>';

  }
  
  return content;

}


/*

  var body = ''
  + '<div id=index-page>'

    + '<noscript><div id=noscript><h3>JavaScript is disabled on your browser.</h3></div></noscript>';
    // TODO: to test and change id (class error)
    // TODO: better display and save choice in cookie (when close)
    + '<!--[if lt IE 9]>'
      + '<div id=noscript><h3>Your browser is out dated!</h3></div>'
    + '<![endif]-->'


  body += '<div>';

*/
