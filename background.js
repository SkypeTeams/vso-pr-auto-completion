var intervalID;

chrome.extension.onMessage.addListener( function(request,sender,sendResponse){
  if(request.action === 'startTimer') {
    startTimer(request.tab);
  } else if (request.action === 'stopTimer') {
    stopTimer();
  } else if (request.action === 'getStatus') {
    sendResponse(intervalID != null);
  }

});

function stopTimer() {
  window.clearInterval(intervalID);
  intervalID = null;
}

function startTimer(tab) {

  intervalID = window.setInterval(function() { 
    chrome.tabs.sendMessage(tab.id, {action: "getDom"}, function (response) {
      if (response === "finished") {
        stopTimer();
      }
    });
  }, 500);
  
}

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  //Send kill message
  stopTimer();
});