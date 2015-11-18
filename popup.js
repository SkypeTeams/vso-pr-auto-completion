// This script runs on the popup that appears by clicking the page action button

/**
 * Gets the current tab and runs the given callback if it has a VSO Pull Request open.
 */
function getCurrentTab(callback) {
  
  // Find the active tab in the current window
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  
  // Get all the tabs that have the properties specified in queryInfo
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    var redirectContainer = $('#redirectContainer');
    var statusContainer = $('#statusContainer');
    if(tab.url.indexOf('visualstudio.com') < 0 || tab.url.indexOf('/pullrequest/') < 0) {
      redirectContainer.show();
      statusContainer.hide();
    }
    else{
      redirectContainer.hide();
      statusContainer.show();
      callback(tab);
    }
  });
}

/**
 * Set the title and status on the page action popup
 */
function renderStatus(tabTitle, statusText) {
  $('#tabTitle').html(tabTitle);
  $('#status').html(statusText);
}

/**
 * Stop watching the PR on current tab.
 */
function stop() {
  getCurrentTab(function(tab) {
    chrome.runtime.sendMessage({action: "stopTimer", tab: tab}, function (response) {});
    renderStatus(tab.title, 'Nothing running');
  });
}

/**
 * Start watching the PR on current tab.
 */
function start() {
  getCurrentTab(function(tab) {
    renderStatus(tab.title, "Currently running");
    chrome.runtime.sendMessage({action: "startTimer", tab: tab}, function (response) {});
  });
}

/**
 * Updates the status of watching the Pull Request on the current tab.
 */
function getStatus() {
  getCurrentTab(function(tab) {
    chrome.runtime.sendMessage({action: "getStatus", tab: tab}, function (response) {
      if (response) {
        renderStatus(tab.title, "Currently running");
      } else {
        renderStatus(tab.title, 'Nothing running');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Update the status of watching PR on the current tab
  getStatus();
  
  // Attach click handler on stop button
  $("#stopBtn").on("click", function(e) {
    stop();
  });
  
  // Attach click handler on start button
  $("#startBtn").on("click", function(e) {
    start();
  })
});