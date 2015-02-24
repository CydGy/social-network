//(function () {

  var modalWindow = document.getElementById('modal-window');
  var background = document.getElementById('modal-window-background');
  var dialog = document.getElementById('signin-or-signup-dialog');

  var triggers = document.querySelectorAll('.js-action-signin-or-signup-dialog');

  background.onclick = function (event) {
    modalWindow.style.display = 'none';
  };

  for (var i = 0, c = triggers.length ; i < c ; i++) {

    triggers[0].onclick = func1;

  }

  function func1 () {

    modalWindow.style.display = 'block';
    return false;

  }

//})();
