angular.module("app")
    .factory("storeModal", function(ngDialog, $timeout, api) {
        var dialog = {};
        dialog.show = function(scope) {
            ngDialog.open({
                template: '/views/templates/storeModal.html',
                className: 'ngdialog-theme-default store-modal',
                controller: function($scope, providerDetails) {
                    $scope.store = {
                        categories: [],
                        data: []
                    };

                    $scope.getStoreData = function() {
                        $scope.store.busy = true;
                        api.store.get({}, function(res) {
                            $scope.store.categories = res.categories;
                            $scope.store.data = res.data;

                            //check owned providers
                            _.forEach($scope.user.providers, function(id) {
                                var provider = _.find($scope.store.data, {_id: id});

                                if(provider) {
                                    provider.owned = true;
                                }
                            });

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

                    var defaultCategory = null;
                    var selectedItem = null;

                    $scope.openProvider = function(provider) {
                        providerDetails.show(provider, scope)
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