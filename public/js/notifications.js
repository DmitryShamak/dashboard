var url = "/";
var socket;

$(document).ready(function() {
	try{
		socket = io(url);
	} catch(err) {
		console.log(err);
	}

	if(!socket) {
		return false;
	}
	socket = io(url);
	socket.on('connect', function(){
		console.log("socket connected");
	});
	socket.on('showNotification', function(data){
		showNotification(data);
	});
	socket.on('disconnect', function(){});
});

var Notification = function(attrs) {
	var self = this;
	attrs = attrs ? attrs : {};
	var d = attrs.date ? new Date(attrs.date) : new Date();
	attrs = {
		author: attrs.author ? attrs.author : "System message",
		text: attrs.text ? attrs.text : "No Text",
		
		date: d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes()
	};

	self.setNotification = function() {
		document.body.appendChild(self.wrapperElem);

		self.timer = setTimeout(self.removeNotification, self.delay)
	};
	self.removeNotification = function() {
		if(self.action && self.action == "redirect") {
			 window.location.href = self.target;
		}
		clearTimeout(self.timer);
		document.body.removeChild(self.wrapperElem);
	};
	self.init = function() {
		self.wrapperElem = document.createElement("div");
		self.wrapperElem.className = "notification";

		self.closeElem = document.createElement("div");
		self.closeElem.className = "close-btn";
		self.closeElem.innerHTML = "x";
		self.closeElem.onclick = self.removeNotification;

		self.authorElem = document.createElement("div");
		self.authorElem.className = "notification-author";
		self.authorElem.innerHTML = attrs.author;

		self.textElem = document.createElement("div");
		self.textElem.className = "notification-text";
		$(self.textElem).append(attrs.text);
		self.action = $(self.textElem).find('span').attr('action');
		self.target = $(self.textElem).find('span').attr('target');
		if(self.action && self.action == "redirect") {
			self.delay = 1500;
		} else {
			self.delay = 10000;
		}

		self.dateElem = document.createElement("div");
		self.dateElem.className = "notification-date";
		self.dateElem.innerHTML = attrs.date;

		self.wrapperElem.appendChild(self.closeElem);
		self.wrapperElem.appendChild(self.authorElem);
		self.wrapperElem.appendChild(self.textElem);
		self.wrapperElem.appendChild(self.dateElem);

		self.setNotification();
	};
	self.init();
};

var showNotification = function(data) {
	data.date = data.date ? new Date(data.date).getTime() : new Date().getTime();
	var notification = new Notification(data);
};