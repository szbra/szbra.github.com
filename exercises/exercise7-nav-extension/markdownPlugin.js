/*jslint browser:true devel:true*/
/*global window orion */

window.onload = function() {
	var provider = new orion.PluginProvider();

	//content type service

	//navigator command service
	var anchor = document.createElement('a');
	anchor.href = "index.html";

	//related link service

	provider.connect();
};