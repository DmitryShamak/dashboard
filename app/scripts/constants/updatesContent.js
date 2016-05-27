angular.module('app')
    .constant('updatesContent', [{
        title: "update",
        version: 0.1,
        subtitle: "23.05.2016",
        text: "this_is_the_list_of_last_update_changes",
        items: [{
           label: "added_voting_page"
        }, {
            label: "refresh_button_will_be_shown_if_new_available_added_feeds"
        }, {
            label: "added_new_portals"
        }, {
            label: "show_system_updates"
        }]
    }]);