angular.module("app")
	.controller("ProfileCtrl", function($rootScope, $scope, pluginsModal) {
		$scope.page = {};
		$scope.page.profile = {};
		//fake data initializing
		$scope.page.profile.plugins = [{
			label: "Onliner",
			description: "last update on " + $scope.today().format("DD.MM.YYYYY"),
			status: "disabled"
		}];

		$scope.showPlugins = pluginsModal.show;

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;
		};

		$scope.init();
	});
