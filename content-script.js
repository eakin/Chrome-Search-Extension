
var wordList = wordList || {};

$(document).ready(function() {
  //TODO change it with domcontentload event
  parseDoc();
});


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
}

function createEntry(word) {
  // var isNewItem = false;

  // TODO write search func for wordlist
  // if(wordList.indexOf(word) != -1) {
  //   // increase word repeat sequance
  // }else {
  //   wordList.push(word);
  //   isNewItem = true;
  // }
  // var edits = getEditItems(word, 0, true);
  // edits.forEach(function(e) {
  //   eItem = new editItem(); // TODO add editItem constructor.
  //   eItem.term = word;
  //   eItem.distance = e.distance;

  //   //line 137 
  // });
  // return isNewItem;
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