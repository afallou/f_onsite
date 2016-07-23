(function(){
  angular
    .module('app')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$stateParams', 'ProjectsModel'];

  function ProjectsController($stateParams, ProjectsModel){
    var vm = this;
    activate();

    function activate(){
      vm.projectId = $stateParams.id;

      ProjectsModel.getProject(vm.projectId)
        .then(function(project){
          vm.project = project;
        });
    }
  }
}());

