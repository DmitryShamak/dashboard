angular.module("app")
	.directive("monthCalendar", function(api) {
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
						dates.push({
							value: newDate.toDate(),
							text: newDate.format("D")
						});
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

				scope.closeForm = function() {
					scope.activeDate.source.active = false;
					scope.activeDate = null;
				};

				scope.saveNote = function(date) {
					//TODO: save to db
					api.calendar.update({
						query: {
							user: scope.$parent.user._id,
							date: date.value
						},
						data: {
							user: scope.$parent.user._id,
							date: date.value,
							note: date.note
						}
					}, function(res) {
						console.log(res);
					});
					date.source.note = date.note;
					scope.closeForm();
				};

				scope.selectDate = function(ev, date) {
					if(scope.activeDate) {
						if(moment(scope.activeDate.value).isSame(date.value, "day")) {
							return;
						}
						scope.saveNote(scope.activeDate);
					}

					var elem = $('.form-wrapper');
					var container = $(ev.target).closest(".week");

					elem.appendTo(container);

					date.active = true;
					scope.activeDate = angular.copy(date);
					scope.activeDate.source = date;
				};

				scope.$watch("date", function(date) {
					scope.month = scope.getFullMonth(date);
				});
			}
		}
	});