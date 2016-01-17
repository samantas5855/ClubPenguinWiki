// AFK Button for ChatPlugins

//Unbind all of the window listeners that set your status to back
$(window).unbind('mousemove').unbind('focus');

chatPlugins.cookie.arrays.afkLocation = [];
if (typeof(chatPlugins.cookie.get("chatPluginsAfkLocation"))=="undefined") {
	chatPlugins.cookie.set("chatPluginsAfkLocation","menu");
	chatPlugins.cookie.load();
}
else {
	chatPlugins.cookie.load();
}
//Add ChatPlugins button

if( !$("#afkButton").length ) {
  $("div.chattopic").append(' • <a href="#" id="afkButton" class="topiclink"><img src="http://img2.wikia.nocookie.net/__cb20140924134226/d97/images/b/be/Icon_afk.png" height="12px" class="chattopic-icon" /> go afk</span>');
  $('form#Write').append('<a class="wikia-button" href="#" id="afkButton" style="position:absolute; right:50px; top:0;">Multi Kick</a>');
}

//Go AFK when button clicked
$("#afkButton").click(function() {mainRoom.setAway()});

console.log("[OPTIONS] afkButton: Loaded");
