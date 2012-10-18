/*global orion window */

window.onload = function() {

	//plugin metadata
	var headers = {
		name: "Orion Markdown Example 1",
		version: "1.0",
		description: "Markdown plugin that provides link to markdown info site."
	};

	//create the plugin
	var provider = new orion.PluginProvider(headers);
	
	provider.registerServiceProvider("orion.page.link", {}, {
		name: "Markdown Intro",
		id: "orion.example1.pageLink.markDown",
		uriTemplate: "http://daringfireball.net/projects/markdown/"
	});

	provider.connect();
};