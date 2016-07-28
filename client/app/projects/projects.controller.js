(function(){
  angular
    .module('app')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$stateParams', 'ProjectsModel'];

  function ProjectsController($stateParams, ProjectsModel){
    var vm = this;
    vm.uploadFiles = uploadFiles;
    activate();

    function activate(){
      vm.projectId = $stateParams.id;
      getProject();
    }

    function getProject(){
      ProjectsModel.getProject(vm.projectId)
        .then(function(project){
          vm.project = project;
        });
    }

    function uploadFiles(){
      ProjectsModel.uploadFiles(vm.uploadForm.files, vm.projectId)
        .then(function(){
          getProject();
        })
    }
  }
}());

