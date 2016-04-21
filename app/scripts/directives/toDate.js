angular.module("app")
	.directive("toDate", function() {
		return {
			scope: { date: "=" },
			link: function (scope, element) {
				scope.$watch(scope.date, function() {
					var format = "DD.MM.YYYY";
					element.text(moment(scope.date).format(format));
				});
			}
		}
	});