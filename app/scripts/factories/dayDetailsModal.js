angular.module("app")
	.factory("dayDetailsModal", function(ngDialog) {
		var dialog = {};
		dialog.show = function(dayDetails) {
			ngDialog.open({ 
				template: '/views/templates/dayDetailsModal.html',
				className: 'ngdialog-theme-default day-details-modal',
				controller: function($scope, api) {
					$scope.newNoteText = null;
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
						$scope.saveDetails(note);
						$scope.newNoteText = null;
					};

					$scope.saveDetails = function(details) {
						api.notes.save({
							data: {
								user: $scope.user._id,
								date: details.date,
								text: details.text
							}
						}, function(res) {
							console.log(res);
						});
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