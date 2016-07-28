(function(){
  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['DashboardModel', '$state'];

  function DashboardController(DashboardModel, $state){
    var vm = this;
    vm.createProject = createProject;

    activate();

    function activate(){
      DashboardModel.getProjects()
        .then(function(projects){
          vm.projects = projects;
        });
    }

    function createProject(){
      DashboardModel.createProject(vm.uploadForm.title)
        .then(function(projectId){
          $state.go('project', {id: projectId});
        });
    }
  }
}());

