/*jslint browser:true devel:true*/
/*global window eclipse */

window.onload = function() {
	var provider = new eclipse.PluginProvider();

	//content type service
	provider.registerServiceProvider("orion.core.contenttype", {}, {
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
	provider.registerServiceProvider("orion.navigate.command", {}, {
		name: "Markdown Viewer",
		id: "sample.markdown.viewer",
		forceSingleItem: true,
		tooltip: "Render Markdown File",
		validationProperties: [
		  {source: "Location", variableName: "Location"}
		  ],
		contentType: ["text/x-web-markdown"],
		uriTemplate: anchor.href + "#{Location}"
	});

	//related link service
	provider.registerServiceProvider("orion.page.link.related", {}, {
		id: "sample.markdown.viewer"
	});
	provider.connect();
};