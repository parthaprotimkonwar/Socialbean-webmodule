myApp.service('common', function ($http, CONSTANTS, $window) {

    this.httpRequest = function (url, getOrPost, postData) {
        if (getOrPost === CONSTANTS.GET) {
            return $http.get(url);
        }
        else {
            return $http({
                url: url,
                method: "POST",
                data: postData,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });
        }
    }
});


loginAppModule.service('common', function ($http, CONSTANTS, $window) {

    this.httpRequest = function (url, method, post_data) {
        if (method === CONSTANTS.GET) {
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