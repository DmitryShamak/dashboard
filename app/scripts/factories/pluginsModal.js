angular.module("app")
	.factory("pluginsModal", function(ngDialog, $interval, api) {
		var dialog = {};
		dialog.show = function(scope) {
			ngDialog.open({ 
				template: '/views/templates/pluginsModal.html',
				className: 'ngdialog-theme-default plagin-modal',
				controller: function($scope) {
					$scope.onConfirm = function(plugin) {
						//get plugins list
						ngDialog.close();
					};
					$scope.onCancel = function() {
						ngDialog.close();
					};
				} 
			});
		};

		return dialog;
	});