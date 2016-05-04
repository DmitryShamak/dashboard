angular.module("app")
	.controller("ProfileCtrl", function($rootScope, $scope, storeModal, api) {
		$scope.page = {
			busy: true
		};

		$scope.profile = {
			providers: []
		};

		$scope.toggleTips = function() {
			if($scope.page.pending) {
				return;
			}
			$scope.page.pending = true;
			var showTips = !$scope.user.tips;

			api.user.update({
				query: {
					email: $scope.user.email
				},
				data: {
					tips: showTips
				}
			}, function() {
				$scope.page.pending = false;
				$scope.user.tips = !$scope.user.tips;
			});
		};

		$scope.setPluginsUpdate = function(resolve, reject) {
			$scope.page.busy = true;
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
			if(!$scope.profile.providers.length) {
				$scope.addTip({
					title: "feeds",
					body: "now_you_can_see_feeds_on_landing_page",
					link: {
						state: "landing",
						text: "go_to_landing"
					}
				});
			}

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
			if(!$scope.user.providers.length) {
				$scope.addTip({
					title: "provider_description",
					body: "select_provider_to_open_description"
				});
			}

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


			$scope.addTip({
				title: "tips",
				body: "you_can_switch_off_tips"
			});

			if(!$scope.profile.providers && $scope.profile.providers.length) {
				$scope.addTip({
					title: "providers",
					body: "open_providers_library_to_add_some"
				});
			}

			$scope.getProfileData();
		};

		if($scope.user) {
			return $scope.init();
		}
		$scope.$on('userConnect', function (event, data) {
			$scope.init();
		});
	});
