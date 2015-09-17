(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var goos = [],
	timer,
	bodyElem = document.getElementsByTagName("body")[0];

var Goo = function(attrs) {
	var self = this;
	self.pos = attrs.pos || {x: 0, y: 0};

	self.spawn();

	return self;
};

Goo.prototype.moveToPos = function(pos) {

};

Goo.prototype.spawn = function() {
	var self = this;

	var gooElem = document.createElement("div"),
		headElem = document.createElement("div"),
		leftEyeElem = document.createElement("div"),
		rightEyeElem = document.createElement("div"),

		containerElem = bodyElem;

	gooElem.className = "goo";
	gooElem.style.left = self.pos.x + "px";
	gooElem.style.top = self.pos.y + "px";

	headElem.className = "head";
	rightEyeElem.className = leftEyeElem.className = "eye";
	leftEyeElem.className += " left";
	rightEyeElem.className += " right";

	headElem.appendChild(rightEyeElem);
	headElem.appendChild(leftEyeElem);
	gooElem.appendChild(headElem);
	gooElem.addEventListener("click", function() {
		self.remove.call(self);
	});

	self.elem = gooElem;
	containerElem.appendChild(gooElem);
};

Goo.prototype.remove = function() {
	var elem = this.elem,
		parent = elem.parentElement;

	parent.removeChild(elem);
};

function addgoo(x, y) {
	if(document.getElementsByClassName("goo").length) {
		return;
	}
	var attrs = {};

	x = x || Math.random() * bodyElem.clientWidth;
	y = y || Math.random() * bodyElem.clientHeight;
	attrs.pos = {x: x, y: y};


	goos.push(new Goo(attrs));
};

function onTick() {
	var delay = Math.random() * 9999;
	timer = setTimeout(function() {
		addgoo();
		onTick();
	}, delay);
};

(function() {
	onTick();
})();
},{}],2:[function(require,module,exports){
var viewProvider = require("./providers/viewProvider.js");

function initialize() {
	
};

window.onload = initialize;
},{"./providers/viewProvider.js":4}],3:[function(require,module,exports){
var dbProvider = {};

dbProvider.getData = function(type, callback) {
	var delay = Math.random() * 999,
		data = {
			type: type
		};

	setTimeout(function() {
		callback(null, data);
	}, delay);
};

module.exports = dbProvider;
},{}],4:[function(require,module,exports){
var dbProvider = require("./dbProvider.js");
var viewProvider = {};

viewProvider.addListeners = function() {
	//Navigation links
	$(".navigation-links .link").click(viewProvider.linkCallback);

	//Portfolio gallery button
	$("#portfolio").on("click", ".preview-btn", viewProvider.showGallery);

	//Gallery
	$("#gallery").on("click", ".close-btn", viewProvider.hideGallery);
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
	console.info("Get Data", data);
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
		viewProvider.contentElem.className = className.replace(" " + preloaderClass, "");
	}
};

viewProvider.linkCallback = function(e) {
	var elem = e.target,
		target = elem.getAttribute("data-target"),
		className = elem.className,
		active,
		i = 0;


	viewProvider.toggleNavigation(elem);

	viewProvider.showPreloader();
	dbProvider.getData(target, function(err, data) {
		if(!err) {
			viewProvider.toggleContent(data);
			viewProvider.hidePreloader();
		}
	});
};

viewProvider.inisialize = function() {
	viewProvider.navigationElem = document.getElementById("navigation-wrapper");
	viewProvider.contentElem = document.getElementById("content-wrapper");

	if(viewProvider.navigationElem) {
		viewProvider.addListeners();
		viewProvider.findActions();
	}
}

viewProvider.inisialize();

module.exports = viewProvider;
},{"./dbProvider.js":3}]},{},[1,2]);
