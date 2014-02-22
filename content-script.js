$(document).ready(function() {
	console.log("document is ready");
  $('p').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('a').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('h1').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('h2').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('h3').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('h4').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('b').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('u').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('i').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('li').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('BLOCKQUOTE').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('pre').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('code').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('article').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('marquee').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('div').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>');
  $('span').replaceText(/(a)/gi, '<span style="background-color: rgb(243, 207, 141);">$1</span>'); // TODO fix span bug
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