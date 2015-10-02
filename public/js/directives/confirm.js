var confirmDir = function() {
	return {
		templateUrl: "/public/view/confirm.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.confirmation = {active: false};

			scope.showConfirmationPopup = function(text, cancelCb, confirmCb) {
				if(!cancelCb) {
					cancelCb = scope.hideConfirmationPopup;
				}

				if(confirmCb) {
					scope.confirmation = {
						onConfirm: function() {
							confirmCb(scope.activeNote, scope.hideConfirmationPopup);
						},
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