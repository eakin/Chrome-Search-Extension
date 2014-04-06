$(document).ready(function() {
	// TODO change it with domcontentload event
	parseDoc();
});

var wordList = wordList || {
	"words" : [],
	"values" : [],
	"suggestions" : [ {
		"suggestionList" : {
			"words" : [],
			"distance" : []
		}
	} ]
};

var LEVEL = {
	Primary : {
		value : 0,
		name : "Small"
	},
	Secondary : {
		value : 1,
		name : "Secondary"
	},
	HardlyRelevant : {
		value : 2,
		name : "HardlyRelevant"
	}
};

var editDistanceMax = 2;
var verbose = 0;

function createDictionary(textArray) {
	var isCorrect = delete wordList["suggestions"][0];
	console.log(isCorrect);
	textArray.forEach(function(e) {
		var wordNum = 0;
		if (createEntry(e)) {
			wordNum++;
		}
	});
	console.log(wordList);
}

function createEntry(word) {
	var isNewItem = false;
	if (word == "")
		return;
	var pos = wordList["words"].indexOf(word);
	if (pos != -1) {
		wordList["values"][pos] = wordList["values"][pos] + 1;
		return true;

	} else {

		wordList["words"].push(word);
		wordList["values"].push(1);
		// wordList["suggestions"].push({
		// "suggestionList" : {
		// "words" : [],
		// "distance" : []
		// }
		// });
		pos = wordList["words"].indexOf(word);
		isNewItem = true;

		var edits = getEditItems(word, 0, true);
		// console.log(edits);
		for (var i = 0; i < edits["words"].length; i++) {
			var suggestion = {
				"word" : {},
				"distance" : {}
			};
			suggestion["word"] = word;
			suggestion["distance"] = edits["distance"][i];

			var pos = wordList["words"].indexOf(edits["words"][i]);
			if (pos != -1) {
				if (wordList["suggestions"][pos]["suggestionList"]["words"].indexOf(suggestion["word"]) == -1) {
					wordList["suggestions"][pos]["suggestionList"] = addLowestDistance(wordList["suggestions"][pos]["suggestionList"], suggestion);

				}
			} else {
				var suggestionForList = {
					"suggestionList" : {
						"words" : [],
						"distance" : []
					}
				};
				suggestionForList["suggestionList"]["words"].push(suggestion["word"]);
				suggestionForList["suggestionList"]["distance"].push(suggestion["distance"]);
				wordList["suggestions"].push(suggestionForList);
			}
		}
		return false;
	}
}

function getEditItems(word, editDistance, rec) {
	editDistance++;
	var deletes = {
		"words" : [],
		"distance" : []
	};
	if (word.length > 2) {
		for (var i = 0; i < word.length; i++) {
			var del = {
				"word" : {},
				"distance" : {}
			};
			del["word"] = word.removeFromString(i, 1);
			del["distance"] = editDistance;
			if (deletes["words"].indexOf(del["word"]) == -1) {
				deletes["words"].push(del["word"]);
				deletes["distance"].push(del["distance"]);

				if (rec && editDistance < editDistanceMax) {
					var edits = arguments.callee(del["word"], editDistance, rec);
					for (var i = 0; i < edits["words"].length; i++) {
						if (deletes["words"].indexOf(edits["words"][i]) == -1) {
							deletes["words"].push(edits["words"][i]);
							deletes["distance"].push(edits["distance"][i]);
						}
					}
				}
			}
		}
	}
	return deletes;
}

// TODO: change the implementation of first. it needs to remove this
// suggestionList item
function addLowestDistance(suggestions, suggestion) {
	if (verbose < 2 && suggestions["words"].length > 0 && suggestions["distance"][0] > suggestion["distance"]) {
		delete suggestions["words"];
		var isCorrect = delete suggestions["distance"];
		console.log(isCorrect);
		// suggestions["words"].length = 0;
		// suggestions["distance"].length = 0;
	}
	if (suggestions["words"] != undefined && suggestions["words"] != null && (verbose == 2 || suggestions["words"].length == 0 || suggestions["distance"][0] >= suggestion["distance"])) {
		suggestions["words"].push(suggestion["word"]);
		suggestions["distance"].push(suggestion["distance"]);
	}
	return suggestions;
}

