var app = angular.module('bookmarkapp', []);

app.controller('AppCtrl', ['$scope', function ($scope) {
    $scope.userData = [{
        'type': 'url',
        'url': 'www.google.com',
        'name': 'Google'
    }, {
        'type': 'book',
        'isbn': '12312313',
        'name': 'Googling Security'
    }, {
        'type': 'dvd',
        'name': 'The Godfather'
    }];
    
    $scope.user = 'User 1';
}]);
