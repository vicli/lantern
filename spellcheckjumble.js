var spellcheck = require('./spellcheck');
var testWords = ['hello', 'sheep', 'testing', 'water'];

spellcheck.createDict().then(function(){
	testWords.forEach(function(word){
		var jumbled = spellcheck.jumble(word);
		spellcheck.spellCheck(jumbled).then(function(result){
			console.log("Testing '" + word + "' jumbled as '" + jumbled + "':");
			console.log("Test passed: ", result !== "NO SUGGESTION")
			console.log("Resulting word:", result);
		}, function(){
			console.log("error")
		});
	})
})
