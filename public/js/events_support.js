// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation

// Many legacy browsers do not support the addEventListener method.
// Here is a simple way to handle this; it's fare from the only one.

function addEvent (element, event, callback) {

  var previousEventCallback = element['on' + event];

  element['on' + event] = function (e) {

    var output = callback(e);

    // A callback that return `false` stop the callback chain
    // and interupt the execution of the event callback.
    if (output === false) return false;

    if (typeof previousEventCallback === 'function') {

      output = previousEventCallback(e);
      if (output === false) return false;

    }

  };

}
