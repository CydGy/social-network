var net = require('net');
var readline = require('readline');


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completer,
  terminal: true
});

rl.setPrompt('client> ');


/**
 * server
 */

var client = net.connect(1337, function () {
  console.log('client connected');
  rl.prompt();
});

client.on('data', function (data) {
  console.log(data.toString('utf8'));
  rl.prompt();
});

client.on('end', function () {
  console.log('client disconnected');
  rl.pause();
});


/**
 * readline
 */

rl.on('line', function (cmd) {

  cmd = cmd.trim();

  if (cmd === 'help') {
    console.log(
        'help\n'
      + 'show\n'
      + 'login recaptcha on/off\n'
      + 'signup recaptcha on/off\n'
      + 'login globalLimitCount <number>\n'
      + 'signup globalLimitCount <number>\n'
    );
  } else {
    client.write(cmd);
  }

  rl.prompt();

});

rl.on('close', function () {
  console.log('Readline closed.');
  process.exit(0);
});

rl.on('SIGINT', function () {
  console.log('SIGINT');
  rl.close();
});

rl.on('SIGCONT', function () {
  rl.prompt();
});


function completer (line) {

  var completions = 'help show signup login recaptcha'.split(' ');

  var hits = completions.filter(function (c) {
    return c.indexOf(line) == 0;
  });

  return [hits.length ? hits : completions, line];

}
