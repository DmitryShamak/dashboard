angular.module("app")
	.directive("yearCalendar", function() {
		return {
			templateUrl: "/views/templates/year_calendar.html",
			replace: true,
			scope: {date: "=yearCalendar", onSelect: "="}, //@ string, = model, & method
			link: function(scope) {
				scope.getFullYear = function(date) {
					if(!date) {
						date = moment().toDate();
					}
					//return
					var year = {
						months: []
					};

					var monthsInYear = 12;

					for(var i=1; i<monthsInYear; i++) {
						var date = moment(date).month(i);
						year.months.push({
							date: date,
							short: date.format("MMM"),
							long: date.format("MMMM")
						});
					}

					return year;
				};

				scope.$watch("date", function(date) {
					date = date || moment().toDate();
					var year = scope.getFullYear(date);

					var yearNotes = scope.$parent.findDatesBy("year", date);

					_.forEach(year.months, function(month, ind) {
						var monthNotes = scope.$parent.findDatesBy("month", month.date, yearNotes);

						if(monthNotes.length) {
							month.reserved = true;
						}
					});

					scope.year = year;
				});
			}
		}
	});