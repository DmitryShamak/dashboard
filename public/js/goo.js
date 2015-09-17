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