/*global eclipse window */

window.onload = function() {
	/**
	 * Parses a string containing markdown syntax, returning a simple JSON DOM
	 */
	function parse(contents) {
		if (!window.markdown) {
			return null;
		}
		return window.markdown.parse(contents);
	}

	/**
	 * Returns the line of the first occurrence of term, or 1 if not found.
	 * Line numbers start at 1.
	 */
	function getLine(text, term) {
		var lines = text.split("\n");
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].indexOf(term) >= 0) {
				return i+1;
			}
		}
		return 1;
	}

	/**
	 * Converts a Markdown DOM into an array of outline elements as required
	 * by the Orion outliner service.
	 */
	function domToOutline(dom, contents) {
		var outline = [];
		for (var i = 0; i < dom.length; i++) {
			var node = dom[i];
			if (node[0] === "header") {
				//for a header, label is third element in the list
				outline.push({label: node[2], line: getLine(contents, node[2])});
			}
		}
		return outline;
	}

	var provider = new eclipse.PluginProvider();

	// outline service
	var outlineService = {
		getOutline: function(contents, title) {
			var dom = parse(contents);
			if (dom) {
				return domToOutline(dom, contents);
			}
		}
	};
	provider.registerServiceProvider("orion.edit.outliner", outlineService, {
		contentType: ["text/x-web-markdown"],
		name: "Markdown Outline",
		id: "orion.edit.outliner.markdown"
	});
	
	/**
	 * Walks a markdown DOM and adds any discovered links to the given array.
	 */
	function findLinks(node, links) {
		//ignore strings
		if (typeof(node) === "string") {
			return;
		}
		if (node[0] === "link_ref") {
			links.push(node[1]);
			return;
		}
		//recurse on children
		for (var i = 0; i < node.length; i++) {
			findLinks(node[i], links);
		}
	}
	
	var validationService = {
		checkSyntax : function(title, contents) {
			var result = parse(contents);
			var refs = result[1].references;
			var links = [];
			findLinks(result, links);
			var problems = [];
			for (var i = 0; i < links.length; i++) {
				//check each link for a corresponding reference
				if (!refs[links[i].ref]) {
					//TODO links[i].original contains source.. we can find it to get line information
					problems.push({
						description: "Undefined link: " + links[i].ref,
						line: getLine(contents, links[i].original),
						start: 0,
						severity: "error"
					});
				}
			}
			return { problems: problems };
		}
	};
					
	provider.registerServiceProvider("orion.edit.validator", validationService, {
		contentType: ["text/x-web-markdown"]
	});

	//content type is always needed
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