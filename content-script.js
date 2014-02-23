$(document).ready(function() {
  console.log("document is ready");
  parseDoc();

 
});

function parseDoc() {
  var documentText = $('body') // it seems easy :)
}

$.fn.replaceText = function( search, replace, text_only ) {
  return this.each(function() {
        var node = this.firstChild,
        val, new_val, remove = [];
        for (var node = this.firstChild; node; node = node.nextSibling) {
          if ( node.nodeType === 3 ) {
              val = node.nodeValue;
              new_val = val.replace( search, replace );
              if ( new_val !== val ) {
                if ( !text_only && /</.test( new_val ) ) {
                  $(node).before( new_val );
                  remove.push( node );
                } else {
                  node.nodeValue = new_val;
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


function saveDocument() {
  //becarefull memory issues
}

function findStringFromDocument(str, caseSensitive) {
  if(caseSensitive) {
    var re = new RegExp("("+str+")","g");
  }else {
    var re = new RegExp("("+str+")","gi");
  }
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
  $('div').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('span').replaceText(re, '<mark class="search-extension" style="background-color: rgb(243, 207, 141);">$1</mark>');
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.status == "load") {
      console.log("load event content");
    }else if(request.status == "unload") {
      console.log("unload event content");
      getOldDocument();
    }else if(request.status == "storageChange") {
      getOldDocument();
      saveDocument();
      findStringFromDocument(request.text, false);
      console.log("document saved and searched");
    }
      
});