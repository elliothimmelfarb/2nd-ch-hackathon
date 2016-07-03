'use strict';

angular.module('myApp')


.controller('adminCtrl', function($scope, Person) {
  console.log('adminCtrl!');
  /*Person.getAll()
    .then(res =>{
      $scope.people = res.data;
      console.log("$scope.people:", $scope.people);
    })
    .catch(err =>{
      console.log("err: ", err);
    })*/

  $scope.createSchedule = (emails, weeks) => {
    //$scope.showUpdate =false;
    if (emails !== undefined && weeks != undefined) {
      $scope.showUpdate = true;
      console.log("create Schedule")
      console.log("input: ", emails);

      var emalList = emails.split('[,\\s]+');

      //remove whitespaces not working!
      emalList = emalList.filter(function(str) {
        return /\S/.test(str);
      });

      console.log("split emails", emalList);

      var sendObj = {
        emails: emalList,
        weeks: weeks
      };

      Person.newSchedule(sendObj)
        .then(res =>{
          $scope.events = res.data;
          console.log("res daata: ", res.data);
        })
        .catch(err => {
          console.log("error: ", err);
        });
    }
  }

});
