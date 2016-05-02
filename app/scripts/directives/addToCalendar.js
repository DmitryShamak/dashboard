angular.module("app")
	.directive("addToCalendar", function($rootScope, api) {
		return {
			templateUrl: "/views/templates/add_to_calendar.html",
			replace: false,
			scope: {feed: "=addToCalendar"}, //@ string, = model, & method
			link: function(scope) {
				scope.userId = scope.$parent.getUserId();
				scope.note = {
					date: moment().toDate(),
					user: scope.userId,
					link: scope.feed.link,
					text: scope.feed.label
				};

				scope.cleanNote = function() {
					scope.note.text = scope.feed.label;
					scope.note.date = null;
				};

				scope.deleteNote = function(note) {
					if(scope.note.busy) {
						return;
					}

					scope.note.busy = true;
					api.notes.delete({
						user: note.user,
						link: note.link
					}, function() {
						scope.note.exists = false;
						scope.cleanNote();
						scope.note.busy = false;
					});

					scope.toggleNote();
				};

				scope.addNote = function(note) {
					if(scope.note.busy) {
						return;
					}

					scope.note.busy = true;

					if(!note.date) {
						note.date = moment().toDate();
					}
					api.notes.save({
						data: note
					}, function() {
						scope.note.exists = true;
						scope.note.busy = false;
					});

					scope.toggleNote();
				};

				scope.toggleNote = function() {
					scope.note.edit = !scope.note.edit;
				};

				scope.checkNote = function() {
					scope.note.busy = true;
					scope.note.exists = false;

					api.notes.get({
						user: scope.note.userId,
						link: scope.note.link
					}, function(res) {
						if(res.data.length) {
							scope.note.text = res.data[0].text;
							scope.note.date = moment(res.data[0].date).toDate();
							scope.note.exists = true;
						}
						scope.note.busy = false;
					}, function(err) {
						scope.note.busy = false;
					});
				};

				scope.init = function() {
					scope.$watch("feed", function() {
						if(scope.feed) {
							scope.checkNote();
						}
					});
				};

				scope.init();

				if(!scope.lang) {
					scope.lang = $rootScope.lang;
				}

				scope.$on('languageChange', function (ev, lang) {
					scope.lang = lang;
				});
			}
		}
	});