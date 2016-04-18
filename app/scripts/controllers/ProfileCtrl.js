angular.module("app")
	.controller("ProfileCtrl", function($rootScope, $scope, storeModal, api) {
		$scope.page = {
			busy: true
		};

		$scope.setPluginsUpdate = function(onError) {
			$scope.page.pending = true;
			var data = $scope.profile.providers.map(function(item) {
				return item._id
			});

			api.user.update({
				query: {email: $scope.user.email},
				data: {
					providers: data
				}
			}, function() {
				$scope.user.providers = data;
				$scope.page.busy = false;
			}, function(err) {
				$scope.page.busy = false;
				onError();
			});
		};

		$scope.appendProvider = function(provider) {
			$scope.profile.providers.push(provider);
			$scope.setPluginsUpdate();
		};

		$scope.removeProvider = function(index) {
			var backup = $scope.profile.providers.splice(index, 1);

			//on error
			$scope.setPluginsUpdate(function() {
				$scope.profile.providers.splice(index, 0, backup[0]);
			});
		};

		$scope.showStore = function() {
			storeModal.show($scope);
		};

		$scope.init = function() {
			$scope.page.busy = true;
			$scope.page.offline = false;

			api.provider.get({
				providers: $scope.user.providers
			}, function(res) {
				$scope.profile = {
					providers: res.data
				};

				$scope.page.busy = false;
			})
		};

		$scope.$watch("user", function() {
			if($scope.user) {
				$scope.init();
			}
		});
	});
