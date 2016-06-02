var spellcheck = require('./spellcheck');

console.log("**** Testing spellcheck **** ")
function testSpellCheck(word, expected) {
	spellcheck.spellCheck(word).then(function(result){
		console.log("Testing: ", word);
		console.log("Expected: ", expected);
		console.log("Test passed:", result === expected);
		console.log("==============")
	})

}
spellcheck.createDict().then(function(){
	testSpellCheck("inSIDE", "inside");
	testSpellCheck("sheeeep", "sheep");
	testSpellCheck("peepple", "people");
	testSpellCheck("jjoobbb", "job");
	testSpellCheck("CUNsperrICY", "conspiracy");
	testSpellCheck("weke", "waka");
	testSpellCheck("sheeple", "NO SUGGESTION");
})
