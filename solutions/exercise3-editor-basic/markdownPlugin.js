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
	var serviceImpl = {
		run: function(selectedText, text, selection) {
			return convertToFromList(selectedText);
		}
	};
	var serviceProps = {
		name: "Convert to List",
		key: ["l", true, true]
	};
	provider.registerServiceProvider("orion.edit.command", serviceImpl, serviceProps);

	//content assist service
	var contentAssistImpl = {
		computeProposals: function(prefix, buffer, selection) {
			var proposals = [];

			//template - simple markdown document
			if (buffer.length === 0) {
				var text = "# Heading 1 \r\n" + "## Sub-Heading 1.1 \r\n" + "### Sub-Sub Heading 1.1.1 \r\n" + "## Sub-Heading 1.2 \r\n" + "# Heading 2 \r\n" + "# Heading 3 \r\n";

				proposals.push({
					proposal: text,
					description: "Simple Markdown document",
					escapePosition: selection.offset + 152
				});
			}

			var proposalText = "[Link Name](http:// \"Optional Title Here\")";
			var description = "link";
			// exit position inside
			var exitOffset = selection.offset - prefix.length + 19;
			proposals.push({
				proposal: proposalText,
				description: description,
				escapePosition: exitOffset
			});

			return proposals;
		}
	};

	provider.registerServiceProvider("orion.edit.contentAssist", contentAssistImpl, {
		name: "Markdown content assist",
		contentType: ["text/x-web-markdown"]
	});

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

	provider.registerServiceProvider("orion.edit.highlighter", {}, {
		type: "grammar",
		contentType: ["text/x-web-markdown"],
		grammar: markdownGrammar
	});

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