$.fn.replaceText = function(search, replace, text_only) {
	return this.each(function() {
		var val, new_val, remove = [];
		for (var node = this.firstChild; node; node = node.nextSibling) {
			if (node.nodeType === 3) {
				val = node.nodeValue;
				new_val = val.replace(search, replace);
				if (new_val !== val) {
					if (!text_only && /</.test(new_val)) {
						$(node).before(new_val);
						remove.push(node);
						localStorage.counter++;
					} else {
						node.nodeValue = new_val;
						localStorage.counter++;
					}
				}
			}
		}
		remove.length && $(remove).remove();
	});
};

function getOldDocument() {
	$(".search-extension").each(function() {
		$(this).replaceWith($(this).text());
	});
}

// TODO: level effects color codes
function findStringFromDocument(str, caseSensitive, level) {
	if (level.value == LEVEL.Primary.value) {
		var re;
		if (caseSensitive) {
			re = new RegExp("(" + str + ")", "g");
		} else {
			re = new RegExp("(" + str + ")", "gi");
		}
		localStorage.counter = 0;
		$('p').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('a').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('h1').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('h2').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('h3').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('h4').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('b').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('u').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('i').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('li').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('BLOCKQUOTE').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('pre').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('code').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('marquee').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
		$('span').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.status == "load") {
	} else if (request.status == "unload") {
		console.log("unload event content");
		getOldDocument();
	} else if (request.status == "storageChange") {
		getOldDocument();
		// correct(request.text);
		findStringFromDocument(request.text, false, LEVEL.Primary);
		sendResponse({
			counter : localStorage.counter
		});
	}
});

function correct(inp) {
	var suggestions = lookup(inp, editDistanceMax);
	if (suggestions["word"] != undefined) {
		console.log(suggestions["word"] + " " + suggestions["distance"] + " " + suggestions["value"]);
	} else {
		for (var i = 0; i < suggestions["words"].length; i++) {
			console.log(suggestions["words"][i] + " " + suggestions["distance"][i] + " " + suggestions["value"][i]);
		}
	}
	if (verbose == 2) {
		console.log(suggestions.length);
	}
}

function lookup(inp, editDistanceMax) {
	var candidates = {
		"words" : [],
		"distance" : []
	};
	var item = {
		"word" : inp,
		"distance" : 0
	};
	candidates["words"].push(inp);
	candidates["distance"].push(0);
	var suggestions = {
		"words" : [],
		"distance" : [],
		"count" : []
	};
	var dicItem = {};
	while (candidates["words"].length > 0) {
		var candidate = {
			"word" : "",
			"distance" : ""
		};
		candidate["word"] = candidates["words"][0];
		candidate["distance"] = candidates["distance"][0];

		var isCorrect = delete candidates["words"][0];
		delete candidates["distance"][0];
		console.log(isCorrect);

		if ((verbose < 2) && suggestions.length > 0 && candidate["distance"] > suggestions[0]["distance"]) {
			// sort
			console.log(suggestions);
			suggestions[0]["distance"].sort();
			console.log(suggestions);
			suggestions[0]["count"].sort().reverse();
			console.log(suggestions);
		}
		if (candidate["distance"] > editDistanceMax) {
			console.log(suggestions);
			suggestions[0]["distance"].sort();
			console.log(suggestions);
			suggestions[0]["count"].sort().reverse();
			console.log(suggestions);
		}
		var index = wordList["words"].indexOf(candidate["word"]);
		if (index != -1) {
			if (!isNullOrEmpty(wordList["words"][index])) {
				var sItem = {
					"word" : "",
					"count" : "",
					"distance" : ""
				};
				sItem["word"] = wordList["words"][index];
				sItem["count"] = wordList["values"][index];
				sItem["distance"] = candidate["distance"];
				if (!suggestions["words"].indexOf(sItem["word"]) == -1) {
					suggestions["words"].push(sItem["word"]);
					suggestions["count"].push(sItem["count"]);
					suggestions["distance"].push(sItem["distance"]);
					if (verbose < 2 && candidate["distance"] == 0) {
						console.log(suggestions);
						suggestions[0]["distance"].sort();
						console.log(suggestions);
						suggestions[0]["count"].sort().reverse();
						console.log(suggestions);
					}
				}
			}
			var item2;
			var list = wordList["suggestions"][index]["suggestionList"];
			for (var i = 0; i < list["words"].length; i++) {
				var distance = trueDistance(list, i, candidate, inp);
				if ((verbose < 2) && (list["words"].length > 0) && (list["distance"][0].length > distance)) {
					var isCorrect = delete list;
					console.log("it should be true" + isCorrect);
				}
				if ((verbose < 2) && (list["words"].length > 0) && (distance > list["distance"][0].length)) {
					continue;
				}

				if (distance <= editDistanceMax) {
					var index2 = wordList["words"].indexOf(list["words"][i]);
					if (index2 != -1) {
						suggestions["words"].push(wordList["words"][index2]);
						suggestions["count"].push(wordList["values"][index2]);
						suggestions["distance"].push(distance);
					}
				}
			}
		}

		if (candidate["distance"] < editDistanceMax) {
			var editItems = getEditItems(candidate["word"], candidate["distance"], false);
			for (var i = 0; i < editItems["words"].length; i++) {
				if (!candidates["words"].indexOf(editItems["words"][i])) {
					candidates["words"].push(editItems["words"][i]);
					candidates["distance"].push(editItems["distance"][i]);
				}
			}
		}
	}

	if ((verbose == 0) && (suggestions["words"].length > 1)) {
		var suggestion = {
			"word" : "",
			"count" : "",
			"distance" : ""
		};
		suggestion["word"] = suggestions["words"][0];
		suggestion["count"] = suggestions["count"][0];
		suggestion["distance"] = suggestions["distance"][0];
		return suggestion;
	} else {
		return suggestions;
	}
}

