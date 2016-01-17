// Chat Header Helpful Links
var chatTopicArray = [
	{
		url: mw.config.get("wgServer") + "/wiki/Club_Penguin_Wiki:Policy/Chat",
		text: "Chat Policy",
		imgUrl: "http://images.wikia.com/clubpenguin/images/e/ef/Rules_chat_header.png"
	},
	{
		url: mw.config.get("wgServer") + "/wiki/Club_Penguin_Wiki:IRC",
		text: "IRC",
		imgUrl: "http://images.wikia.com/clubpenguin/images/d/db/Irc_chat_header.png"
	},
	{
		url: mw.config.get("wgServer") + "/wiki/Special:RecentChanges",
		text: "Recent Changes",
		imgUrl: "http://images.wikia.com/clubpenguin/images/0/05/Pencil_Pin.PNG"
	},
	{
		url: mw.config.get("wgServer") + "/wiki/MediaWiki:Emoticons",
		text: "Emoticons List",
		imgUrl: "http://images.wikia.com/clubpenguin/images/5/5c/Old_Laugh_Emoticon.png"
	},
	{
		url: mw.config.get("wgServer") + "/wiki/Special:MyPage",
		text: "My Profile",
		imgUrl: "" + mw.config.get("wgAvatarUrl")
	}
];
if (typeof chatTopicArray === 'undefined') {
	var chatTopicArray = [
		{
			url: mw.config.get("wgServer") + "/wiki/Special:RecentChanges",
			text: "Recent Changes",
			imgUrl: "http://images.wikia.com/d97/images/7/7c/Icon_recent_changes.png"
		}, {
			url: mw.config.get("wgServer") + "/wiki/Special:MyPage",
			text: "My Profile",
			imgUrl: "" + wgAvatarUrl + ""
		}, {
			url: mw.config.get("wgServer") + "/wiki/Special:Chat?action=purge",
			text: "refresh",
			imgUrl: "http://images.wikia.com/d97/images/8/89/Icon_refresh.png"
		}
	];
}
 
ChatTopic = {
    VERSION: "2.1.1",
 
    loadApp: function() {
        mw.util.addCSS('/* remove title buttons when the chat window is too small */\n@media (max-width: 820px) {\n\t.chattopic-text {\n\t\tdisplay: none;\n\t}\n}');
 
        $('#ChatHeader > h1.public.wordmark').css('position', 'absolute');
        $('#ChatHeader > h1.public.wordmark').css('top', '0px');
 
        // Fixes the logo
 
        if (!$('.chattopic').length) {
 
            // Adds the container for the chat topic
 
            $('#ChatHeader').prepend('<div class="chattopic" style="margin-top: 10px; vertical-align: middle; text-align: center; z-index: 0; font-size: 13px; line-height: 145%;"></div>');
 
            // Adds the topic items
 
            for (i = 0; i < chatTopicArray.length; i++) {
                if (i < chatTopicArray.length - 1) {
                    $("div.chattopic").append('<a class="topiclink topiclink' + String(i) + '" href=' + chatTopicArray[i].url + ' target="_blank"><img src=' + chatTopicArray[i].imgUrl + ' height="12px" class="chattopic-icon" /> <span class="chattopic-text">' + chatTopicArray[i].text + '</span></a> • ');
                    if (chatTopicArray[i].url.indexOf(wgServer + "/wiki/Special:Chat") != -1) {
                        $("a.topiclink" + String(i)).attr("target", "");
                    }
                } else {
                    $("div.chattopic").append('<a class="topiclink topiclink' + String(i) + '" href=' + chatTopicArray[i].url + ' target="_blank"><img src=' + chatTopicArray[i].imgUrl + ' height="12px" class="chattopic-icon" /> <span class="chattopic-text">' + chatTopicArray[i].text + '</span></a>');
                    if (chatTopicArray[i].url.indexOf(wgServer + "/wiki/Special:Chat") != -1) {
                        $("a.topiclink" + String(i)).attr("target", "");
                    }
                }
            }
        }
 
        $("#ChatHeader > h1.private").remove(); // Stops the private chat header from causing problems
 
        console.log("[TOPIC] Loaded ChatTopic version " + ChatTopic.VERSION);
        // END Chat header
    }
};
 
ChatTopic.loadApp();
//lel
var loadedTester = setInterval(function() {
   if(typeof mainRoom !== "undefined") {
       setTimeout(function() {
            importScriptPage("ChatObject/code.js","dev");
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
