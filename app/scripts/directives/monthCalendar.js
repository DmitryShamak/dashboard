angular.module("app")
	.directive("monthCalendar", function() {
		return {
			templateUrl: "/views/templates/month_calendar.html",
			replace: true,
			scope: {date: "=monthCalendar"},
			link: function(scope) {
				scope.getFullMonth = function(date) {
					if(!date) {
						date = moment().toDate();
					}
					//return
					var month = {
						title: moment(date).format("MMMM"),
						labels: [],
						dates: []
					};

					var daysInMonth = moment(date).daysInMonth();
					var monthStart = moment(date).startOf("month");
					var day = monthStart.day();



					for(var i=1; i< 8; i++) {
						month.labels.push({
							short: moment(date).isoWeekday(i).format("ddd"),
							long: moment(date).isoWeekday(i).format("dddd")
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

					return month;
				};

				scope.$watch("date", function(date) {
					scope.month = scope.getFullMonth(date);
				});
			}
		}
	});