function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    callback(tab);
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function stop() {
  getCurrentTab(function(tab) {
    chrome.extension.sendMessage({action: "stopTimer", tab: tab}, function (response) {});
    renderStatus('Nothing running');
  });
}

function start() {
  getCurrentTab(function(tab) {
    renderStatus("Currently running");
    chrome.extension.sendMessage({action: "startTimer", tab: tab}, function (response) {});
  });
}

function getStatus() {
  getCurrentTab(function(tab) {
    chrome.extension.sendMessage({action: "getStatus", tab: tab}, function (response) {
      if (response) {
        renderStatus("Currently running");
      } else {
        renderStatus('Nothing running');
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