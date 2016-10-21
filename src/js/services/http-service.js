(function () {
    'use strict';

    angular.module('public-transportation-app')
    .factory('httpService', ['$q', '$http', mainFunction]);

    function mainFunction($q, $http) {
        return {
            GetData: fetchData,
            PostData: postData
        }

        function fetchData(url) {
            return $http({
                method: 'GET',
                url: url
            })
                .then(sendResponseData)
                .catch(sendError);
        }

        function postData(url, data) {
            return $http({
                method: 'POST',
                url: url,
                data: JSON.stringify(data)
            })
                .then(sendResponseData)
                .catch(sendError);
        }

        function sendResponseData(response) {
            return response.data
        }

        function sendError(response) {
            return $q.reject('Error retrieving data. (HTTP status: ' + response.status + ')');
        }
    }
}());