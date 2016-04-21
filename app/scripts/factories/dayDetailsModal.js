angular.module("app")
	.factory("dayDetailsModal", function(ngDialog) {
		var dialog = {};
		dialog.show = function(dayDetails) {
			ngDialog.open({ 
				template: '/views/templates/dayDetailsModal.html',
				className: 'ngdialog-theme-default day-details-modal',
				controller: function($scope, api) {
					$scope.modal = {
						newNoteText: null
					};
					$scope.dayDetails = dayDetails;
					$scope.addNote = function(text) {
						var note = {
							date: $scope.dayDetails.value,
							text: text
						};

						if(!$scope.dayDetails.notes) {
							$scope.dayDetails.notes = [];
						}

						$scope.dayDetails.notes.push(note);
						$scope.dayDetails.reserved = true;
						$scope.saveDetails(note);
						$scope.modal.newNoteText = null;
					};

					$scope.removeNote = function(note) {
						if(!$scope.modal.busy) {
							$scope.modal.busy = true;
							api.notes.delete({
								_id: note._id
							}, function(res) {
								$scope.modal.busy = false;

								var index = _.findIndex($scope.dayDetails.notes, {_id: note._id});
								$scope.dayDetails.notes.splice(index, 1);

								$scope.dayDetails.reserved = !!$scope.dayDetails.notes.length;
							});
						}
					};

					$scope.saveDetails = function(details) {
						if(!$scope.modal.busy) {
							$scope.modal.busy = true;

							api.notes.save({
								data: {
									user: $scope.user._id,
									date: details.date,
									text: details.text
								}
							}, function(res) {
								$scope.modal.busy = false;
							});
						}
					};

					$scope.init = function() {
						$scope.dayDetails.title = moment($scope.dayDetails.value).format("MMMM DD YYYY");
					};

					$scope.init();
				} 
			});
		};

		return dialog;
	});