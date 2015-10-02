var orderControl = function() {
	return {
		templateUrl: "/public/view/order_control.tmplt",
		replace: false,

		link: function(scope, elem, attrs) {
			scope.toggleOrder = function() {
				
			};

			elem.bind("click", function() {
				//TODO: toggleOrder(order.type)
			});
		}
	}
};

module.exports = orderControl;