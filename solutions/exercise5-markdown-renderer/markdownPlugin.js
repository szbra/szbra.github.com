/*jslint browser:true devel:true*/
/*global window eclipse */

window.onload = function() {
	var provider = new eclipse.PluginProvider();

	//content type service
	provider.registerServiceProvider("orion.file.contenttype", {}, {
	contentTypes:
		[{	id: "text/x-web-markdown",
		name: "Markdown",
		extension: ["md", "markdown", "mdown","mkd", "mkdn"],
		image: "http://szbra.github.com/example2/bin/md.gif"
		}]
	});


	//navigator command service
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

	//related link service
	provider.registerServiceProvider("orion.page.link.related", {}, {
		id: "sample.markdown.viewer"
	});
	provider.connect();
};