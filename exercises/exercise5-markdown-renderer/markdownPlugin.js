/*jslint browser:true devel:true*/
/*global window eclipse localStorage*/

window.onload = function() {
	var provider = new eclipse.PluginProvider();
	var anchor = document.createElement('a');
	anchor.href = "index.html";
	provider.registerServiceProvider("orion.navigate.command", {
		run: function(item) {
			return anchor.href + "#" + item.Location;
		}
	}, {
		name: "Markdown Viewer",
		id: "sample.markdown.viewer",
		forceSingleItem: true,
		href: true,
		tooltip: "Render Markdown File",
		validationProperties: {
			"Name": "*.md"
		}
	});
	provider.registerServiceProvider("orion.page.link.related", {}, {
		id: "sample.markdown.viewer"
	});
	provider.connect();
};