angular.module("app")
	.controller("CalendarCtrl", function($rootScope, $scope, api) {
		$scope.page = {};
		$scope.calendar = {
			showMonth: false
		};

		$scope.findDatesBy = function(param, date) {
			var result = $scope.calendar.notes.filter(function(item) {
				return moment(date).isSame(moment(item.date), param);
			});

			return result;
		};

		$scope.getCalendar = function() {
			$scope.calendar.busy = true;
			api.calendar.get({
				user: $scope.user._id
			}, function(res) {
				$scope.calendar.busy = false;
				$scope.calendar.notes = res.data;
			});
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

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;


			$scope.getCalendar();

			$scope.$watch("[calendar.date, calendar.showMonth]", function() {
				var format = $scope.calendar.showMonth ? "MMMM YYYY" : "YYYY";
				$scope.calendar.title = moment($scope.calendar.date).format(format);
			});
		};

		$scope.$watch("user", function() {
			if($scope.user) {
				$scope.init();
			}
		});
	});
