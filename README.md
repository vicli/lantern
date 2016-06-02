## Usage ##

To spellCheck:            node runspellcheck

To jumble a word:         node runjumble

To test the conversion:   node spellcheckjumble

To run spellcheck tests:  node test

##SpellCheck Algorithm:##

1. Convert all uppercase letters to lowercase.
2. Strip all repeated letters  (sheeeep => shep)
3. Traverse the nodes in dictionary for the stripped word.
	a. If it exists and has an endWord flag, return that word
	b. If it doesn't exist but has an endWord flag, return a possible word
	c. If it doesn't exist and has no endWord flag, move to step 4

4. Replace vowels in word with 1, then strip all repeated non-vowel letters (peeppple => p11ple)
5. Traverse the nodes in dictionary again to see if there is a suggestion with switched vowels.
6. If so, return word. Else, return 'No Suggestion'.


##Building the dictionary object:##

The dictionary object is built prior to running the program to ensure a quick look up time.
The object follows a trie structure where each letter is a node, and nodes are marked with endWord to indicate that 
such word does exist.

Trie is built with duplicate letters stripped, so 'bled' and 'bleed' are located in the same node.
Trie is also appended with the replacement of vowels, so 'hello' exists in dictionaryObject.h.e.l.o as well as dictionaryObject.h.1.l.o

Example of dictionary object:

```
{
	a: {
			n: {
				endWord: ['an'],
				d: {...}
			}
		}
	.
	.
	.

	1: {
		endWord: ['a', 'e', 'i', 'o', 'u']
	}
}
```

