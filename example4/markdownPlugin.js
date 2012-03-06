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
					
	//finally create the plugin
	var provider = new eclipse.PluginProvider();
	provider.registerServiceProvider("orion.file.contenttype", {}, {
		contentTypes:
			// Text types
			[{	id: "text.markdown",
			name: "Markdown",
			extension: ["md"],
			image: "http://szbra.github.com/0.5/plugins/markdown/images/md.gif"
			}]
	});
	provider.registerServiceProvider("orion.edit.outliner", outlineService, {
		contentType: ["text.markdown"],
		name: "Markdown Outline",
		id: "orion.edit.outliner.markdown"
	});
	provider.connect();

};