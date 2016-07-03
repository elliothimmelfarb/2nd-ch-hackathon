'use strict';

angular.module('myApp')

.service('Person', function($http, $q) {

  this.newSchedule = (bodyObj) => $http.post(`/api/schedules`, bodyObj)
      /*.then(res => {
        return $q.resolve(res.data);
      })
      .catch(err => {
        console.log('err:', err);
      })*/
});
