angular.module("app")
	.directive("toDate", function() {
		return {
			scope: { date: "=", format: "@"},
			link: function (scope, element) {
				scope.$watch(scope.date, function() {
					var format = scope.format || "DD.MM.YYYY";
					element.text(moment(scope.date).format(format));
				});
			}
		}
	});