angular.module("app")
	.controller("VotingCtrl", function($rootScope, $scope, api, $timeout) {
		$scope.page = {};

		$scope.createVoting = function() {
			var data = {
				title: "which portal add next?",
				items: [],
				startDate: moment().toDate,
				endDate: moment().endOf("month").toDate,

				offer: {
					title: "offer_new_portal",
					placeholder: "portal_name_or_link"
				}
			};

			api.voting.save({
				data: data
			}, function(result) {
				console.info("voting added", result);
			});
		};

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
		$scope.addVote = function(vote, params) {
			if(!params.text) {
				return;
			}
			//add vote item
			//add vote with current user
			//clear form input
			//update changes
			vote.offer.pending = true;
			api.vote.save({
				data: {
					author: $scope.getUserId(),
					voting: vote._id,
					label: params.text
				}
			}, function() {
				vote.offer.pending = false;

				vote.showSubmitMessage = true;
				vote.offerForm.text = null;

				$timeout(function() {
					vote.showSubmitMessage = false;
				}, 4000);
			});


		};

		$scope.doVote = function(voting, vote) {
			vote.pending = true;

			api.vote.update({
				query: {
					_id: vote._id
				},
				data: $scope.getUserId()
			}, function(result) {
				vote.votes = result.votes;
				$scope.formatVoting(voting);
				vote.pending = false;
			}, function(err) {
				vote.pending = false;
			});
		};

		$scope.formatVoting = function(voting) {
			voting.total = 0;
			_.forEach(voting.items, function(item, index) {
				item.value = item.votes.length;
				voting.total += item.value;

				if(~_.indexOf(item.votes, $scope.getUserId())) {
					item.voted = true;
				} else {
					item.voted = false;
				}
			});
		};

		$scope.toggleVoting = function(voting) {
			voting.show = !voting.show;

			if(voting.show) {
				$scope.openVoting(voting);
			}
		};

		$scope.openVoting = function(voting) {
			voting.pending = true;

			api.vote.get({
				voting: voting._id
			}, function(result) {
				if(!result.data) {
					return voting.pending = false;
				}

				voting.items = result.data;
				$scope.formatVoting(voting);

				voting.show = true;
				voting.pending = false;
			});
		};

		$scope.init = function() {
			$scope.page.busy = true;
			$scope.page.offline = false;

			api.voting.get({}, function(result) {
				if(result.data) {
					$scope.votings = result.data;
					$scope.page.busy = false;
					$scope.page.offline = false;
				} else {
					$scope.votings = [];
					$scope.page.busy = false;
					$scope.page.offline = false;
				}
			});
		};

		if($scope.user) {
			return $scope.init();
		}
		$scope.$on('userConnect', function (event, data) {
			$scope.init();
		});
	});
