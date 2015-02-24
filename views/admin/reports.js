module.exports = function (results) {

  var content = '';

  for (var i = 0, c = results.length; i < c; i++) {

    content += ''
    + '<div>'
      + '<a href="/' + results[i].user_doc.username + '">' + results[i].user_doc.username + '</a>'
      + '<img src="' + results[i].photo_doc.path + '200x200.jpg">'
      + '<p>' + results[i].report_doc.reason + '</p>'
      + '<form action="/admin/report" method=post>'
        + '<input type=hidden name=reportId value="' + results[i].report_doc._id.toHexString() + '">'

        // radio
        + '<label>'
          + '<input type=radio name=what value=accept>'
          + 'accept'
        + '</label>'

        // radio
        + '<label>'
          + '<input type=radio name=what value=refuse>'
          + 'refuse'
        + '</label>'

        + '<button>ok</button>'
      + '</form>'
    + '</div>';

  }

  return content + '<script src="/analytics.js"></script>';

};
