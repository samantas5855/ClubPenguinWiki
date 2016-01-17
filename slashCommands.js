chatPlugins.modules.slashCommands.settingsID = "slashCommandSettings";
chatPlugins.modules.slashCommands.settingsFunction = function() { 
	chatPlugins.settings.open("Slash Commands",'<div>List your slash commands here, one on each line with the command and its content separated by a single colon.</div><div>Please note that only the first colon (:) will be counted as the divider! The following characters will automatically be removed to prevent errors: <code>\" \' \\</code></div><div><code>COMMAND:VALUE</code></div><textarea name="slashCommandsInput" id="slashCommandsInput" style="height:200px;width:580px;margin:5px;vertical-align:top;"></textarea><div>Mess something up? <a id="slashCommandsReset" href="#">Click Here</a> to restore the default commands.</div><div>This control panel edits <a href="/wiki/Special:MyPage/ChatPlugins/SlashCommands.js" target="_new">this page</a> when you click save.</div>',600,function() {
		chatPlugins.pages.list.slashCommands.value = chatPlugins.modules.slashCommands.parse($("#slashCommandsInput").val().replace(/\"/gm,"\\\""));
		chatPlugins.pages.save();
		chatPlugins.modules.slashCommands.load();
		chatPlugins.settings.cancel();
		}
	)
	$("#slashCommandsInput").val(chatPlugins.modules.slashCommands.unparse(chatPlugins.pages.list.slashCommands.value));
	$("#slashCommandsReset").click(chatPlugins.modules.slashCommands.defaults);
}
chatPlugins.modules.slashCommands.unparse =  function(input) {
	str = input.replace(/^\{\"/g,""); //Remove leading bracket and quote
	str = str.replace(/"}$/g,""); //Remove trailing bracket and quote
	str = str.replace(/\"\:\"/g,":"); //Remove quotes around colons
	str = str.replace(/\"\,\"/g,"\n"); //Replace commas with line breaks
	return str;
}
chatPlugins.modules.slashCommands.parse =  function(input) {
	var result = "";
	input = input.replace(/[\\\"\']/gm,"");	
	for (i in input.match(/^[^$]+?$/gm)) {
		var str = input.match(/^[^$]+?$/gm)[i];
		result += "\"" + str.slice(0,input.match(/^[^$]+?$/gm)[i].indexOf(":")) + "\":\"" + str.slice(input.match(/^[^$]+?$/gm)[i].indexOf(":")+1,input.match(/^[^$]+?$/gm)[i].length) + "\"";
		if (i < input.match(/^[^$]+?$/gm).length-1) {
			result += ",";
		}
	}
	result = "{" + result + "}";
	return result;
}
chatPlugins.modules.slashCommands.defaults =  function() {
	if (confirm("Are you sure you want to erase your current slash commands?")==true) {
		chatPlugins.pages.list.slashCommands.value = '{"rules":"Please read the [[Club_Penguin_Wiki:Policy/Chat|rules]]!","snowball":"/me throws you a snowball!","help":"I need help!","coppa":"http://coppa.org - You must be 13 or older to legally have an account on Wikia."}';
		chatPlugins.pages.save();
		chatPlugins.modules.slashCommands.commands = JSON.parse(chatPlugins.pages.list.slashCommands.value);
		$("#slashCommandsInput").val(chatPlugins.modules.slashCommands.unparse(chatPlugins.pages.list.slashCommands.value));
	}
}
chatPlugins.modules.slashCommands.load = function() {
	chatPlugins.pages.list.slashCommands = {name:"SlashCommands.js"};
	chatPlugins.pages.load();
	if (chatPlugins.pages.list.slashCommands.value == "error") {
		chatPlugins.pages.list.slashCommands.value = '{"rules":"Please read the [[Club_Penguin_Wiki:Policy/Chat|rules]]!","snowball":"/me throws you a snowball!","help":"I need help!","coppa":"http://coppa.org - You must be 13 or older to legally have an account on Wikia."}';
		chatPlugins.pages.save();
	}
	chatPlugins.modules.slashCommands.commands = JSON.parse(chatPlugins.pages.list.slashCommands.value);
}
chatPlugins.modules.slashCommands.test = function(input) {
	commandkeys = Object.keys(chatPlugins.modules.slashCommands.commands)
	result = input;
	for (i in commandkeys) {
		match = new RegExp("^\/"+commandkeys[i] + "$", "i");
		if (input.match(match) != null) {
			result = chatPlugins.modules.slashCommands.commands[commandkeys[i]];
		}
	}
	return result;
}

//Alter default sendMessage behavior so we can look for slash commands before sending them
NodeChatController.prototype.sendMessage = function(event) {
    if (this.active && event.which == 13 && !event.shiftKey) {
        var inputField = $(event.target),
            inputValue = inputField.val(),
            inputValueLength = inputValue.length;
        event.preventDefault();
		inputValue = chatPlugins.modules.slashCommands.test(inputValue);
        if (inputValue.length && inputValueLength <= this.maxCharacterLimit && inputValue.match(/^\/(?!me\s)/)==null) {
            var chatEntry = new models.ChatEntry({
                roomId: this.roomId,
                name: wgUserName,
                text: inputValue
            });
            if (!this.isMain()) {
                if (this.afterInitQueue.length < 1 || this.model.users.length < 2) {
                    this.mainController.socket.send(this.model.privateRoom.xport());
                }
                if (!this.isInitialized) {
                    this.afterInitQueue.push(chatEntry.xport());
                    chatEntry.set({
                        temp: true,
                        avatarSrc: wgAvatarUrl
                    });
                    this.model.chats.add(chatEntry);
                } else {
                    this.socket.send(chatEntry.xport());
                }
            } else {
                this.socket.send(chatEntry.xport());
            }
            inputField.val('').focus();
            $('body').removeClass('warn limit-near limit-reached');
        }
    }
}
mainRoom.viewDiscussion.unbind('sendMessage');
mainRoom.viewDiscussion.bind('sendMessage', $.proxy(mainRoom.sendMessage, mainRoom));
chatPlugins.modules.slashCommands.load();

console.log("[OPTIONS] slashCommands: Loaded");
