angular.module("app")
	.directive("tips", function() {
		return {
			templateUrl: "/views/common/tips.html",
			controller: "TipsCtrl",
			replace: true
		}
	})
	.directive("tip", function($rootScope, $timeout) {
		return {
			templateUrl: "/views/templates/tip.html",
			replace: false,
			scope: {tip: "="},
			link: function(scope) {
				var hideDelay = 800,
					closeDelay = 10000;

				scope.closeTip = function() {
					scope.tip.hidden = true;

					$timeout(function() { scope.tip.visible = false; }, hideDelay);
				};

				if(!scope.lang) {
					scope.lang = $rootScope.lang;
				}

				scope.$on('languageChange', function (ev, lang) {
					scope.lang = lang;
				});

				$timeout(scope.closeTip, closeDelay);
			}
		}
	});