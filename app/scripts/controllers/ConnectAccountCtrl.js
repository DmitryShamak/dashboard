angular.module("app")
	.controller("ConnectAccountCtrl", function($rootScope, $scope, api) {
		$scope.page = {
			noAccount: false
		};

		$scope.page.providers = [{
			type: 'google',
			available: true
		}, {
			type: 'linkedin'
		}, {
			type: 'instagram'
		}, {
			type: 'vk'
		}];

		$scope.connectToProvider = function(provider) {
			api.auth(provider);
		};

		$scope.init = function() {
			$scope.pageParams.busy = true;
			$scope.pageParams.offline = false;
		};
	});
