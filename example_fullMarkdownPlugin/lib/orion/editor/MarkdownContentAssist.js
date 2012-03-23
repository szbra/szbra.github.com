/*******************************************************************************
 * @license
 * Copyright (c) 2012 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*global define */

define("orion/editor/MarkdownContentAssist", [], function() {

	/**
	 * @name orion.editor.MarkdownContentAssist
	 * @class Provides content assist for Markdown.
	 */
	function MarkdownContentAssist() {
	}
	
	MarkdownContentAssist.prototype = {
	
		/**
		 * Returns a string of all the whitespace at the start of the current line.
		 * @param {String} buffer The document
		 * @param {Object} selection The current selection
		 * @param {Integer} selection.offset The current selection offset
		 */
		leadingWhitespace: function(buffer, selection) {
			var whitespace = "";
			var offset = selection.offset-1;
			while (offset > 0) {
				var c = buffer.charAt(offset--);
				if (c === '\n' || c === '\r') {
					//we hit the start of the line so we are done
					break;
				}
				if (/\s/.test(c)) {
					//we found whitespace to add it to our result
					whitespace = c.concat(whitespace);
				} else {
					//we found non-whitespace, so reset our result
					whitespace = "";
				}
	
			}
			return whitespace;
		},
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
				return proposals;
			}

			var precedingChar = buffer.charAt(selection.offset-prefix.length-1);
			
			var element, proposalText, description, exitOffset;
			
			// if the character preceeding the prefix is not the start of an HTML element,
			// offer just the Markdown content assist
			if (precedingChar !== '<') {
			
				// elements with no closing element
				var mdNoClosingElements = [["*", "* - unordered list item"],
									 ["1.", "1. - ordered list item"],
									 [">", "> - blockquote"],
									 ["#", "# - 1st level header"],
									 ["##", "## - 2nd level header"],
									 ["###", "### - 3rd level header"],
									 ["----------", "--- - horizontal rule"]];
	 
				for (var i = 0; i < mdNoClosingElements.length; i++) {
					element = mdNoClosingElements[i][0];
					description = mdNoClosingElements[i][1];
					
					if (element.indexOf(prefix) === 0) {
						proposalText = element + " ";
						// exit position is the end of the element, so we need to substract the prefix already typed
						exitOffset = selection.offset+ proposalText.length -prefix.length;
						proposals.push({proposal: proposalText, description: description, escapePosition: exitOffset});
					}
				}
				
				
				var mdWithClosingElements = [["*", "*emphasis_span*"],
									 ["**", "**strong_span**"]];
									 
				for (i = 0; i < mdWithClosingElements.length; i++) {
					element = mdWithClosingElements[i][0];
					description = mdWithClosingElements[i][1];
					
					if (element.indexOf(prefix) === 0) {
						proposalText = element + element;
						
						// exit position is the end of the opening element tag, so we need to substract the prefix already typed
						exitOffset = selection.offset+element.length-prefix.length;
						proposals.push({proposal: proposalText, description: description, escapePosition: exitOffset});
					}
				}
				
				proposalText = "[Link Name](http:// \"Optional Title Here\")";
				description = "link";
				// exit position inside
				exitOffset = selection.offset - prefix.length + 19;
				proposals.push({proposal: proposalText, description: description, escapePosition: exitOffset});

				return proposals;
			}
			
			//elements that are typically placed on a single line (e.g., <b>, <h1>, etc)
			var singleLineElements = ["abbr","b","button","canvas","cite","command","dd","del","dfn","dt","em","embed",
				"font","h1","h2","h3","h4","h5","h6","i","ins","kbd","label","li","mark","meter","object","option","output",
				"progress","q","rp","rt","samp","small","strong","sub","sup","td","time","title","tt","u","var"];
			for (var i = 0; i < singleLineElements.length; i++) {
				element = singleLineElements[i];
				if (element.indexOf(prefix) === 0) {
					proposalText = element + "></" + element + ">";
					//exit position is the end of the opening element tag, so we need to substract the prefix already typed
					exitOffset = selection.offset+element.length-prefix.length+1;
					proposals.push({proposal: proposalText, description: "<" + proposalText, escapePosition: exitOffset});
				}
			}
			
			//elements that typically start a block spanning multiple lines (e.g., <p>, <div>, etc)
			var multiLineElements = ["address","article","aside","audio","bdo","blockquote","body","caption","code",
				"colgroup","datalist","details","div","fieldset","figure","footer","form","head","header",
				"hgroup","iframe","legend","map","menu","nav","noframes","noscript","optgroup","p","pre",
				"ruby","script","section","select","span","style","tbody","textarea","tfoot","th","thead",
				"tr","video"];
			var whitespace = this.leadingWhitespace(buffer, selection);
			for (i = 0; i < multiLineElements.length; i++) {
				element = multiLineElements[i];
				if (element.indexOf(prefix) === 0) {
					proposalText = element + ">\n" + whitespace + "\t\n" + whitespace + "</" + element + ">";
					//exit position is the end of the opening element tag, so we need to substract the prefix already typed
					exitOffset = selection.offset+element.length-prefix.length + whitespace.length + 3;
					proposals.push({proposal: proposalText, description: "<" + proposalText, escapePosition: exitOffset});
				}
			}
	
			//elements with no closing element (e.g., <hr>, <br>, etc)
			var emptyElements = ["area","base","br","col","hr","input","link","meta","param","keygen","source"];
			for (i = 0; i < emptyElements.length; i++) {
				element = emptyElements[i];
				if (element.indexOf(prefix) === 0) {
					proposalText = element + "/>";
					//exit position is the end of the element, so we need to substract the prefix already typed
					exitOffset = selection.offset+element.length-prefix.length+2;
					proposals.push({proposal: proposalText, description: "<" + proposalText, escapePosition: exitOffset});
				}
			}
	
			//deluxe handling for very common elements
			//image
			if ("img".indexOf(prefix) === 0) {
				proposalText = "img src=\"\" alt=\"Image\"/>";
				proposals.push({proposal: proposalText, description: "<" + proposalText, escapePosition: selection.offset+9-prefix.length});
			}
			//anchor
			if (prefix === 'a') {
				proposals.push({proposal: "a href=\"\"></a>", description: "<a></a> - HTML anchor element", escapePosition: selection.offset+7});
			}
			
			//lists should also insert first element
			if ("ul".indexOf(prefix) === 0) {
				proposalText = "ul>\n" + whitespace + "\t<li></li>\n" + whitespace + "</ul>";
				description = "<ul> - unordered list";
				//exit position inside first list item
				exitOffset = selection.offset-prefix.length + whitespace.length + 9;
				proposals.push({proposal: proposalText, description: description, escapePosition: exitOffset});
			}
			if ("ol".indexOf(prefix) === 0) {
				proposalText = "ol>\n" + whitespace + "\t<li></li>\n" + whitespace + "</ol>";
				description = "<ol> - ordered list";
				//exit position inside first list item
				exitOffset = selection.offset-prefix.length + whitespace.length + 9;
				proposals.push({proposal: proposalText, description: description, escapePosition: exitOffset});
			}
			if ("dl".indexOf(prefix) === 0) {
				proposalText = "dl>\n" + whitespace + "\t<dt></dt>\n" + whitespace + "\t<dd></dd>\n" + whitespace + "</dl>";
				description = "<dl> - definition list";
				//exit position inside first definition term
				exitOffset = selection.offset-prefix.length + whitespace.length + 9;
				proposals.push({proposal: proposalText, description: description, escapePosition: exitOffset});
			}
			if ("table".indexOf(prefix) === 0) {
				proposalText = "table>\n" + whitespace + "\t<tr>\n" + whitespace + "\t\t<td></td>\n" + 
					whitespace + "\t</tr>\n" + whitespace + "</table>";
				description = "<table> - basic HTML table";
				//exit position inside first table data
				exitOffset = selection.offset-prefix.length + (whitespace.length*2) + 19;
				proposals.push({proposal: proposalText, description: description, escapePosition: exitOffset});
			}
	
			return proposals;
		}
	};
	
	return MarkdownContentAssist;
});