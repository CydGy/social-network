(function () {

  var form = document.signup;
  var paragraphs = form.getElementsByTagName('p');

  var username = {

    "input": form.username,

    // paragraphs
    "url": paragraphs[0].getElementsByTagName('strong')[0],
    "checking": paragraphs[1],
    "ok": paragraphs[2],
    "invalid": paragraphs[3],
    "taken": paragraphs[4],

    "lastValue": form.username.value,
    "lastValueSended": '',
    "timeoutID": null

  };

  var email = {

    "input": form.email,

    // paragraphs
    "checking": paragraphs[5],
    "ok": paragraphs[6],
    "invalid": paragraphs[7],
    "taken": paragraphs[8],

    "lastValue": form.email.value,
    "lastValueSended": '',
    "timeoutID": null

  };

  var password = {

    "input": form.password,
    
    // paragraphs
    "ok": paragraphs[9],
    "invalid": paragraphs[10],

    "lastValue": form.password.value,
    "timeoutID": null

  };


  /**
   * Events
   */

  function checkUsername (event) {

    var value = username.input.value;

    if (value !== username.lastValue) {

      username.lastValue = value;
      username.url.innerHTML = value;
      window.clearTimeout(username.timeoutID);

      username.checking.classList.remove('active');
      username.ok.classList.remove('active');
      username.invalid.classList.remove('active');
      username.taken.classList.remove('active');

      if (value) {

        if (valid.username(value)) {

          username.timeoutID = window.setTimeout(function () {

            username.checking.classList.add('active');
            username.lastValueSended = value;

            var httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = function () {
              if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                if (username.input.value === username.lastValueSended) {

                  username.checking.classList.remove('active');

                  if (httpRequest.responseText === 'true') {
                    username.taken.classList.remove('active');
                    username.ok.classList.add('active');
                  } else {
                    username.taken.classList.add('active');
                  }

                }
              }
            };

            httpRequest.open('POST', '/available_username');
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            httpRequest.send('username=' + value);

          }, 400);

        } else {
          username.invalid.classList.add('active');
        }

      }

    }

  };


  function checkEmail (event) {

    var value = email.input.value;

    if (value !== email.lastValue) {

      email.lastValue = value;
      window.clearTimeout(email.timeoutID);

      email.checking.classList.remove('active');
      email.ok.classList.remove('active');
      email.invalid.classList.remove('active');
      email.taken.classList.remove('active');

      if (value) {

        if (valid.email(value)) {

          email.timeoutID = window.setTimeout(function () {

            email.checking.classList.add('active');
            email.lastValueSended = value;

            var httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = function () {
              if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                if (email.input.value === email.lastValueSended) {

                  email.checking.classList.remove('active');

                  if (httpRequest.responseText === 'true') {
                    email.taken.classList.remove('active');
                    email.ok.classList.add('active');
                  } else {
                    email.taken.classList.add('active');
                  }

                }
              }
            };

            httpRequest.open('POST', '/available_email');
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            httpRequest.send('email=' + value);

          }, 400);

        } else {
          email.timeoutID = window.setTimeout(function () {
            email.invalid.classList.add('active');
          }, 1000);
        }

      }

    }

  };


  function checkPassword (event) {

    var value = password.input.value;

    if (value !== password.lastValue) {

      password.lastValue = value;
      window.clearTimeout(password.timeoutID);

      if (value) {

        if (valid.password(value)) {
          password.invalid.classList.remove('active');
          password.ok.classList.add('active');
        } else {
          password.timeoutID = window.setTimeout(function () {
            password.ok.classList.remove('active');
            password.invalid.classList.add('active');
          }, 800);
        }

      } else {
        password.ok.classList.remove('active');
        password.invalid.classList.remove('active');
      }

    }

  };


  // keyup
  username.input.onkeyup = checkUsername;
  email.input.onkeyup = checkEmail;
  password.input.onkeyup = checkPassword;
  // blur
  username.input.onblur = checkUsername;
  email.input.onblur = checkEmail;
  password.input.onblur = checkPassword;


})();
