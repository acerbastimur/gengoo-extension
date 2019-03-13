(function() {
  console.log("BACKGROUND JS WORKED");

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log(tab);

    // read changeInfo data and do something with it (like read the url)
    if (changeInfo.status === "complete") {
      console.log("THE NEW URL IS ", tab.url);
      if (tab.url.includes("/watch")) {
        console.log("NETFLİX INJECTED!!!!!", tab.url);

        chrome.tabs.executeScript(tab.id, {
          // To inject Netflix.js into Content JS <3<3
          file: "assets/js/netflix.js"
        });
      }
    }
  });
})();
