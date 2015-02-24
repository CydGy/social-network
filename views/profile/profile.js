var rightColumn = require('./right-column.js');
var topBarOffline = require('../top-bar/offline/top-bar.js');
var topBarOnline = require('../top-bar/online/top-bar.js');


module.exports = function (req, data) {

  var profilePhotoPath;

  for (var i = 0, c = data.profile.photos_docs.length ; i < c ; i++) {
    if (data.profile.photos_docs[i].isProfilePhoto) {
      profilePhotoPath = data.profile.photos_docs[i].path;
      break;
    }
  }

  return '<!DOCTYPE html>'
    + '<html lang=' + req.lang + '>'

      + '<head>'
        + '<title>' + data.profile.user_doc.username + '</title>'
        + '<link rel="stylesheet" href="/reset.css">'
        + '<link rel="stylesheet" href="/defaults.css">'
        + '<link rel="stylesheet" href="/buttons.css">'
        + '<link rel="stylesheet" href="/top-bar/top-bar-online.css">'
        + '<link rel="stylesheet" href="/top-bar/top-bar-offline.css">'
        + '<link rel="stylesheet" href="/profile/profile.css">'
        + '<link rel="stylesheet" href="/profile/photos-grid-page.css">'
      + '</head>'

      + '<body>'

        + (req.user_doc && topBarOnline(req) || topBarOffline(req.lang))

        + '<main>'

          // content-wrapper
          + '<div class="content-wrapper">'

            + '<ol>'
              + getAllPhotos(data.profile.user_doc, data.profile.photos_docs)
              + (data.connected.isProfileUser && addPhoto() || '')
            + '</ol>'

          + '</div>'

          + rightColumn(data.profile.user_doc, data.connected.isProfileUser)

        + '</main>'

        + '<script src="/analytics.js"></script>'

      + '</body>'

    + '</html>';

};


function getAllPhotos (user_doc, photos_docs) {

  var content = '';
  var likesCount, dislikesCount, judgmentsCount;

  for (var i = 0, c = photos_docs.length; i < c; i++) {
    
    likesCount = photos_docs[i].likesCount;
    dislikesCount = photos_docs[i].dislikesCount;
    judgmentsCount = likesCount + dislikesCount;

    content += '<li>'

        + '<a href="/' + user_doc.username + '/photo/' + photos_docs[i]._id.toHexString() + '">'
          + '<img src="' + photos_docs[i].path + '200x200.jpg">'
        + '</a>'

        + '<div class="photo-info">'

          + '<div class="photo-sparkbars">'
            + '<div class="photo-sparkbar-likes" style="width: ' + ((likesCount / judgmentsCount) * 100) + '%"></div>'
            + '<div class="photo-sparkbar-dislikes" style="width: ' + ((dislikesCount / judgmentsCount) * 100) + '%"></div>'
          + '</div>'

          + '<span class="photo-counts">' + likesCount + ' - ' + dislikesCount + '</span>'

        + '</div>'

      + '</li>';

  }

  return content;

}


function addPhoto () {

  return '<form method=post'
       + ' enctype="multipart/form-data"'
       + ' action="/profile/addPhoto">'

    + '<input type=file name=photo accept="image/jpg, image/jpeg, image/png" required>'
    + '<button>add photo</button>'


  + '</form>';

}
