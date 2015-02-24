module.exports = function () {

  return '<form action="/account/send_password_reset" method=post>'

      + '<input type=email name=email maxlength=300 required>'
      + '<button type=submit>Send me an email</button>'

    + '</form>'

    + '<script src="/analytics.js"></script>';

};