function trueDistance(list, index, candidate, input) {
	if (list["words"][index] == input)
		return 0;
	else if (list["distance"][index] == 0)
		return candidate["distance"];
	else if (list["distance"][index] == 0)
		return list["distance"][index];
	else
		return getDamerauLevenshteinDistance(list["words"][index], input);
}

function getDamerauLevenshteinDistance(source, target) {
	var m = source.length;
	var n = target.length;
	var H = [ [] ];
	var array = [];
	for (var i = 0; i < n + 2; i++) {
		array.push(0);
	}
	for (var i = 0; i < m + 2; i++) {
		H.push(array);
	}
	var INF = m + n;
	H[0][0] = INF;
	for (var i = 0; i <= m; i++) {
		H[i + 1, 1] = i;
		H[i + 1, 0] = INF;
	}
	for (var j = 0; j <= n; j++) {
		H[1, j + 1] = j;
		H[0, j + 1] = INF;
	}
	var sd = {
		"chars" : [],
		"value" : []
	};
	var charList = source + target;
	for (var i = 0; i < m + n; i++) {
		var letter = charList.charAt(i);
		if (sd["chars"].indexOf(letter) == -1) {
			sd["chars"].push(letter);
			sd["value"].push(0);
		}
	}
	for (var i = 1; i <= m; i++) {
		var DB = 0;
		for (var j = 1; j <= n; j++) {
			var tmp = sd["chars"].indexOf(target.charAt(j - 1));
			var i1 = sd["value"][tmp];
			var j1 = DB;
			if (source.charAt(i - 1) == target.charAt(j - 1)) {
				H[i + 1][j + 1] = H[i][j];
				DB = j;
			} else {
				H[i + 1][j + 1] = Math.min(H[i][j], Math.min(H[i + 1][j], H[i][j + 1])) + 1;
			}

			H[i + 1][j + 1] = Math.min(H[i + 1][j + 1], H[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1));
		}
		var tmp2 = sd["chars"].indexOf(source.charAt(i - 1));
		sd["value"][tmp2] = i;
	}
	return H[m + 1][n + 1];
}

function isNullOrEmpty(str) {
	if (str == null || str == "") {
		return true;
	}
	return false;
}

// removes j character after i. character
String.prototype.removeFromString = function(i, j) {
	return this.replace(this.substr(i, j), "");
};
