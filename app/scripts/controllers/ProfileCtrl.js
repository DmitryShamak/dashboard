angular.module("app")
	.controller("ProfileCtrl", function($rootScope, $scope, storeModal, api) {
		$scope.page = {
			busy: true
		};

		$scope.profile = {
			providers: []
		};

		$scope.setPluginsUpdate = function(resolve, reject) {
			$scope.page.pending = true;
			var providers = $scope.profile.providers.map(function(item) {
				return item._id
			});

			api.user.update({
				query: {email: $scope.user.email},
				data: {
					providers: providers
				}
			}, function() {
				resolve && resolve();

				$scope.user.providers = providers;
				$scope.page.busy = false;
			}, function(err) {
				$scope.page.busy = false;

				reject && reject();
			});
		};

		$scope.appendProvider = function(provider) {
			$scope.profile.providers.push(provider);
			if($scope.feeds) {
				$scope.feeds.data = null;
			}
			$scope.setPluginsUpdate();
		};

		$scope.removeProvider = function(name, index) {
			var backup = $scope.profile.providers.splice(index, 1);

			var resolve = function() {
				if($scope.feeds && $scope.feeds.data) {
					var groupIndex = _.findIndex($scope.feeds.data, {provider: name});

					if(~groupIndex)
						$scope.feeds.data.splice(groupIndex, 1);
				}
			};
			var reject = function() {
				$scope.profile.providers.splice(index, 0, backup[0]);
			};
			$scope.setPluginsUpdate(resolve, reject);
		};

		$scope.showStore = function() {
			storeModal.show($scope);
		};

		$scope.getProfileData = function() {
			if(!$scope.user.providers.length) {
				return;
			}

			$scope.page.busy = true;
			$scope.page.offline = false;

			api.provider.get({
				providers: $scope.user.providers
			}, function(res) {
				$scope.profile.providers = res.data;

				$scope.page.busy = false;
			})
		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			$scope.getProfileData();
		};

		$scope.$watch("user", function() {
			if($scope.user) {
				$scope.init();
			}
		});
	});
