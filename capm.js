var app = angular.module('MyApp', []);

app.controller('Controller', function ($scope) {
    
    $scope.params = {
        beta: 1,
        rf: 0.01,
        T: 10,
        sigma: 0.17,  // historic volatility of US market
        MRP: 0.06,
        S0: 1
    }

    function update() {
        console.log('update called');
        var t_coeff = $scope.params.rf + $scope.params.beta*$scope.params.MRP - 0.5*Math.pow($scope.params.beta*$scope.params.sigma,2),
            data_array = [],
            sum = 0,
            s;
        for(var t=0; t<12*$scope.params.T; t++) {
            // Generate a normally distributed number by adding three U~[0,1] together
            var e = (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1),
                rf = $scope.params.rf,
                betaMRP = $scope.params.beta * $scope.params.MRP;
            sum += e;
            sqrt_t_coeff = $scope.params.beta * $scope.params.sigma * sum;
            s = $scope.params.S0*Math.exp(t_coeff * (t+1) / 12 + (sqrt_t_coeff * Math.pow(12,-0.5)));
            data_array.push({e: e, sum: sum, s:s, t_coeff: t_coeff, sqrt_t_coeff: sqrt_t_coeff});
        }
        $scope.data = data_array;
    }
    
    $scope.$watchCollection('params', update);
    
    update();
    
});