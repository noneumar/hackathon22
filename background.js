chrome.runtime.onInstalled.addListener(() => {
  console.log('Ext loaded.');
});

function onCaptured(tab, imageUri) {    
    if (imageUri && imageUri.length) {
        console.log("sending message");
        chrome.tabs.sendMessage(tab.id, {name: "stream", imageUri, x: 0, y: 0, w: tab.width, h: tab.height}, (response) => console.log(response))        
    }
}
  
function onError(error) {
    console.log(`Error: ${error}`);
}
  
chrome.action.onClicked.addListener(function (tab) {
    console.log('Current tab:', tab);
    let capturing = chrome.tabs.captureVisibleTab(null, {format: "png"});
    capturing.then((imageUri) => onCaptured(tab, imageUri), onError);
    senderResponse({success: true})
    return true;
})


chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    console.log("listener");
    console.log(message);
    if (message.name === 'download' && message.url) {
        console.log("listener inside if");
        chrome.downloads.download({
            filename: 'screenshot.png',
            url: message.url
        }, (downloadId) => {
            senderResponse({success: true})
        })        
    }
    return true;
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        console.log('onUpdated Current tab:', tab);
        let capturing = chrome.tabs.captureVisibleTab(null, {format: "png"});
        capturing.then((imageUri) => onCaptured(tab, imageUri), onError);        
    }
});