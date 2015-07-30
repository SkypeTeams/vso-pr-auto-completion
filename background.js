var tabIntervals = {};

chrome.extension.onMessage.addListener( function(request,sender,sendResponse){
  var tabId = request.tab.id;
  if(request.action === 'startTimer') {
    startTimer(tabId, request.tab.title);
  } else if (request.action === 'stopTimer') {
    stopTimer(tabId);
  } else if (request.action === 'getStatus') {
    sendResponse(tabIntervals[tabId] != null);
  }
});

function stopTimer(tabId) {
  if(tabIntervals[tabId]){
    window.clearInterval(tabIntervals[tabId].intervalID);
    tabIntervals[tabId] = null;
  }
}

function startTimer(tabId, title) {
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
    tabIntervals[tabId] = { intervalID: intervalID, title: title};
  }
  else{
    alert('Already watching - ' + title);
  }
}

function removeTab(tabId) {
  var stateInfo = tabIntervals[tabId];
  var isWatchingTab = stateInfo !== undefined;
  if(isWatchingTab) {
    var title = stateInfo.title;
    stopTimer(tabId);
    alert('You stopped watching PR - ' + title);
  }
}

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  removeTab(tabId);
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details){
  removeTab(details.tabId);
});