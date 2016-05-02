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
				title: "deferred_actions",
				state: false,
				icon: "fa-clock-o",
				iconMode: true,
				action: $scope.toggleDeferredList,
				value: 0
			};
		};

		if($scope.user) {
			init();
		} else {
			$scope.$on('userConnect', function (event, data) {
				init();
			});
		}

		$scope.$on('userDisconnect', function (event, data) {
			if($scope.deferred) {
				$scope.deferred.hide = true;
			}
		});

		$scope.$on('clickEvent', function (scopeEvent, $ev) {
			if($($ev.target).closest(".deferred-wrapper").length) {
				return;
			}
			$scope.deferred.active = false;
			$scope.apply($scope);
		});
	});
