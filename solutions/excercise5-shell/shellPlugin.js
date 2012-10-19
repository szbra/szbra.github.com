/*global orion window */

window.onload = function() {

	//plugin metadata
	var headers = {
		name: "Shell Command Example 1",
		version: "1.0",
		description: "Sample shell extension"
	};

	//create the plugin
	var provider = new orion.PluginProvider(headers);

	provider.connect();
};