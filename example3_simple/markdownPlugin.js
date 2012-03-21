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
/*global define window eclipse*/

window.onload = function() {
	// create the plugin
	var provider = new eclipse.PluginProvider();
	
	var sampleMarkdownContent = 
		"# Heading 1 \r\n" +
		"## Sub-Heading 1.1 \r\n" +
		"### Sub-Sub Heading 1.1.1 \r\n" +
		"## Sub-Heading 1.2 \r\n" +
		"# Heading 2 \r\n" +
		"# Heading 3 \r\n";

	var serviceImpl = {
		run : function(text) {
			return text + "\r\n" + sampleMarkdownContent;
		}
	};
	
	var serviceProps = {
		name : "Add sample markdown"
	};
	
	provider.registerServiceProvider("orion.edit.command", serviceImpl, serviceProps);
	
	var contentAssistImpl = {
		computeProposals: function(prefix, buffer, selection) {
			var proposals = [];
			
			//template - simple markdown document
			if (buffer.length === 0) {
				var text = 
					"# Heading 1 \r\n" +
					"## Sub-Heading 1.1 \r\n" +
					"### Sub-Sub Heading 1.1.1 \r\n" +
					"## Sub-Heading 1.2 \r\n" +
					"# Heading 2 \r\n" +
					"# Heading 3 \r\n";
				
				proposals.push({proposal: text, description: "Simple Markdown document", escapePosition: selection.offset+152});
				
			}
			
			var proposalText = "[Link Name](http:// \"Optional Title Here\")";
			var description = "link";
			// exit position inside
			var exitOffset = selection.offset - prefix.length + 19;
			proposals.push({proposal: proposalText, description: description, escapePosition: exitOffset});
			
			return proposals;
		}
	};
	
	provider.registerServiceProvider("orion.edit.contentAssist", contentAssistImpl, {	
		name: "Markdown content assist",
		contentType: ["text.markdown"]
	});
	
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
					"0": { "name": "punctuation.definition.comment.html" }
				},
				"endCaptures": {
					"0": { "name": "punctuation.definition.comment.html" }
				},
				"contentName": "comment.block.html",
				"patterns": [
					{ "match": "\\[.*\\]", "name": "token_keyword"}
				]
			}
		]
	};
	
	provider.registerServiceProvider("orion.edit.highlighter", {}, {	
		type: "grammar",
		contentType: ["text.markdown"],
		grammar: markdownGrammar
	});
	
	provider.connect();
};