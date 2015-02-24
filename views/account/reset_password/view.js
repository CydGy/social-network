module.exports = function (urlparsed) {

  return '<form action="/account/reset_password" method=post>'

      + '<input type=hidden name="user_id" value="'
        + urlparsed.query.user_id + '">'

      + '<input type=hidden name="token" value="'
        + urlparsed.query.token + '">'

      + 'type your new password'
      + '<br>'
      + '<input type=password name=password maxlength=50 required>'
      + '<br>'
      + '<br>'

      + 'type your new password one time more'
      + '<br>'
      + '<input type=password name=password2 maxlength=50 required>'
      + '<br>'
      + '<br>'

      + '<button type=submit>Set this password</button>'

    + '</form>'

    + '<script src="/analytics.js"></script>';

};

