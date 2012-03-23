/*global eclipse window */

window.onload = function() {
					
	// create the plugin
	var provider = new eclipse.PluginProvider();
	provider.registerServiceProvider("orion.file.contenttype", {}, {
		contentTypes:
			[{	id: "text/x-web-markdown",
			name: "Markdown",
			extension: ["md", "markdown", "mdown","mkd", "mkdn"],
			image: "http://szbra.github.com/example2/bin/md.gif"
			}]
	});

	provider.connect();
};