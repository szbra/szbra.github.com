/*jslint browser:true devel:true*/
/*global window eclipse */

window.onload = function() {
	var provider = new eclipse.PluginProvider();

	//content type service

	//navigator command service
	var anchor = document.createElement('a');
	anchor.href = "index.html";

	//related link service

	provider.connect();
};