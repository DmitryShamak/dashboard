angular.module("app")
	.directive("monthCalendar", function(api) {
		return {
			templateUrl: "/views/templates/month_calendar.html",
			replace: false,
			scope: {monthParams: "=monthCalendar", selectDate: "="},
			link: function(scope) {
				scope.getFullMonth = function(date) {
					if(!date) {
						date = moment().toDate();
					}
					//return
					var month = {
						title: moment(date).format("MMMM"),
						labels: [],
						weeks: []
					};

					var daysInMonth = moment(date).daysInMonth();
					var monthStart = moment(date).startOf("month");
					var day = monthStart.day();
					var dates = [];
					var week = -1;

					for(var i=1; i< 8; i++) {
						month.labels.push({
							short: moment(date).isoWeekday(i).format("ddd"),
							long: moment(date).isoWeekday(i).format("dddd")
						});
					}
					for(i=1; i< day; i++) {
						dates.push({
							empty: true
						});
					}
					for(i=1; i<= daysInMonth; i++) {
						var newDate = moment(date).date(i);
						var newDay = {
							value: newDate.toDate(),
							num: newDate.format("D")
						};

						if(moment().isSame(newDate, "day")) {
							newDay.current = true;
						}

						dates.push(newDay);
					}

					_.forEach(dates, function(date, index) {
						if(index%7 === 0) {
							month.weeks.push([]);
							week++;
						}

						month.weeks[week].push(date);
					});

					return month;
				};

				scope.$watch("monthParams", function(monthParams) {
					var month = scope.getFullMonth(monthParams.date);

					var monthNotes = scope.$parent.findDatesBy("month", monthParams.date);

					_.forEach(month.weeks, function(week, ind) {
						_.forEach(week, function(day, ind) {
							if(!day.value) {
								return;
							}

							var dayNotes = scope.$parent.findDatesBy("day", day.value, monthNotes);

							if(dayNotes.length) {
								day.reserved = true;
								day.notes = dayNotes.map(function(item) {
									return {
										_id: item._id,
										date: item.date,
										text: item.text
									}
								});
							}
						});
					});

					scope.month = month;
				});
			}
		}
	});