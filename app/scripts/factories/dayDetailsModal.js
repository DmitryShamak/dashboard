angular.module("app")
	.factory("dayDetailsModal", function(ngDialog) {
		var dialog = {};
		dialog.show = function(dayDetails, parentScope) {
			ngDialog.open({ 
				template: '/views/templates/dayDetailsModal.html',
				className: 'ngdialog-theme-default day-details-modal',
				controller: function($scope, api) {
					$scope.modal = {
						newNoteText: null
					};

					$scope.dayDetails = dayDetails;

					$scope.getDetailsFor = function(date) {
						$scope.dayDetails = parentScope.getDayDetails(date);

						$scope.init();
					};

					$scope.goBack = function() {
						var newDate = moment($scope.dayDetails.value).add(-1, "day").toDate();

						$scope.getDetailsFor(newDate);
					};
					$scope.goForward = function() {
						var newDate = moment($scope.dayDetails.value).add(1, "day").toDate();

						$scope.getDetailsFor(newDate);
					};

					$scope.addNote = function(text) {
						var note = {
							date: $scope.dayDetails.value,
							text: text
						};

						if(!$scope.dayDetails.notes) {
							$scope.dayDetails.notes = [];
						}

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

								parentScope.removeNote(res);
								var index = _.findIndex($scope.dayDetails.notes, {_id: note._id});
								$scope.dayDetails.notes.splice(index, 1);
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
								parentScope.addNote(res);
								$scope.dayDetails.reserved = true;
								$scope.dayDetails.notes.push(res);
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