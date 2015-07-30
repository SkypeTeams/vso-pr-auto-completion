# vso-pr-auto-completion
This chrome extension will allow you to click start and have it re-evaluate, re-build and finally complete a vso pull request

### How to run
1. Clone this project
2. Open chrome and go to chrome://extensions
3. Click Load unpacked extension...
4. Find this folder and load it in
5. Find a VSO page and click the chrome extension icon and click start

### Current features:
1. Runs in a background chrome js file that every 500ms will check to see if all 3 status options are green. If yes it will complete pull request.
2. If there is a merge conflict, it will alert the user and cancel the operation
3. If there is the option to re-evaluate (due to other checkin to develop), it will automatically click it and wait 5 seconds before doing anything else due to VSO being slow at refreshing build status
4. Waits for build to finish and will re-build if required

### Current issues:
1. The VSO re-attempt button sometimes shows up instead of re-evaluate. This seems to generally not work on VSO, ie you have to quit the browser and try again for it to actually properly handle the merge. The chrome extension simply alerts the user about this and quits the process.

### How to develop more
1. Run the steps above for "How to run"
2. Change the code with whatever you want
3. Go to chrome://extensions and reload the package
4. Fork the repo and submit a pull request if you want to push it back to us
