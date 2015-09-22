var ViewModel = function() {
	var self = this;

	self.profile = ko.observable();

	self.data = ko.observableArray();
	self.filters = ko.observableArray();

	self.generateFilters = function(arr) {
		var filters = [],
			type;

		arr.forEach(function(i) {
			type = i.type;
			if(type && !~filters.indexOf(type)) {
				filters.push(type);
			}
		});
		self.filters(filters);
	};

	/** This function set data to view component
		@params {Array} data
	*/
	self.setData = function(data) {
		self.generateFilters(data);
		self.data(data.map(function(i) {
			for(key in i) {
				i[key] = ko.observable(i[key]);
			}
			return i;
		}));
	};
	self.setProfile = function(data) {
		self.profile(data);
	};

	self.selectItem = function(item, ev) {
		item.selected(!item.selected());
	};

	self.openItem = function(item, ev) {
		//TODO: open item
		ev.cancelBubble = true;
	    if (ev.stopPropagation) {
	    	ev.stopPropagation(); 
	    }
	};
};
var viewModel = new ViewModel();

ko.applyBindings(viewModel);

/**
	Return control methods
*/
module.exports.setData = viewModel.setData;
module.exports.setProfile = viewModel.setProfile;