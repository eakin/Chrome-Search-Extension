$(document).ready(function() {
  //TODO change it with domcontentload event
  parseDoc();
});

var wordList = wordList || {"words": [], "values": [], "suggestions": [{"suggestionList" : {"words":[], "distance": []}}]};
var editDistanceMax = 2;
var verbose = 2;




/*
 THIS FUNCTION CREATES NEW DICTIONARY BASED ON DOCUMENT TEXT
*/
function parseDoc() {
  var documentText = $('body').text();
  createDictionary(documentText.split(/\s+/g));
}


/*
  DICTIONARY ITEMS
*/
function dictionaryItem() {
  var term = "";
  var editItemArrayForSuggestions = {};
  var count = 0;
}

dictionaryItem.prototype.getHashCode = function() {
  return hashCode(this.term);
};

dictionaryItem.prototype.equals = function(anotherDictionaryItem) {
  return this.term == anotherDictionaryItem.term;
};

/*
  EDIT ITEMS
*/
function editItem() {
  var term = "";
  var distance = 0;
}

editItem.prototype.getHashCode = function() {
  return hashCode(this.term);
};

editItem.prototype.equals = function(anotherEditItem) {
  return this.term == anotherEditItem.term;
};

/*
  SUGGESTION ITEMS
*/
function suggestItem() {
  var term = "";
  var distance = 0;
}

suggestItem.prototype.getHashCode = function() {
  return hashCode(this.term);
};

suggestItem.prototype.equals = function(anotherSuggestItem) {
  return this.term == anotherSuggestItem.term;
};

/*
  HASHCODE FUNCTION
*/
function hashCode (str){
    var hash = 0, i, char;
    if (str.length == 0) return hash;
    for (i = 0, l = str.length; i < l; i++) {
        char  = str.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function createDictionary(textArray) {
  textArray.forEach(function(e) {
    var wordNum = 0;
    if(createEntry(e)) {
      wordNum++;
    }
  });
  console.log(wordList);
}


function createEntry(word) {
   var isNewItem = false;
   if(word == "") return;
    var pos = wordList["words"].indexOf(word);
   if(pos != -1) {
     wordList["values"][pos] = wordList["values"][pos] + 1;
     return true;

    }else {

     wordList["words"].push(word);
     wordList["values"].push(1);
     wordList["suggestions"].push({"suggestionList" : {"words":[], "distance": []}});
     pos = wordList["words"].indexOf(word);
     isNewItem = true;
     
     var edits = getEditItems(word, 0, true);
     for(var i = 0; i < edits["words"].length; i++) {
      var suggestion = {"word": {}, "distance": {}};
      suggestion["word"] = word;
      suggestion["distance"] = edits["distance"][i];

      var pos = wordList["words"].indexOf(edits["words"][i]);
      if(pos != -1) {
         if(wordList["suggestions"][pos]["suggestionList"]["words"].indexOf(suggestion["word"]) == -1) {
          wordList["suggestions"][pos]["suggestionList"] = addLowestDistance(wordList["suggestions"][pos]["suggestionList"], suggestion);

         }
       } else {
        var suggestionForList = {"suggestionList" : {"words":[], "distance": []}};
        suggestionForList["suggestionList"]["words"].push(suggestion["word"]);
        suggestionForList["suggestionList"]["distance"].push(suggestion["distance"]);
        wordList["suggestions"].push(suggestionForList);
       }     
     }
   }
  return false;
}

function getEditItems(word, editDistance, rec) {
  editDistance++;
  var deletes = {"words" : [], "distance": []};
  if(word.length > 2) {
    for (var i = 0; i < word.length; i++) {
      var del = {"word": {}, "distance": {}};
      del["word"] = word.removeFromString(i, 1);
      del["distance"] = editDistance;
      if(deletes["words"].indexOf(del["word"]) == -1 ) {
        deletes["words"].push(del["word"]);
        deletes["distance"].push(del["distance"]);

        if(rec && editDistance < editDistanceMax) {
          var edits = arguments.callee( del["word"], editDistance, rec);
          for (var i = 0; i < edits["words"].length; i++) {
            if(deletes["words"].indexOf(edits["words"][i]) == -1) {
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

// TODO: change the implementation of first. It needs to remove this suggestionList item
function addLowestDistance(suggestions, suggestion) {
  if(verbose < 2 && suggestions["words"].length > 0 && suggestions["distance"][0] > suggestion["distance"]) {
    suggestions["words"].length = 0;
    suggestions["distance"].length = 0;
  }
  if(verbose == 2 || suggestions["words"].length || suggestions["distance"][0] >= suggestion["distance"]) {
    suggestions["words"].push(suggestion["word"]);
    suggestions["distance"].push(suggestion["distance"]);
  }
  return suggestions;
}

$.fn.replaceText = function( search, replace, text_only ) {
  return this.each(function() {
        var val, new_val, remove = [];
        for (var node = this.firstChild; node; node = node.nextSibling) {
          if ( node.nodeType === 3 ) {
              val = node.nodeValue;
              new_val = val.replace( search, replace );
              if ( new_val !== val ) {
                if ( !text_only && /</.test( new_val ) ) {
                  $(node).before( new_val );
                  remove.push( node );
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

function findStringFromDocument(str, caseSensitive) {
  if(caseSensitive) {
    var re = new RegExp("("+str+")","g");
  }else {
    var re = new RegExp("("+str+")","gi");
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
  $('article').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('marquee').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
  //$('div').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('span').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.status == "load") {
    }else if(request.status == "unload") {
      console.log("unload event content");
      getOldDocument();
    }else if(request.status == "storageChange") {
      getOldDocument();
      findStringFromDocument(request.text, false);
      sendResponse({counter: localStorage.counter});
    }
});




function isNullOrEmpty(str) {
  if(str == null || str == "") {
    return true;
  }
  return false;
}

// removes j character after i. character
String.prototype.removeFromString = function(i, j) {
  return this.replace(this.substr(i, j), "");
};
