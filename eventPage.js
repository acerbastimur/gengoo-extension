chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
if(request.state == "youtube") {
    console.log("Youtube's been opened!");
 }
});

console.log("eventPage.js was started");
