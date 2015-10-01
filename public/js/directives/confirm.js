var confirmDir = function() {
	return {
		templateUrl: "/public/view/confirm.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.confirmation = {active: true};

			scope.showConfirmationPopup = function(text, cancelCb, confirmCb) {
				if(!cancelCb) {
					cancelCb = scope.hideConfirmationPopup;
				}

				if(confirmCb) {
					scope.confirmation = {
						onConfirm: confirmCb,
						onCancel: cancelCb,
						text: text,
						active: true 
					};
				}
			};

			scope.hideConfirmationPopup = function() {
				scope.confirmation = {
					onConfirm: null,
					onCancel: null,
					text: "",
					active: false
				};
			};
		}
	}
};

module.exports = confirmDir;