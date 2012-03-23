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

/*jslint */
/*global define */

define("orion/editor/MarkdownGrammar", [], function() {

	/**
	 * Provides a grammar that can do some very rough syntax highlighting for Markdown.
	 * @name orion.editor.MarkdownGrammar
	 */
	return function MarkdownGrammar() {
		/**
		 * Object containing the grammar rules.
		 */
		 this.name = "Markdown";
		 
		 this.patterns = [
			// markdown grammar
			{
				"match": "^#.*$",
				"name": "entity.name.tag.doctype.html"
			},
			{
				"match": "(^\\[.*\\]: ?[\\w:/.\\?\\&=_-]+( \".*\")?$)|(\\[.*\\](\\(.*\\))?)",
				"name": "token_keyword"
			},
//			{
//				"begin": "Szymon$",
//				"end": "Brandys$",
//				"patterns": [
//					{ "match": "> .+", "name": "entity.name.tag.doctype.html" },
//					{ "match": "( {3,}|\t).+", "name": "entity.name.tag.doctype.html" }
//				]
//			},
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
			},
			// inline HTML grammar
			{
				"begin": "<!--",
				"end": "-->",
				"beginCaptures": {
					"0": { "name": "punctuation.definition.comment.html" }
				},
				"endCaptures": {
					"0": { "name": "punctuation.definition.comment.html" }
				},
				"patterns": [
					{
						"match": "--",
						"name": "invalid.illegal.badcomment.html"
					}
				],
				"contentName": "comment.block.html"
			},
			{ // startDelimiter + tagName
				"match": "<[A-Za-z0-9_\\-:]+(?= ?)",
				"name": "entity.name.tag.html"
			},
			{ "include": "#attrName" },
			{ "include": "#qString" },
			{ "include": "#qqString" },
			{ "include": "#entity" },
			// TODO attrName, qString, qqString should be applied first while inside a tag
			{ // startDelimiter + slash + tagName + endDelimiter
				"match": "</[A-Za-z0-9_\\-:]+>",
				"name": "entity.name.tag.html"
			},
			{ // end delimiter of open tag
				"match": ">", 
				"name": "entity.name.tag.html"
			} 
		];

		this.repository = {
			"attrName": { // attribute name
				"match": "[A-Za-z\\-:]+(?=\\s*=\\s*['\"])",
				"name": "entity.other.attribute.name.html"
			},
			"qqString": { // double quoted string
				"match": "(\")[^\"]+(\")",
				"name": "string.quoted.double.html"
			},
			"qString": { // single quoted string
				"match": "(')[^']+(\')",
				"name": "string.quoted.single.html"
			},
			"entity": {
				"match": "&[A-Za-z0-9]+;",
				"name": "constant.character.entity.html"
			}
		};
	};
});
