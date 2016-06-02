var readline = require('readline');
var spellcheck = require('./spellcheck');

var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('>');
rl.prompt();
rl.on('line', function (input) {
	console.log(spellcheck.jumble(input));
 	rl.prompt();
});

rl.on('close', function() {
 	console.log('Exiting jumble');
 	process.exit(0);
})