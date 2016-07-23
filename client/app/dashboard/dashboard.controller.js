(function(){
  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['DashboardModel'];

  function DashboardController(DashboardModel){
    var vm = this;
    vm.uploadProject = uploadProject;

    activate();

    function activate(){
      DashboardModel.getProjects()
        .then(function(projects){
          vm.projects = projects;
        });
    }

    function uploadProject(){
      DashboardModel.uploadProject(vm.uploadForm.files, vm.uploadForm.title)
    }
  }
}());

