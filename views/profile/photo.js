var rightColumn = require('./right-column.js');
var sanitizer = require('sanitizer');
var topBarOffline = require('../top-bar/offline/top-bar.js');
var topBarOnline = require('../top-bar/online/top-bar.js');


module.exports = function (req, data) {

  var likesCount = data.profile_user.photo_doc.likesCount;
  var dislikesCount = data.profile_user.photo_doc.dislikesCount;
  var judgmentsCount = likesCount + dislikesCount;

  return '<!DOCTYPE html>'
    + '<html lang=' + req.lang + '>'

      + '<head>'
        + '<title>' + data.profile_user.user_doc.username + '</title>'
        + '<link rel="stylesheet" href="/reset.css">'
        + '<link rel="stylesheet" href="/defaults.css">'
        + '<link rel="stylesheet" href="/buttons.css">'
        + '<link rel="stylesheet" href="/top-bar/top-bar-offline.css">'
        + '<link rel="stylesheet" href="/top-bar/top-bar-online.css">'
        + '<link rel="stylesheet" href="/profile/profile.css">'
        + '<link rel="stylesheet" href="/profile/photo-page.css">'
      + '</head>'

      + '<body>'

        + (data.connected_user.user_doc && topBarOnline(req) ||
        topBarOffline(req.lang))

        + '<main>'

          // content-wrapper
          + '<div class="content-wrapper photo-page">'
            + '<div class="left-column">'

              + '<form action="/' + data.profile_user.user_doc.username + '/photo/' + data.photoId + '/comment" method=post accept-charset="utf-8">'
                + '<textarea name="text" maxlength="1000" required></textarea>'
                + '<button type="submit" class="button1 grey">Add comment</button>'
              + '</form>'

              + '<ol class="comments">'
                + comments(data.embedded_docs.comments)
              + '</ol>'

            + '</div>'


            // right column
            + '<div class="right-column">'

              + '<img src="' + data.profile_user.photo_doc.path + '400x400.jpg">'

              + '<div class="photo-info">'

                + '<div class="judge">'
                  + '<button id="js-like-btn"class="button1 grey icon thumb-up js-like-btn' + (data.connected_user.judged === 'liked' && ' active' || '') + '" photoId="' + data.photoId + '">like</button>'

                  + '<span class="photo-counts">'
                    + '<span id="js-likes-count" class="likes-count">' + likesCount + '</span>'
                    + ' - '
                    + '<span id="js-dislikes-count" class="dislikes-count">' + dislikesCount + '</span>'
                  + '</span>'

                  + '<button id="js-dislike-btn" class="button1 grey icon thumb-down js-dislike-btn' + (data.connected_user.judged === 'disliked' && ' active' || '') + '" photoId="' + data.photoId + '">dislike</button>'
                + '</div>'

                + '<div class="photo-sparkbars">'
                  + '<div id="photo-sparkbar-likes" class="photo-sparkbar-likes" style="width: ' + ((likesCount / judgmentsCount) * 100) + '%"></div>'
                  + '<div id="photo-sparkbar-dislikes" class="photo-sparkbar-dislikes" style="width: ' + ((dislikesCount / judgmentsCount) * 100) + '%"></div>'
                + '</div>'

              + '</div>'

              + photoSettings(data)

              + likes(data.embedded_docs.judgments)
              + dislikes(data.embedded_docs.judgments)

              + (data.connected_user.user_doc && '<a href="/report/photo/' + data.photoId + '">report</a>' || '')

            + '</div>'


          + '</div>'

          // TODO html5 aside?
          + rightColumn(data.profile_user.user_doc)

        + '</main>'


        // TODO to remove `type` everywhere!
        + (data.connected_user.user_doc && '<script src="/profile/photo.js"></script>' || '<script src="/profile/photo-offline.js"></script>')

        + '<script src="/analytics.js"></script>'

      + '</body>'

    + '</html>';

};


function photoSettings (data) {
  if (!data.connected_user.user_doc
   || !data.connected_user.isProfile)
    return '';

  return '<div>'

      + '<form action="/photo/setProfilePhoto" method=post>'
        + '<input type=hidden name=photoId value="' + data.photoId+ '">'
        + '<button type=submit>Set to profile photo</button>'
      + '</form>'
      + '<form action="/photo/delete" method=post>'
        + '<input type=hidden name=photoId value="' + data.photoId + '">'
        + '<button type=submit>Delete this photo</button>'
      + '</form>'

    + '</div>';
}

function likes (embedded_judgments) {

  var list = '';
  var content = '';

  for (var i = 0, c = embedded_judgments.length; i < c; i++) {

    if (embedded_judgments[i].judgment_doc.liked_photo_id)
      content += '<li>'
        
        + '<a href="/' + embedded_judgments[i].user_doc.username + '">'
          + '<img src="' + embedded_judgments[i].user_doc.photoPath + '200x200.jpg">'
        + '</a>'

      + '</li>';

  }

  if (content) {
    list = '<ol class="judgments likes">'
        + '<h1>Likes</h1>'
        + content
      + '</ol>';
  }

  return list;

}

function dislikes (embedded_judgments) {

  var list = '';
  var content = '';

  for (var i = 0, c = embedded_judgments.length; i < c; i++) {

    if (embedded_judgments[i].judgment_doc.disliked_photo_id)
      content += '<li>'
        
        + '<a href="/' + embedded_judgments[i].user_doc.username + '">'
          + '<img src="' + embedded_judgments[i].user_doc.photoPath + '200x200.jpg">'
        + '</a>'

      + '</li>';

  }

  if (content) {
    list = '<ol class="judgments dislikes">'
        + '<h1>Dislikes</h1>'
        + content
      + '</ol>';
  }

  return list;

}

function comments (embedded_comments) {

  var content = '';
  var username;

  for (var i = 0, c = embedded_comments.length; i < c; i++) {

    username = embedded_comments[i].user_doc.username;

    content += '<li>'

        + '<a class="photo" href="/' + username + '">'
          + '<img src="' + embedded_comments[i].user_doc.photoPath + '200x200.jpg">'
        + '</a>'

        + '<header><a class="username" href="/' + username + '">' + username + '</a></header>'
        + '<p class="text">' + sanitizer.escapeHtml(embedded_comments[i].comment_doc.text) + '</p>'

      + '</li>';

  }

  return content;

}
