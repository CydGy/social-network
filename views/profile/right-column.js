// to show nb views
module.exports = function (user_doc, isProfileUser) {

  var content = '<div id="right-column">'
      + '<a href="/' + user_doc.username + '">'
        + '<img src="' + user_doc.photoPath + '200x200.jpg">'
      + '</a>'
      + '<a href="/' + user_doc.username + '" class="username">' + user_doc.username + '</a>';

  if (isProfileUser) {
    content += '<a href="/signout">Sign out</a>';
  }

  content += '</div>';

  return content;

};
