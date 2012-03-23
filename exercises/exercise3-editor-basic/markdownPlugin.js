/*global window eclipse*/

window.onload = function() {

	/**
	 * A helper function that converts lines of markdown text into a list. If the lines are already
	 * a list, it will remove the list markup.
	 * @param text input markdown text
	 * @return text converted to or from a list
	 */
	function convertToFromList(text) {
		// convert or uncovert
		var convert = true;

		//figure out which direction we're going
		var lines = text.split('\n');
		for (var i = 0; i < lines.length; i++) {
			var position = lines[i].search("^[ \t]*\\* ");
			if (position > -1) {
				convert = false;
			}
		}
		var result = "";

		// now covert
		for (i = 0; i < lines.length; i++) {
			if (lines[i].replace(/\s/g, "") === "") {
				result += lines[i];
			} else {
				if (convert) {
					result += (lines[i].replace(new RegExp("^[ \t]*"), " * "));
				} else {
					result += (lines[i].replace(new RegExp("^[ \t]*\\* "), ""));
				}
			}

			if ((i !== (lines.length - 1))) {
				result += '\n';
			}
		}

		return result;
	}
	// create the plugin
	var provider = new eclipse.PluginProvider();

	//editor command service	

	//content assist service

	//syntax highlighting service
	var markdownGrammar = {
		patterns: [
		// markdown grammar
		// headers
		{
			"match": "^#.*$",
			"name": "entity.name.tag.doctype.html"
		},
		// links
		{
			"match": "(^\\[.*\\]: ?[\\w:/.\\?\\&=_-]+( \".*\")?$)|(\\[.*\\](\\(.*\\))?)",
			"name": "token_keyword"
		},
		// lists
		{
			"begin": "^( )*([\\*\\+\\-]|(\\d.)) ",
			"end": "^$",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.comment.html"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.comment.html"
				}
			},
			"contentName": "comment.block.html",
			"patterns": [{
				"match": "\\[.*\\]",
				"name": "token_keyword"
			}]
		}]
	};

	//content type service	
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