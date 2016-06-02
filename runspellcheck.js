var readline = require('readline');
var spellcheck = require('./spellcheck');

spellcheck.createDict().then(function(){
	var rl = readline.createInterface(process.stdin, process.stdout);
	rl.setPrompt('>');
	rl.prompt();
	rl.on('line', function (input) {
		spellcheck.spellCheck(input).then(function(result){
			console.log("Corrected word: ", result);
	 		rl.prompt();
		}, function(error) {
			console.log("Invalid input");
	 		rl.prompt();
		});
	});

	rl.on('close', function() {
	 	console.log('Good bye o/');
	 	process.exit(0);
	})
}, function(err){
	console.log("Failure in creating dictionary:", err);
});