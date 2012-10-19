/*global orion window */

window.onload = function() {

	//plugin metadata
	var headers = {
		name: "Shell Command Example 1",
		version: "1.0",
		description: "Sample shell extension"
	};

	var serviceImpl = {
		callback: function(args) {
			return "<b>" + args.string + "<\/b>";
		}
	};
	
	var serviceProperties = { 
		name: "echo",
		description: "Echo a string",
		parameters: [{
			name: "string",
			type: "string",
			description: "The string to echo back"
 		}]
	};
	
	//create the plugin
	var provider = new orion.PluginProvider(headers);

	provider.registerServiceProvider(
		"orion.shell.command",
		serviceImpl,
		serviceProperties);
		
	provider.connect();
};