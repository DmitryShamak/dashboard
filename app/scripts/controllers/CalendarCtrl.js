angular.module("app")
	.controller("CalendarCtrl", function($rootScope, $scope, api, dayDetailsModal) {
		$scope.page = {};
		$scope.calendar = {
			showMonth: false
		};

		$scope.findDatesBy = function(param, date, data) {
			var array = data || $scope.calendar.notes || [];
			var result = array.filter(function(item) {
				return moment(date).isSame(moment(item.date), param);
			});

			return result;
		};

		$scope.updateMonth = function(date) {
			 _.forEach($scope.calendar.months, function(month) {
				if(moment(month.date).isSame(moment(date), "month")) {
					month.updated = true;
				}
			});
		};

		$scope.removeNote = function(note, useApi) {
			var index = _.findIndex($scope.calendar.notes, {_id: note._id});
			$scope.calendar.notes.splice(index, 1);
			$scope.updateMonth(note.date);

			if(useApi) {
				$scope.calendar.busy = true;
				api.notes.delete({
					_id: note._id
				}, function(res) {
					$scope.calendar.busy = false;
				});
			}
		};
		$scope.addNote = function(note) {
			$scope.calendar.notes.push(note);
			$scope.updateMonth(note.date);
		};

		$scope.getDayDetails = function(date) {
			var dayNotes = $scope.findDatesBy("day", date);

			return {
				value: date,
				notes: dayNotes,
				reserved: (dayNotes.length > 0)
			}
		};

		$scope.getFullYear = function(date) {
			if(!date) {
				date = moment().toDate();
			}
			//return
			var year = [];

			var monthsInYear = 12;

			for(var i=0; i<monthsInYear; i++) {
				var date = moment(date).month(i);
				var month = {
					date: date,
					short: date.format("MMM"),
					long: date.format("MMMM"),
					updated: true
				};

				if(moment().isSame(date, "month")) {
					month.current = true;
				}

				year.push(month);
			}

			return year;
		};

		$scope.toggleListMode = function() {
			$scope.calendar.listMode = !$scope.calendar.listMode;
		};

		$scope.selectDate = function(ev, date) {
			dayDetailsModal.show(date, $scope);
		};

		$scope.getCalendar = function(date) {
			if(!$scope.calendar.busy) {
				$scope.calendar.busy = true;

				//todo: get date params from url
				api.notes.get({
					user: $scope.user._id,
					date: date,
					range: "year"
				}, function(res) {
					$scope.calendar.busy = false;

					$scope.calendar.notes = res.data;

					$scope.calendar.months = $scope.getFullYear(date);
				});
			}
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

			$scope.changeDate(-1, scale);
		};
		$scope.goForward = function() {
			var scale = "year";

			$scope.changeDate(1, scale);
		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			var date = moment().toDate();
			$scope.calendar.date = date;

			$scope.$watch("[calendar.date]", function() {
				var format = $scope.calendar.showMonth ? "MMMM YYYY" : "YYYY";
				$scope.calendar.title = moment($scope.calendar.date).format(format);

				$scope.getCalendar($scope.calendar.date);
			});
		};


		if($scope.user) {
			return $scope.init();
		}
		$scope.$on('userConnect', function (event, data) {
			$scope.init();
		});
	});
