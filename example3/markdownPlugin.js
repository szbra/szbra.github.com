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
/*global eclipse window */

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
	
	provider.registerServiceProvider("orion.edit.highlighter", {}, {
	    type : "grammar",
	    contentType: ["text.markdown"],
	    grammar: {
			patterns: [
				{  
					begin: "#", 
					end: "\\$",
					captures: { "0": "punctuation.definition.comment.html" },
					contentName: "comment.block.html"
				}
			]
	    }
	});
	
	provider.connect();
};