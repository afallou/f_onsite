angular.module('app')
  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
      .state('app', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('project', {
        url: '/project/:id',
        templateUrl: 'app/projects/project.html',
        controller: 'ProjectsController'
      });
  });