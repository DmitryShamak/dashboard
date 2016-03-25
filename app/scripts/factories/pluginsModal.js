angular.module("app")
	.factory("pluginsModal", function(ngDialog, $timeout, api) {
		var dialog = {};
		dialog.show = function(scope) {
			ngDialog.open({ 
				template: '/views/templates/pluginsModal.html',
				className: 'ngdialog-theme-default plagin-modal',
				controller: function($scope, pluginDetails) {
					$scope.plugings = {};
					$scope.plugings.categories = [{
						header: "Featured",
						items: [{
							label: "Top plugins"
						}, {
							label: "New & Noteworthy"
						}, {
							label: "Free"
						}]
					}, {
						header: "Categories",
						items: [{
							label: "News"
						}, {
							label: "Messages"
						}, {
							label: "Weather"
						}, {
							label: "Economic"
						}]
					}];
					var defaultCategory = $scope.plugings.categories[0].items[0];
					var selectedItem = null;

					$scope.openPlugin = pluginDetails.show;

					$scope.selectCategory = function(category) {
						if(!category) {
							category = defaultCategory;
						}
						if(selectedItem) {
							selectedItem.selected = false;
						}

						category.selected = true;
						selectedItem = category;

						$scope.getPluginData(category.label);
					};

					$scope.faker = function(data, callback) {
						var data = [{
							image: "https://s-media-cache-ak0.pinimg.com/564x/63/cd/6d/63cd6d5eb159386532d2a915219dabb3.jpg",
							label: "Hat",
							description: "Save your head from pain!",
							link: ""
						}, {
							image: "https://s-media-cache-ak0.pinimg.com/564x/99/05/46/990546d79e5fffcaf979f06e8eff7bc0.jpg",
							label: "Turtle",
							description: "Slow, but awesome",
							link: ""
						}, {
							image: "https://s-media-cache-ak0.pinimg.com/564x/66/3e/f0/663ef03ba1f1a965401a445f64aaadd5.jpg",
							label: "Creep",
							description: "Eat`s all your trash..",
							link: ""
						}, {
							image: "https://s-media-cache-ak0.pinimg.com/564x/ef/25/a9/ef25a9c53bf67a63127dbc1fe0536fd7.jpg",
							label: "Oldman",
							description: "Old, but know a lot",
							link: ""

						}, {
							image: "https://s-media-cache-ak0.pinimg.com/564x/47/47/7a/47477a56c10f299139ec992d529df9cd.jpg",
							label: "Tree",
							description: "Makes your data structured",
							link: ""
						}];
						var delay = Math.round(Math.random()*2000);

						$scope.plugings.content.timer = $timeout(function() {
							callback(null, data);
						}, delay);
					};

					$scope.getPluginData = function(category) {
						//TODO: get data from server
						if($scope.plugings.content && $scope.plugings.content.timer) {
							$timeout.cancel($scope.plugings.content.timer);
						}
						$scope.plugings.content = null;
						//fade in animation
						$timeout(function() {
							$scope.plugings.content = {
								category: category,
								data: null,
								pending: true,
								timer: null
							};

							$scope.faker({
								category: $scope.plugings.content.category
							}, function(err, data) {
								if(data) {
									$scope.plugings.content.data = data;
								}
								$scope.plugings.content.pending = false;
							});
						}, 100);
					};

					$scope.onConfirm = function(plugin) {
						//get plugins list
						ngDialog.close();
					};
					$scope.onCancel = function() {
						ngDialog.close();
					};

					$scope.init = function() {
						$scope.selectCategory(defaultCategory);
					};

					$scope.init();
				} 
			});
		};

		return dialog;
	});