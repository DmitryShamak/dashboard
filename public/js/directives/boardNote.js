var boardNote = function() {
	return {
		templateUrl: "/public/view/note.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.selectedNotes = [];

			scope.setActiveNote = function(note) {
				scope.selectedNotes.push(note);

				scope.activeNote = note;
				scope.updateControlPanel();
			};

			scope.selectNote = function(note, attrs) {
				if(!note.selected) {
					scope.setActiveNote(note);
					note.selected = true;
				} else {
					scope.unselectNote(note);
				}

				scope.apply();
			};

			scope.unselectNote = function(note) {
				note.selected = false;
				scope.activeNote = scope.selectedNotes(scope.selectedNotes.length-1);

				scope.selectedNotes.splice(scope.selectedNotes.indexOf(note), 1);
				scope.updateControlPanel();

				scope.apply();
			};

			elem.bind("click", function() {
				scope.selectNote(scope.note, attrs);
			});
		}
	}
};

module.exports = boardNote;