$(document).ready(function() {
	console.log("doc ready");
	 $('#input').keyup(function(){
        textAreaChangeEvent();
    });

	$('#input').change(function() {
		textAreaChangeEvent();
	});

	$('#input').keydown(function(event) {
		if(event.keyCode == 13) {
			sendSearchRequest();			
		}
	});
});

window.addEventListener("load", loadListener, false);
window.addEventListener("unload", unloadListener, false);


function loadListener() {
	console.log("load");
	chrome.tabs.query({active: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {status: "load"}, function(response) {
	    
	  });
	});
}


function unloadListener() {
	console.log("unload");
	chrome.tabs.query({active: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {status: "unload"}, function(response) {
	    
	  });
	});
}


function textAreaChangeEvent() {
	console.log("input change");
		localStorage.searchValue = $('#input').val();
		console.log(localStorage.searchValue);
}

function sendSearchRequest() {
	console.log("enter");
	chrome.tabs.query({active: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {status: "storageChange", text: localStorage.searchValue}, function(response) {
	    
	  });
	});
}