/**
 * Created by pkonwar on 1/15/2017.
 */
myApp.controller('dashboardController', ['$scope', '$http', function ($scope, $http) {

    $scope.name = "partha";

    $(document).ready(function() {

        // set up our data series with 50 random data points

        var seriesData = [[], [], []];
        var random = new Rickshaw.Fixtures.RandomData(20);

        for (var i = 0; i < 110; i++) {
            random.addData(seriesData);
        }

        // instantiate our graph!

        var graph = new Rickshaw.Graph({
            element: document.getElementById("todaysales"),
            renderer: 'bar',
            series: [
                {
                    color: "#33577B",
                    data: seriesData[0],
                    name: 'Photodune'
                }, {
                    color: "#77BBFF",
                    data: seriesData[1],
                    name: 'Themeforest'
                }, {
                    color: "#C1E0FF",
                    data: seriesData[2],
                    name: 'Codecanyon'
                }
            ]
        });

        graph.render();

        var hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph,
            formatter: function (series, x, y) {
                var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
                var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
                return content;
            }
        });
    });

}]);

