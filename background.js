var tabIntervals = {};

chrome.extension.onMessage.addListener( function(request,sender,sendResponse){
  var tabId = request.tab.id;
  if(request.action === 'startTimer') {
    startTimer(tabId);
  } else if (request.action === 'stopTimer') {
    stopTimer(tabId);
  } else if (request.action === 'getStatus') {
    sendResponse(tabIntervals[tabId] != null);
  }

});

function stopTimer(tabId) {
  if(tabIntervals[tabId]){
    window.clearInterval(tabIntervals[tabId]);
    tabIntervals[tabId] = null;
  }
}

function startTimer(tabId) {
  if(!tabIntervals[tabId]) {

    var intervalID = window.setInterval(function() {
      chrome.tabs.sendMessage(tabId, {action: "getDom"}, function (response) {
        if (response === "finished") {
          stopTimer(tabId);
        } else if (response === "timeout") {
          stopTimer(tabId);
          window.setTimeout(function() {
            startTimer(tabId);
          }, 5000);
        }
      });
    }, 500);
    tabIntervals[tabId] = intervalID;
  }
}

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  //Send kill message
  stopTimer(tabId);
});