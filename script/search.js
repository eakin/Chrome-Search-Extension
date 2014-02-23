$(document).ready(function() {
	 $('#input').keyup(function(){
        textAreaChangeEvent();
    });

	$('#input').change(function() {
		textAreaChangeEvent();
	});

	$('#input').keydown(function(event) {
		if(event.keyCode == 13) {
			if(localStorage.oldSearchValue == localStorage.searchValue) {
				if(currentCounter == localStorage.counter) {
					currentCounter = 1;	
					setCurrentPos(currentCounter);
					return;
				} 
				currentCounter++;
				setCurrentPos(currentCounter);
			}else {
				sendSearchRequest();
				localStorage.oldSearchValue = localStorage.searchValue;
			}
		}
	});

	$('#input').focus();

	$('#button1').click(function() {
		if(currentCounter <= 1) return;
		currentCounter--;
		setCurrentPos(currentCounter);
	});

	$('#button2').click(function() {
		if(currentCounter == localStorage.counter) return;
		currentCounter++;
		setCurrentPos(currentCounter);
	});
});

window.addEventListener("load", loadListener, false);
window.addEventListener("unload", unloadListener, false);
var currentCounter = currentCounter || 1;


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
}

function sendSearchRequest() {
	console.log("enter");
	chrome.tabs.query({active: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {status: "storageChange", text: localStorage.searchValue}, function(response) {
	  	localStorage.counter = response.counter;
	  	setCurrentPos(currentCounter);
	  });
	});
}

function setCurrentPos(pos) {
	if(pos > localStorage.counter) pos=localStorage.counter;
	var str = pos + "/" + localStorage.counter;
	$("#currentPos").text(str);
} 