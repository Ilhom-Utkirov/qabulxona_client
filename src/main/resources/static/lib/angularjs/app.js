

var app = angular.module('demoApp', ['fuelux.wizard']);

app.controller('WizardController', ['$scope','$http', function($scope, $http){
  $scope.requests = [];
  $scope.stepCurrent = 0;
  $scope.onlyNumbers = /^\d+$/;

  $scope.log = function(event){
    console.log(event);
    //if(event.direction=='next') return true;
  }
  $scope.myfunc = function(myAcc) {
    var intValue = parseInt(myAcc);

    if(intValue <= 0) {
      return true;
    } else {
      return false;
    }
  }
  $scope.accountInvalid = function() {
    if($scope.submitted && $scope.account.$invalid) {
      accountInvalid = true;
    } else {
      accountInvalid = false;
    }
  }

  $scope.$watch('stepCurrent', function(stepValue) {
      console.log("stepCurrent updated  ", stepValue, $scope.stepCurrent);
  });
}]);
