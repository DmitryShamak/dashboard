var url = "http://localhost:1508";
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
		showNotification(data);
	});
};
var onWindowClose = function() {
	console.log("disconnect");
	socket.emit("onuserdissconnect", {id: socket.id});
};

window.onbeforeunload = onWindowClose;

$(document).ready(function() {
	connectSocket();
});

var Notification = function(attrs) {
	var self = this;
	attrs = attrs ? attrs : {};
	var d = attrs.date ? new Date(attrs.date) : new Date();
	attrs.author = attrs.author ? attrs.author : "System message";
	attrs.text = attrs.text ? attrs.text : "No Text";
	attrs.date = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();

	self.setNotification = function() {
		document.body.appendChild(self.wrapperElem);

		self.timer = setTimeout(self.removeNotification, self.delay);
		self.active = true;
		if(socket && self.redirect && globals.action) {
			var obj = attrs;
			obj.text = (globals ? (globals.user + " " + globals.action + " " + globals.name) : "System notification, are you sleeping");
			socket.emit("spreadNotifications", obj);
		}
	};
	self.removeNotification = function() {
		if(self.redirect) {
			 window.location.href = self.redirect;
		}
		self.active = false;
		if(self.timer) clearTimeout(self.timer);
		if(self.wrapperElem) document.body.removeChild(self.wrapperElem);
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
		self.textElem.innerHTML = attrs.text;

		self.redirect = attrs.redirect;
		if(self.redirect) {
			self.delay = 1500;
		} else {
			self.delay = 5000;
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
	data = (typeof data == "string") ? JSON.parse(data) : data;
	data.date = data.date ? new Date(data.date).getTime() : new Date().getTime();
	if(notification && notification.active) {
		notification.removeNotification();
	}

	notification = new Notification(data);
};