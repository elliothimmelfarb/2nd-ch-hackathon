'use strict';

const app = angular.module('myApp', ['ui.router'] );

app.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state('admin', {
      url: '/',
      templateUrl: '/html/admin.html',
      controller: 'adminCtrl'
    })
  $urlRouterProvider.otherwise('/');
});
