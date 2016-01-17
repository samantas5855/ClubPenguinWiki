/**
 * ChatPings plugin for Gamedezyner's ChatPlugins
 * Pings when someone mentions your name or any other specified phrases
 *
 * Created from ChatHacks
 * by Monchoman45
 */

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

chatPlugins.cookie.arrays.pings = [];
if (typeof(chatPlugins.cookie.get("chatPluginsPings"))=="undefined") {
	chatPlugins.cookie.set("chatPluginsPings",wgUserName);
	chatPlugins.cookie.load();
}
else {
	chatPlugins.cookie.load();
}
chatPlugins.modules.pings.settingsID = "pingsSettings";
chatPlugins.modules.pings.settingsFunction = function() {
	chatPlugins.settings.open("Chat Pings",'<div>List your ping keywords here, one on each line:</div><textarea name="pingsInput" id="pingsInput" style="height:200px;width:150px;margin:5px;vertical-align:top;"></textarea>',400,function() {
		chatPlugins.cookie.arrays.pings = $("#pingsInput").val().split("\n");
		var pings = chatPlugins.cookie.arrays.pings;
		while(pings.indexOf("") > -1) {
		  pings.splice(pings.indexOf(""), 1);
		}
		chatPlugins.cookie.save();
		chatPlugins.settings.cancel();
		}
	)
	$("#pingsInput").val(chatPlugins.cookie.arrays.pings.toString().replace(/,/g,"\n"))
}




window.hasFocus = true;
window.dinged = false;
window.ding = 0;
window.titleorig = document.title;
function Unding() { //for fixing the title after you've been dinged
	document.getElementsByTagName('title')[0].innerHTML = window.titleorig;
	clearInterval(window.ding);
	window.dinged = false;
}
$(window).bind('focus', Unding);
$(window).bind('focus', function() {window.hasFocus = true;});
$(window).bind('blur', function() {window.hasFocus = false;});

//Function for adding messages to the window
NodeChatDiscussion.prototype.iconPing = function (chat) {
	var icon = '';
	for(var i in this.model.users.models) {
		if(this.model.users.models[i].attributes.name == chat.attributes.name) {
			if(this.model.users.models[i].attributes.isStaff) {
				icon = ' <img class="stafficon" src="' + chatPlugins.custom.staffIcon + '">';
			}
			else if(this.model.users.models[i].attributes.isModerator) {
				icon = ' <img class="modicon" src="' + chatPlugins.custom.modIcon + '">';
			}
			break;
		}
	}
	if(icon) {this.chatUL.children().last().children('.username').html(this.chatUL.children().last().children('.username').html() + icon);}

	if(mainRoom.isInitialized && chat.attributes.name != wgUserName && !chat.attributes.isInlineAlert) {
		window.dinged = true;
		//resolve HTML
		var text = chat.attributes.text;
		var pings = chatPlugins.cookie.arrays.pings;

		var pingsRegexp = [];
		for(i=0;i<pings.length;i++) {
                        j = "\\b"+escapeRegExp(pings[i])+"\\b";
			k = new RegExp(j, "gi");
			pingsRegexp.push(k);
		}


		while(pingsRegexp.indexOf("") > -1) {
		  pingsRegexp.splice(pings.indexOf(""), 1);
		}

		for(var i = 0; i < pingsRegexp.length; i++) {
			if((text.toLowerCase().search(pingsRegexp[i]) != -1 || this != mainRoom.viewDiscussion) && JLAPI.mostRecentMessage.message().slice(0,9) != "!ChatGame") {
				if(!window.hasFocus) { //Only annoy people if the window isn't focused
					document.getElementById('sound').innerHTML = '<audio src="' + chatPlugins.custom.pingSound + '" autoplay=""></audio>';
				}
				this.scrollToBottom();
				if(this == mainRoom.viewDiscussion) {
					var ref = text.toLowerCase().search(pingsRegexp[i]);
					var phrase = text.slice(ref, ref + pings[i].length);
					this.chatUL.children().last().children('.message').addClass('ping');
				}
				break;
			}
		}
	}
}
mainRoom.model.chats.bind('afteradd', $.proxy(mainRoom.viewDiscussion.iconPing, mainRoom.viewDiscussion));

$('head').append('<style type="text/css">.message.ping {color:red;}</style>');
//Add the sound space
$('body').append('<span id="sound" style="display:none;"></span>');
console.log("[OPTIONS] pings: Loaded");
