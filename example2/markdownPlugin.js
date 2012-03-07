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
	provider.registerServiceProvider("orion.file.contenttype", {}, {
		contentTypes:
			// Text types
			[{	id: "text.markdown",
			name: "Markdown",
			extension: ["md"],
			image: "http://szbra.github.com/example2/bin/md.gif"
			}]
	});

	provider.connect();
};