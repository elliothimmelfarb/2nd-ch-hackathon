'use strict';

angular.module('myApp')

.service('Person', function($http, $q){

  this.newSchedule = (emailList, weeks) =>{
    return $http.post(`/api/users`, emailList, weeks)
      .then(res => {
        return $q.resolve(res.data);
      })
      .catch(err => {   
        console.log('err:', err);
      })
    };

});