// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL matches regex
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: '.*:\/\/.*\.visualstudio\.com\/.*' },
          })
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

var tabIntervals = {};

/**
 * Handler for starting timer, stopping timer, and getting status of a given tab.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var tabId = request.tab.id;
  if (request.action === 'startTimer') {
    startTimer(tabId, request.tab.title);
  } else if (request.action === 'stopTimer') {
    stopTimer(tabId);
  } else if (request.action === 'getStatus') {
    sendResponse(tabIntervals[tabId] != null);
  }
});

/**
 * Stop the timer on the current tab
 */
function stopTimer(tabId) {
  if (tabIntervals[tabId]) {
    window.clearInterval(tabIntervals[tabId].intervalID);
    tabIntervals[tabId] = null;
  }
}

/**
 * Start the timer on current tab for watching PR.
 */
function startTimer(tabId, title) {
  if (!tabIntervals[tabId]) {

    var intervalID = window.setInterval(function () {
      // This will call the onMessage event handler on the tab with the given tabId
      chrome.tabs.sendMessage(tabId, { action: "getDom" }, function (response) {
        if (response === "finished") {
          stopTimer(tabId);
        } else if (response === "timeout") {
          stopTimer(tabId);
          window.setTimeout(function () {
            startTimer(tabId);
          }, 10000);
        }
      });
    }, 500);
    tabIntervals[tabId] = { intervalID: intervalID, title: title };
  }
  else {
    alert('Already watching - ' + title);
  }
}

/**
 * Stop watching the PR on the current tab.
 */
function removeTab(tabId) {
  var stateInfo = tabIntervals[tabId];
  if (stateInfo) {
    var title = stateInfo.title;
    stopTimer(tabId);
    alert('You stopped watching PR - ' + title);
  }
}

/**
 * Find out when the tab is closed.
 */
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  removeTab(tabId);
});

/**
 * Detect when we are navigating away from the page and remove tab.
 */
chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  removeTab(details.tabId);
});