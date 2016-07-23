angular.module('app')
  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/projects');

    $stateProvider
      .state('app', {
        url: '/projects',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('project', {
        url: '/projects/:id',
        templateUrl: 'app/projects/project.html',
        controller: 'ProjectsController',
        controllerAs: 'vm'
      });
  });