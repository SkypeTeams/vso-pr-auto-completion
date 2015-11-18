chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getDom') {

    var reEval = $("a:contains('re-evaluate')");
    var reAttempt = $("a:contains('re-attempt')");
    var reBuild = $("a:contains('rebuild')");
    var succeeded = $(".vc-pullrequest-view-details-item-status span:contains('Build succeeded'):visible").length > 0;
    var noConflicts = $(".vc-pullrequest-view-details-item-status span:contains('No merge conflicts'):visible").length > 0;
    var mergeConflicts = $(".vc-pullrequest-view-details-item-status span:contains('Merge conflicts'):visible").length > 0;
    var approvedWithSuggestions = $(".vc-pullrequest-view-details-item-status span:contains('Reviewers approved with suggestions'):visible").length > 0;
    var approved = $(".vc-pullrequest-view-details-item-status span:contains('Reviewers approved'):visible").length > 0;
    var itemsNotLinked = $(".vc-pullrequest-view-details-item-status span:contains('No work items linked'):visible").length > 0;

    if (mergeConflicts) {
      sendResponse("finished");
      alert("Merge conflicts, please fix and then restart this tool");
      return;
    }

    if (itemsNotLinked) {
      sendResponse("finished");
      alert("Please link work items before proceeding");
      return;
    }

    if (reEval.length > 0 && reEval.css('display') !== 'none') {
      reEval[0].click();
      sendResponse("timeout");
    } else if (reAttempt.length > 0 && reAttempt.css('display') !== 'none') {
      sendResponse("finished");
      alert("Re attempting to check for conflicts -- this usually doesn't work so we stopped the program.");
    } else if (reBuild.length > 0 && reBuild.css('display') !== 'none') {
      reBuild[0].click();
    } else if (succeeded && noConflicts && (approved || approvedWithSuggestions)) {
      var button = $("button:contains('Complete pull request')")[0];
      button.click();
      
      // Wait for complete pull request popup to appear
      setTimeout(function completeMerge() {
        var mergePopup = $('.ui-dialog');
        var okButton = mergePopup.find('.ui-dialog-buttonpane #ok');
        okButton.click();
        sendResponse("finished");
        alert('committed PR');
      }, 200);
    }
  }
});