angular.module("app")
	.controller("VotingCtrl", function($rootScope, $scope, api) {
		$scope.page = {};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			/* VOTING PARAMS
			* items: Array [{key, label}],
			* confirmed: Array [{item_key}],
			* startDate: Date
			* endDate: Date
			* */

			/* VOTE PARAMS
			* _id: VoteId,
			* label: String
			* */
			$scope.addVote = function(params) {
				//add vote item
				//add vote with current user
				//clear form input
				//update changes
			};

			$scope.vote = function(params) {
				//
			};

			$scope.votings = [{
				title: "what portal should add next?",
				items: [{
					label: "mmorpg.ru",
					votes: 1
				}, {
					label: "steam.store",
					votes: 4
				}, {
					label: "xaker.ru",
					votes: 0
				}, {
					label: "hi-news.ru",
					votes: 7
				}],
				confirmed: ["mmorpg.ru", "steam.store", "xaker.ru", "hi-news.ru"],
				startDate: moment().toDate(),
				endDate: moment().add(3, "weeks").toDate()
			}];

			//api.voting.get({}, function(result) {
			//	if(result) {
			//		$scope.voting = result;
			//	}
			//	$scope.page.busy = false;
			//	$scope.page.offline = false;
			//});
		};

		$scope.init();
	});
