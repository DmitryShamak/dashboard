angular.module("app")
	.controller("AdminCtrl", function($rootScope, $scope, api) {
		$scope.page = {};
		$scope.admin = {
			links: [{
				label: "Store",
				tab: "store"
			}]
		};
		$scope.admin.form = {};
		var defaultTab = "store";

		$scope.getTabData = function(tab) {
			$scope.page.busy = true;
			switch(tab) {
				case "store":
					api.store.get({}, function(res) {
						$scope.admin.data = res.data;

						$scope.page.busy = false;
					}, function(err) {
						$scope.store.busy = false;
						$scope.store.offline = true;
					});
					break;
			}
		};

		$scope.selectTab = function(tab) {
			$scope.admin.currentTab = tab;

			switch(tab) {
				case "store":
					$scope.admin.schema = [{
						key: "category"
					}, {
						key: "image"
					}, {
						key: "label"
					}, {
						key: "description"
					}, {
						key: "useLink"
					}, {
						key: "rate"
					}];

					$scope.getTabData(tab);
					break;
			}
		};

		$scope.onSubmit = function(data) {
			var tab = $scope.admin.currentTab;
			switch(tab) {
				case "store":
					api.plugin.save(data, function() {
						$scope.getTabData(tab);
						$scope.admin.form = {};
					});
					break;
			}
		};

		$scope.init = function() {
			$scope.page.busy = true;

			$scope.selectTab(defaultTab);

		};

		$scope.init();
	});
