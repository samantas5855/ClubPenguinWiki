var loadedTester = setInterval(function() {
   if(typeof mainRoom !== "undefined") {
       importScriptPage("MediaWiki:JacobsLadderSuite.js","d97"); // import the API
       setTimeout(function() {
            importScriptPage("MediaWiki:TitleNotifications.js","d97");
       },500);
       clearInterval(loadedTester);
   } 
},100);

// Tiny bit of code to add a second timestamp to incoming messages && inline alerts
function appendTimestamps() {
    if(cwmLoaded === true) {
        timer = new Date();
        hours = timer.getHours() % 12;
        if (hours === 0) { hours = 12; }
        minutes = timer.getMinutes();
        seconds = timer.getSeconds();
        if($("#entry-"+JLAPI.mostRecentMessage.cid()).hasClass('inline-alert')) {
            $("#entry-"+JLAPI.mostRecentMessage.cid()).append("<span class='time' style='font-weight: initial;'>"+hours+":"+padDigits(minutes,2)+":"+padDigits(seconds,2)+"</span>");
        } else {
            $("#entry-"+JLAPI.mostRecentMessage.cid()+" > span.time").html(hours+":"+padDigits(minutes,2)+":"+padDigits(seconds,2));
        }
    }
}
