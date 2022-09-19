function cropData(str, coords, callback) {
	var img = new Image();
	
	img.onload = function() {
        console.log("inside onload");
		var canvas = document.createElement('canvas');
		canvas.width = coords.w;
		canvas.height = coords.h;
	
		var ctx = canvas.getContext('2d');
	
		ctx.drawImage(img, coords.x, coords.y, coords.w, coords.h, 0, 0, coords.w, coords.h);
		
		let url = canvas.toDataURL();
        chrome.runtime.sendMessage({name: 'download', url}, (response) => {
            if (response.success) {
                console.log("Screenshot saved");
            } else {
                console.log("Could not save screenshot")
            }
            canvas.remove()            
        });
    }
	
	img.src = str;
}

chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    console.log("addListener");
    console.log(message);
    if (message.name === 'stream') {
        console.log("inside if message", message);
        cropData(message.imageUri, {x:message.x, y:message.y, w:message.w, h:message.h}, () => {});
    }
    return true;
});