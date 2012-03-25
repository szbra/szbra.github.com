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

define(['orion/serviceregistry',
	'orion/pluginregistry',
	'orion/PageUtil', 
	'orion/textview/textView',
	'orion/textview/keyBinding',
	'orion/editor/editor',
	'orion/editor/editorFeatures',
	'showdown.js'],
	function(mServiceregistry, mPluginRegistry, PageUtil, mTextView, mKeyBinding, mEditor, mEditorFeatures) {

	var serviceRegistry = new mServiceregistry.ServiceRegistry();
	var editor;

	window.registerOrionFileService = function(host) {
		host = host || "orionhub.org";
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

	function updateEditor() {
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
			editor.setInput(resource, null, text);
		}, function(error) {
			console.log(error);
		});
	}

	function renderMarkup() {
		var converter = new Showdown.converter();
		document.getElementById("markdown").innerHTML = converter.makeHtml(editor.getText());
	}
	
	function save(editor) {
		editor.setInput(null, null, null, true);
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

		fileService.write(resource, editor.getText()).then(function() {
			editor.setInput(null, null, null, true);
		}, function(error) {
			console.log(error);
		});
	}

	
	function initializeEditor() {
		var editorDomNode = document.getElementById("editor");
	
		var textViewFactory = function() {
			return new mTextView.TextView({
				parent: editorDomNode,
				tabSize: 4
			});
		};
	
		var annotationFactory = new mEditorFeatures.AnnotationFactory();	
	
		var keyBindingFactory = function(editor, keyModeStack, undoStack, contentAssist) {
	
			// Create keybindings for generic editing
			var genericBindings = new mEditorFeatures.TextActions(editor, undoStack);
			keyModeStack.push(genericBindings);
	
			// create keybindings for source editing
			var codeBindings = new mEditorFeatures.SourceCodeActions(editor, undoStack, contentAssist);
			keyModeStack.push(codeBindings);
	
			// save binding
			editor.getTextView().setKeyBinding(new mKeyBinding.KeyBinding("s", true), "save");
			editor.getTextView().setAction("save", function() {
				save(editor);
				return true;
			});
			
			// speaking of save...
			document.getElementById("save").onclick = function() {
				save(editor);
			};
		};
	
		var dirtyIndicator = "";
		var status = "";
	
		var statusReporter = function(message, isError) {
			if (isError) {
				status = "ERROR: " + message;
			} else {
				status = message;
			}
			document.getElementById("status").innerHTML = dirtyIndicator + status;
		};
	
		var editor = new mEditor.Editor({
			textViewFactory: textViewFactory,
			undoStackFactory: new mEditorFeatures.UndoFactory(),
			annotationFactory: annotationFactory,
			lineNumberRulerFactory: new mEditorFeatures.LineNumberRulerFactory(),
			keyBindingFactory: keyBindingFactory,
			statusReporter: statusReporter,
			domNode: editorDomNode
		});
	
		editor.addEventListener("DirtyChanged", function(evt) {
			if (editor.isDirty()) {
				dirtyIndicator = "*";
			} else {
				dirtyIndicator = "";
			}
			document.getElementById("status").innerHTML = dirtyIndicator + status;
		});
	
		editor.installTextView();
		editor.highlightAnnotations();
		
		var renderScheduled = false;
		editor.getTextView().addEventListener("Modify", function() {
			if (!renderScheduled) {
				renderScheduled = true;
				setTimeout(function() {
					renderMarkup();
					renderScheduled = false;
				}, 100);
			}
		});
		

		// end of code to run when content changes.
		window.onbeforeunload = function() {
			if (editor.isDirty()) {
				return "There are unsaved changes.";
			}
		};
		
		window.onresize = function() {
			editorDomNode.style.height = (document.body.clientHeight - document.getElementById("logo").scrollHeight - 10) + "px";
		};
		window.onresize();
		
		return editor;
	}
	

	window.onload = function() {
		var pluginRegistry = new mPluginRegistry.PluginRegistry(serviceRegistry);

		var orionJSON = localStorage.orion;
		var plugins = orionJSON ? JSON.parse(orionJSON).plugins : ["http://orionhub.org/plugins/fileClientPlugin.html"];

		pluginRegistry.startup(plugins).then(function() {
			editor = initializeEditor();
			updateEditor();
		});
	};
	if (document.readyState === "complete") {
		window.onload();
	}

	window.onhashchange = updateEditor;
});