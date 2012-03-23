/*******************************************************************************
 * @license
 * Copyright (c) 2012 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 * 
 * Contributors: IBM Corporation - initial API and implementation
 ******************************************************************************/

/*jslint browser:true devel:true*/
/*global define window localStorage Showdown*/

define(['orion/serviceregistry', 'orion/pluginregistry', 'orion/PageUtil', 'showdown.js'], function(mServiceregistry, mPluginRegistry, PageUtil) {

	var serviceRegistry = new mServiceregistry.ServiceRegistry();

	window.registerOrionFileService = function(host) {
		host = host || "orion.eclipse.org";
		localStorage.orion = '{"plugins":["http://' + host + '/plugins/fileClientPlugin.html"]}';
	};

	function getFileService(resource) {
		var allReferences = serviceRegistry.getServiceReferences("orion.core.file");

		for (var i = 0; i < allReferences.length; ++i) {
			var reference = allReferences[i];
			var patternString = reference.getProperty("pattern") || ".*";
			if (patternString[0] !== "^") {
				patternString = "^" + patternString;
			}

			var pattern = new RegExp(patternString);
			if (pattern.test(resource)) {
				return serviceRegistry.getService(reference);
			}
		}
		
		if (allReferences.length !== 0 && resource.indexOf(":") === -1) {
			return serviceRegistry.getService(allReferences[0]);
		}
		
		return null;
	}

	function renderMarkup() {
		var parameters = PageUtil.matchResourceParameters();

		var resource = parameters.resource;
		if (!resource) {
			console.log("No resource to render");
			return;
		}

		var fileService = getFileService(resource);
		if (!fileService) {
			console.log("No file service for: " + resource);
			return;
		}

		fileService.read(resource).then(function(text) {
			var converter = new Showdown.converter();
			document.getElementById("markdown").innerHTML = converter.makeHtml(text);
		}, function(error) {
			console.log(error);
		});

	}

	window.onload = function() {
		var pluginRegistry = new mPluginRegistry.PluginRegistry(serviceRegistry);

		var orionJSON = localStorage.orion;
		var plugins = orionJSON ? JSON.parse(orionJSON).plugins : [];

		pluginRegistry.startup(plugins).then(function() {
			renderMarkup();
		});
	};
	if (document.readyState === "complete") {
		window.onload();
	}

	window.onhashchange = renderMarkup;
});