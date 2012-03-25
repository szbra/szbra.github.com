/*global eclipse window */

window.onload = function() {
					
	//create the plugin
	var provider = new eclipse.PluginProvider();
	
	provider.registerServiceProvider("orion.page.link", {}, {
		name: "Markdown Introduction",
		id: "orion.example1.pageLink.markDown",
		href: "http://daringfireball.net/projects/markdown/"
	});

	provider.connect();
};