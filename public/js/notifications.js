var Notification = function(attrs) {
	var self = this;
	attrs = attrs ? attrs : {};
	var d = attrs.date ? new Date(attrs.date) : new Date();
	attrs = {
		text: attrs.author ? attrs.author : "No Text",
		author: attrs.text ? attrs.text : "No Author",
		
		date: d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes()
	};

	self.setNotification = function() {
		document.body.appendChild(self.wrapperElem);

		self.timer = setTimeout(self.removeNotification, 15000)
	};
	self.removeNotification = function() {
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
		self.textElem.innerHTML = attrs.text;

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

new Notification({date: new Date().getTime()});