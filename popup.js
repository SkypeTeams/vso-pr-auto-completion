function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    var redirectContainer = $('#redirectContainer');
    var statusContainer = $('#statusContainer');
    if(tab.url.indexOf('visualstudio.com') < 0) {
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

function renderStatus(tabTitle, statusText) {
  $('#tabTitle').html(tabTitle);
  $('#status').html(statusText);
}

function stop() {
  getCurrentTab(function(tab) {
    chrome.extension.sendMessage({action: "stopTimer", tab: tab}, function (response) {});
    renderStatus(tab.title, 'Nothing running');
  });
}

function start() {
  getCurrentTab(function(tab) {
    renderStatus(tab.title, "Currently running");
    chrome.extension.sendMessage({action: "startTimer", tab: tab}, function (response) {});
  });
}

function getStatus() {
  getCurrentTab(function(tab) {
    chrome.extension.sendMessage({action: "getStatus", tab: tab}, function (response) {
      if (response) {
        renderStatus(tab.title, "Currently running");
      } else {
        renderStatus(tab.title, 'Nothing running');
      }
      
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {

  getStatus();

  $("#stopBtn").on("click", function(e) {
    stop();
  });

  $("#startBtn").on("click", function(e) {
    start();
  })
  
});