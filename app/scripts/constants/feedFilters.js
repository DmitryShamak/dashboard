angular.module('app')
    .constant('dateRanges', [{
        label: "today",
        value: "day"
    }, {
        label: "this week",
        value: "week"
    }, {
        label: "this month",
        value: "month"
    }, {
        label: "this year",
        value: "year"
    }])
    .constant('feedStatuses', [{
        label: "all",
        value: null
    }, {
        label: "unread",
        value: "unread"
    }, {
        label: "visited",
        value: "visited"
    }]);