var app = angular.module('MyApp', []);

app.controller('Controller', function ($scope) {
    
    $scope.params = {
        beta: 1,
        rf: 0.01,
        T: 2,
        sigma: 0.17,  // historic volatility of US market
        MRP: 0.06,
        S0: 1,
        numStocks: 5
    }

    // create a 121 x numStocks matrix of shocks
    function updateShocks() {
        $scope.epsilon = [];

        // for each stock
        for(var s=0; s<$scope.params.numStocks; s++) {

            // initialize with shock of zero in period 0
            stock_shocks = [0];

            // generate an array of 120 shocks (values of epsilon) ~ N(0,1)
            for(var t=1; t<=12*$scope.params.T; t++) {
                stock_shocks.push(d3.random.normal(0,1)())
            }
            $scope.epsilon.push(stock_shocks);
        }
    }

    updateShocks();

    function stockData(params, epsilon_array) {
        
        // initialize with a stock value of S0 in period 0
        var stock_values = [params.S0],
            sum = 0;
        for(var t=1; t<=12*params.T; t++) {
            sum += epsilon_array[t];
            stock_values.push(params.S0*Math.exp((params.t_coeff * t) + (params.sum_coeff * sum )));
        }
        return stock_values;
    }

    function generateData(params, shocks) {

        var rfcc = Math.log(1 + params.rf),
            MRPcc = Math.log(1 + params.MRP),
            betacc = [Math.log(1 + params.rf + (params.beta*params.MRP)) - rfcc ] / MRPcc;

        var stockValueParams = {
            t_coeff: (rfcc + betacc*MRPcc - 0.5*Math.pow(betacc*params.sigma,2))/12,
            sum_coeff: betacc * params.sigma * Math.pow(12,-0.5),
            S0: params.S0,
            T: params.T
        };
        
        var data_matrix = []
        for(var s=0; s<params.numStocks; s++) {
            data_matrix.push(stockData(stockValueParams, shocks[s]));
        };
        return data_matrix;
    }

    function valuesInPeriod(data_matrix,t) {
        return data_matrix.map(function(stock_values){return stock_values[t]}).sort('ascending');
    }

    function medianInPeriod(data_matrix,t) {
        return d3.median(valuesInPeriod(data_matrix,t));
    }

    $scope.median = function() {
        var median_array = [];
        for(var t=0; t<=12*$scope.params.T; t++) {
            median_array.push(medianInPeriod($scope.data,t));
        }
        return median_array;
    }

    function update() {
        $scope.params.beta = parseFloat($scope.params.beta);
        $scope.params.rf = parseFloat($scope.params.rf);
        $scope.params.T = parseInt($scope.params.T);
        $scope.params.sigma = parseFloat($scope.params.sigma);
        $scope.params.MRP = parseFloat($scope.params.MRP);
        updateShocks();
        $scope.data = generateData($scope.params, $scope.epsilon);
    }
    
    $scope.$watchCollection('params', update);

    update();
    
});