(function(){
  angular
    .module('app')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['ProjectsModel'];

  function ProjectsController(ProjectsModel){
    var vm = this;
    vm.uploadProject = uploadProject;

    activate();

    function activate(){
      ProjectsModel.getProjects()
        .then(function(projects){
          vm.projects = projects;
        });
    }

    function uploadProject(){
      ProjectsModel.uploadProject(vm.uploadForm.files, vm.uploadForm.title)
    }
  }
}());

