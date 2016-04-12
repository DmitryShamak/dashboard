angular.module("app")
    .factory("storeModal", function(ngDialog, $timeout, api) {
        var dialog = {};
        dialog.show = function(scope) {
            ngDialog.open({
                template: '/views/templates/storeModal.html',
                className: 'ngdialog-theme-default plagin-modal',
                controller: function($scope, pluginDetails) {
                    $scope.store = {
                        categories: [],
                        data: []
                    };

                    $scope.getStoreData = function() {
                        $scope.store.busy = true;
                        api.store.get({}, function(res) {
                            $scope.store.categories = res.categories;
                            $scope.store.data = res.data;

                            $scope.store.busy = false;
                            $scope.store.offline = false;

                            if(res.categories.length) {
                                defaultCategory = $scope.store.categories[0];
                                $scope.selectCategory(defaultCategory);
                            }
                        }, function(err) {
                            $scope.store.busy = false;
                            $scope.store.offline = true;
                        });
                    };
                    /*$scope.store.categories = [{
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
                     }];*/
                    var defaultCategory = null;
                    var selectedItem = null;

                    $scope.openPlugin = function(plugin) {
                        pluginDetails.show(plugin, scope)
                    };

                    $scope.selectCategory = function(category) {
                        if(!category) {
                            category = defaultCategory;
                        }
                        if(selectedItem) {
                            selectedItem.selected = false;
                        }

                        category.selected = true;
                        selectedItem = category;

                        $scope.store.filter = {
                            category: category.label
                        };
                    };

                    $scope.init = function() {
                        $scope.getStoreData();
                    };

                    $scope.init();
                }
            });
        };

        return dialog;
    });