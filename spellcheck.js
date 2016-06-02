var readline = require('readline');
var RSVP = require('rsvp');
var fs = require('fs');
var stream = require('stream');
var dictionaryObject = {}
var vowelRegex = /^[aeiou]$/;

var isVowel = function(letter) {
		return (vowelRegex).test(letter);
}
var iterable = function(wordArray){
    var index = 0;
    return {
       next: function(){
           return index < wordArray.length ? { val: wordArray[index++], endLetter: false} : {endLetter: true};
       }
    }
}

var addWordToDict = function(word, noVowel) {
	var currentBranch = dictionaryObject;
	var strippedWord = word.replace(/[^\w\s]|(.)(?=\1)/g, "")
	var wordArray = strippedWord.split('');

	wordArray.forEach(function(letter, index, wordArray){
		// This step allows us to augment vowels with numbers
		// to allow for correction of incorrect vowels
		letter = isVowel(letter)  && noVowel ? 1 : letter;
		
		if(!(letter in currentBranch)) {
			currentBranch[letter] = {};
		} 
		currentBranch = currentBranch[letter]
		// if end of word, we want to indicate and store that into our dictionray
		if (index === wordArray.length - 1){
			if(currentBranch.endWord) {
				var curArray = currentBranch['endWord'];
				curArray.push(word);
			} else {
				currentBranch['endWord'] = [word];
			}
		}
	})
}


var createDict = function() {
    return new RSVP.Promise(function (resolve, reject) {
    	var dictionaryFile = "/usr/share/dict/words";
		var input = fs.createReadStream(dictionaryFile);
		var output = new stream();
		var rl = readline.createInterface(input, output);

		rl.on('line', function (dictWord) {
			var currentBranch = dictionaryObject;
			// removes 'A, B, C..' markers from the dictionary
			if(!(dictWord.length == 1) && !(dictWord === dictWord.toUpperCase())) {
				// We add the word to dictionary twice, once with vowels and
				// one without. While this increases the size of the dictionary,
				// it allows us to use the same dictionaryObject to check for
				// vowel corrections.
				addWordToDict(dictWord, false);
				addWordToDict(dictWord, true);
			}
	    });
	    
	    rl.on('close', function (dictWord) {
	    	resolve();
	    });
    });
}

var spellCheck = function(word) {
	return new RSVP.Promise(function(resolve, reject) {
		var wordWithVowel, wordWithoutVowel;
		var result = "";
		var checkLetter = function(letter, branch){
			var nextLetter = wordWithVowel.next().val;
			if (letter in branch) {
				newBranch = branch[letter];

				// We have reached the end of the word and the word exists
				// If our result is in the suggested word array, we can return that
				// otherwise we pick first result from the array
				if(!nextLetter && newBranch.endWord) {
					if (newBranch.endWord.indexOf(word) > -1) {
						result = word;
					} else {
						result = newBranch.endWord[0];
					}
				} else {
					checkLetter(nextLetter, newBranch);
				}

			} else {
				wordWithoutVowel = word.toLowerCase().replace(/([aeiou])/g, '1')
				wordWithoutVowel = wordWithoutVowel.replace(/[^\w\s]|(\D)(?=\1)/g, "");
				wordWithoutVowel = iterable(wordWithoutVowel.split(''));
				checkNoVowelLetter(wordWithoutVowel.next().val, dictionaryObject);
			}
		}
		var checkNoVowelLetter = function(letter, branch){
			var nextLetter = wordWithoutVowel.next().val;

			if (letter in branch) {
				branch = branch[letter];

				// We have reached the end of the word and the word exists
				// If our result is in the suggested word array, we can return that
				// otherwise we pick first result from the array
				if(!nextLetter && branch.endWord) {
					if (branch.endWord.indexOf(word) > -1) {
						result = word;
					} else {
						result = branch.endWord[0];
					}
				} else {
					checkNoVowelLetter(nextLetter, branch);
				}

			} else {
				result = "NO SUGGESTION";
			}
		}
		
		if((/^[a-zA-Z]+$/.test(word)) && word.length > 0) {
			if (word.length == 1) {
				result = word;
			}
			wordWithVowel = word.toLowerCase().replace(/[^\w\s]|(.)(?=\1)/g, "");
			wordWithVowel = iterable(wordWithVowel.split(''));

			checkLetter(wordWithVowel.next().val, dictionaryObject);

			resolve(result);
		} else {
			reject();
		}
	})
	
}

// Jumbles correct words
var jumble = function(word) {
	var result = "";
	word = word.split('');

	function randomCapitalize(letter){
		var shouldRandomize = Math.random() < 0.5 ? true : false;
		if (shouldRandomize) {
			letter = letter.toUpperCase();		
		}
		return letter;
	}
	function randomDuplicate(letter){
		var shouldRandomize = Math.random() < 0.2 ? true : false;
		var numberDups = Math.floor(Math.random() * 3) + 1;
		if (shouldRandomize) {
			letter = Array(numberDups+1).join(letter);
		}
		return letter;
	}
	function randomReplaceVowel(letter) {
		var vowelArray = ['a','e', 'i', 'o', 'u'];
		var shouldRandomize = Math.random() < 0.3 ? true : false;
		if(shouldRandomize ) {
			letter = vowelArray[Math.floor(Math.random() * vowelArray.length)];
		}
		return letter
	}
	word.forEach(function(letter){
		letter = randomCapitalize(letter);
		letter = randomDuplicate(letter);
		if (isVowel(letter)){
			letter = randomReplaceVowel(letter);
		}
		result += letter;
	})
	return result;
}

module.exports = {
  spellCheck: spellCheck,
  createDict: createDict,
  jumble: jumble
}
