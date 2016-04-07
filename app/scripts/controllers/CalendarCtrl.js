angular.module("app")
	.controller("CalendarCtrl", function($rootScope, $scope) {
		$scope.page = {};

		$scope.getFullMonth = function(date) {
			if(!date) {
				date = moment().toDate();
			}
			//return
			var month = {
				title: moment(date).format("MM YYYY"),
				labels: [],
				dates: []
			};

			var daysInMonth = moment(date).daysInMonth();
			var monthStart = moment(date).startOf("month");
			var day = monthStart.day();



			for(var i=1; i< 8; i++) {
				month.labels.push({
					short: moment().isoWeekday(i).format("ddd"),
					long: moment().isoWeekday(i).format("dddd")
				});
			}
			for(i=1; i< day; i++) {
				month.dates.push({
					empty: true
				});
			}
			for(i=1; i<= daysInMonth; i++) {
				month.dates.push({
					value: i
				});
			}

			//set user dates
			return month;
		};

		$scope.getFullYear = function(date) {

		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			$scope.calendar = $scope.getFullMonth();
		};

		$scope.init();
	});
