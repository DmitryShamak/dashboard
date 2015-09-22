var dbProvider = require("./dbProvider.js");
var knockout = require("../knockout.js");
var viewProvider = {};

viewProvider.addListeners = function() {
	//Navigation links
	$(".navigation-links .link").click(viewProvider.linkCallback);

	//Task
	$("#tasks").on("click", ".toggle, .star", viewProvider.toggleActive);
};

initAction = function(elem, action) {
	var parent = elem.parentElement,
		newElem,
		count = 0,
		i = 0;

	switch(action) {
		case "repeat":
			count = parseInt(elem.getAttribute("data-count"));
			for(i; i<count; i++) {
				newElem = document.createElement(elem.tagName);
				newElem.className = elem.className;
				newElem.innerHTML = elem.innerHTML;

				parent.appendChild(newElem);
			}
			break;
	}
};

viewProvider.toggleActive = function(e) {
	var elem = this;
	$(elem).toggleClass("active");
};

viewProvider.findActions = function() {
	var bodyElem = document.getElementsByTagName("body")[0],
		elems = bodyElem.querySelectorAll("*[data-action]"),
		elem,
		action,
		i = 0;

	for(i; i < elems.length; i++) {
		elem = elems[i];
		action = elem.getAttribute("data-action");

		initAction(elem, action);
	}
};

viewProvider.getNotificationElement = function(type) {
	var elem = document.createElement("div"),
		className = "notification border-shadow ";

	className += type || "";

	elem.className = className;
	return elem;
};

viewProvider.toggleContent = function(data) {
	knockout.setData(data);
}

viewProvider.toggleNavigation = function(target) {
	var elem = document.getElementById("tasks"),
		className = target.className,
		active,
		i = 0;

	if(!~className.indexOf("active")) {
		className += " active";
	}

	active = viewProvider.navigationElem.querySelectorAll(".active");
	for(i; i < active.length; i++) {
		active[i].className = active[i].className.replace("active", "");
	};

	target.className = className;
};

viewProvider.showPreloader = function() {
	var className = viewProvider.contentElem.className,
		preloaderClass = "pending";
	
	if(!~className.indexOf(preloaderClass)) {
		viewProvider.contentElem.className += " " + preloaderClass;
	}
};

viewProvider.hidePreloader = function() {
	var className = viewProvider.contentElem.className,
		preloaderClass = "pending";
	
	if(~className.indexOf(preloaderClass)) {
		viewProvider.contentElem.className = className = className.replace(preloaderClass, "");
		viewProvider.contentElem.className = className.replace(/\s$/, "");
	}
};

viewProvider.getData = function(query, callback) {
	viewProvider.showPreloader();
	dbProvider.getData(query, function(err, data) {
		if(!err) {
			callback(data);
			viewProvider.hidePreloader();
		}
	});
}

viewProvider.linkCallback = function(e) {
	var elem = e.target,
		target = elem.getAttribute("data-target"),
		className = elem.className,
		active,
		i = 0;


	viewProvider.toggleNavigation(elem);

	viewProvider.getData(target, viewProvider.toggleContent);
};

viewProvider.inisialize = function() {
	var defaultQuery = "tasks";

	viewProvider.navigationElem = document.getElementById("navigation-wrapper");
	viewProvider.contentElem = document.getElementById("content-wrapper");

	if(viewProvider.navigationElem) {
		viewProvider.addListeners();
		viewProvider.findActions();
	}
	viewProvider.getData("profile", knockout.setProfile);
	viewProvider.getData(defaultQuery, viewProvider.toggleContent);
}

viewProvider.inisialize();

module.exports = viewProvider;