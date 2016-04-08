angular.module("app")
	.controller("CalendarCtrl", function($rootScope, $scope) {
		$scope.page = {};
		$scope.calendar = {
			showMonth: false
		};

		$scope.toggleMonth = function(date) {
			if(date) {
				$scope.calendar.date = date;
			}

			$scope.calendar.showMonth = !$scope.calendar.showMonth;
		};

		$scope.changeDate = function(dir, scale) {
			$scope.calendar.date = moment($scope.calendar.date).add(dir, scale).toDate();
		};

		$scope.goBack = function() {
			var scale = "year";
			if($scope.calendar.showMonth) {
				scale = "month";
			}

			$scope.changeDate(-1, scale);
		};
		$scope.goForward = function() {
			var scale = "year";
			if($scope.calendar.showMonth) {
				scale = "month";
			}

			$scope.changeDate(1, scale);
		};

		$scope.$watch("[calendar.date,calendar.showMonth]", function() {
			var format = $scope.calendar.showMonth ? "MMMM YYYY" : "YYYY";
			$scope.calendar.title = moment($scope.calendar.date).format(format);
		});

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;
		};

		$scope.init();
	});
