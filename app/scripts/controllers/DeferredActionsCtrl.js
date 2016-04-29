angular.module("app")
	.controller("DeferredActionsCtrl", function($scope, $rootScope) {
		$scope.toggleDeferredList = function() {
			$scope.deferred.active = !$scope.deferred.active;
		};

		var init = function() {
			if(!$rootScope.deferred) {
				$scope.deferred = $rootScope.deferred = {};
			}

			$scope.deferred.busy = false;
			$scope.deferred.offline = false;

			$scope.deferred.link = {
				title: "Deferred Actions",
				state: false,
				icon: "fa-clock-o",
				iconMode: true,
				action: $scope.toggleDeferredList,
				value: 0
			};
		};

		$scope.$on('userConnected', function (event, data) {
			init();
		});

		$scope.$on('clickEvent', function (scopeEvent, $ev) {
			if($($ev.target).closest(".deferred-wrapper").length) {
				return;
			}
			$scope.deferred.active = false;
			$scope.apply($scope);
		});
	});
