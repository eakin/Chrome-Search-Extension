$(document).ready(function() {
  console.log("document is ready");
  $('p').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('a').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('h1').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('h2').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('h3').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('h4').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('b').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('u').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('i').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('li').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('BLOCKQUOTE').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('pre').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('code').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('article').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('marquee').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('div').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  $('span').replaceText(/(a)/gi, '<mark style="background-color: rgb(243, 207, 141);">$1</mark>');
  parseDoc();
});

function parseDoc() {
  var documentText = $('body').text(); // it seems easy :)
  //console.log(documentText);
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

/*
chrome.runtime.sendMessage ({})

*/