var url = "http://localhost:1507";
var socket,
	notification;
var connectSocket = function() {
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
	socket.on('disconnect', function(){
		connectSocket();
	});
	socket.on('showNotification', function(data){
		console.log("showNotification");
		showNotification(data);
	});
};
$(document).ready(function() {
	connectSocket();
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

		self.timer = setTimeout(self.removeNotification, self.delay);
		if(socket) {
			var obj = attrs;
			obj.text = '<span>' + (globals ? (globals.user + " " + globals.action + " " + globals.name) : "System notification, are you sleeping") + '</span>';
			socket.emit("spreadNotifications", obj);
		}
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
		var textElem = $(attrs.text);
		self.textElem.innerHTML = textElem.text();
		self.action = textElem.attr('action');
		self.target = textElem.attr('target');
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
	if(notification) {
		notification.removeNotification();
	}

	notification = new Notification(data);
};