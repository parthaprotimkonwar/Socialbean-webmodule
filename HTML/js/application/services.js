var request = angular.module('http_request', [])
    .service('common', function ($http, AppConstants) {

        this.httpRequest = function (url, method, post_data) {
            if (method === AppConstants.GET) {
                return $http.get(url);
            }
            else {
                return $http({
                    url: url,
                    method: "POST",
                    data: post_data,
                    headers: {'Content-Type': 'application/json; charset=utf-8'}
                });
            }
        }
    });