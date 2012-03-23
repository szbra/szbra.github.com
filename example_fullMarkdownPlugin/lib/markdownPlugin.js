/*******************************************************************************
 * Copyright (c) 2012 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*jslint forin:true regexp:false*/
/*global define document require window eclipse orion*/

require([
'orion/plugin', 'orion/editor/MarkdownContentAssist', 'orion/editor/MarkdownGrammar', 'markdown/markdown'],
function(mPlugin, MarkdownContentAssist, MarkdownGrammar) {

window.onload = function() {
	// create the plugin
	var provider = new eclipse.PluginProvider();
	
	var serviceImpl = {
		run : function(selectedText, text, selection) {
		
			// convert or uncovert
			var convert = true;
		
			var lines = selectedText.split('\n');
					
			for (var i=0; i<lines.length; i++){
				var position = lines[i].search("^[ \t]*\\* ");
				if (position > -1){
					convert = false;
				}			
			}
			
			// convert the first line only if whole is selected
			var include1 = true;
			
			if (selection.start !== 0 && text.charAt(selection.start-1) !== '\n'){
				include1 = false;
			}
				 
			var stringToReturn = "";

			// now covert
			for (i=0; i<lines.length; i++){
				if ((i === 0 && !include1) || (lines[i].replace(/\s/g,"") === "")){
					stringToReturn += lines[i];
				} else {
					if (convert){
						stringToReturn += (lines[i].replace(new RegExp("^[ \t]*"), " * "));
					} else {
						stringToReturn += (lines[i].replace(new RegExp("^[ \t]*\\* "), ""));
					}
				}
				
				if ((i !== (lines.length - 1))) {
					stringToReturn += '\n';
				}
			}

			return stringToReturn;
		}
	};
	
	var serviceProps = {
		name : "Convert to List"
	};
	
	provider.registerServiceProvider("orion.edit.command", serviceImpl, serviceProps);
	
	provider.registerServiceProvider("orion.edit.command", serviceImpl, serviceProps);
	
	provider.registerServiceProvider("orion.page.link", {}, {
		name: "Markdown Introduction",
		id: "orion.example1.pageLink.markDown",
		href: "http://daringfireball.net/projects/markdown/"
	});
	
	provider.registerServiceProvider("orion.file.contenttype", {}, {
		contentTypes:
			[{	id: "text/x-web-markdown",
				name: "Markdown",
				extension: ["md", "markdown", "mdown","mkd", "mkdn"],
				image: "http://szbra.github.com/example2/bin/md.gif"
			}]
	});
	
	provider.registerServiceProvider("orion.edit.contentAssist",
		new MarkdownContentAssist(), {	
			name: "Markdown content assist",
			contentType: ["text/x-web-markdown"]
		}
	);
	
	provider.registerServiceProvider("orion.edit.highlighter", {}, {	
		type: "grammar",
		contentType: ["text/x-web-markdown"],
		grammar: new MarkdownGrammar()
	});
	
	
	// Outliner and validator
	
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
	 * Converts a Markdown DOM into an array of outline elements as required
	 * by the Orion outliner service.
	 */
	function domToOutline(dom) {
		//end recursion
		if (!dom) {
			return null;
		}
		var outline = [];
		for (var i = 0; i < dom.length; i++) {
			var node = dom[i];
			if (node[0] === "header") {
				//for a header, label is third element in the list
				outline.push({label: node[2]});
			}
		}
		return outline;
	}

	// create the outline service instance
	var outlineService = {
		getOutline: function(contents, title) {
			var dom = parse(contents);
			if (dom) {
				return domToOutline(dom);
			}
		}
	};
	
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
						line: 1,
						start: 0,
						severity: "error"
					});
				}
			}
			return { problems: problems };
		}
	};

	provider.registerServiceProvider("orion.edit.outliner", outlineService, {
		contentType: ["text/x-web-markdown"],
		name: "Markdown Outline",
		id: "orion.edit.outliner.markdown"
	});
	
	provider.registerServiceProvider("orion.edit.validator", validationService, {
		contentType: ["text/x-web-markdown"]
	});
	
	provider.connect();
};
});