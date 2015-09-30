var boardNote = function() {
	return {
		templateUrl: "/public/view/note.tmpl",
		replace: true,

		link: function(scope, elem, attrs) {
			elem.bind("click", function() {
				scope.selectNote(scope.note, attrs);
			});
			elem.bind("dblclick", function() {
				scope.editNote(scope.note, true);
			});
		}
	}
};

module.exports = boardNote;