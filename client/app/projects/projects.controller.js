(function(){
  angular
    .module('app')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['Upload', 'ApiURL'];

  function ProjectsController(Upload, ApiUrl){
    var vm = this;
    vm.uploadProject = uploadProject;

    activate();

    function activate(){
      vm.inner = 'bloh';
    }

    function uploadProject(){
      console.log('ok');
      Upload.upload({
        url: ApiUrl + '/projects',
        data: {file: vm.uploadForm.files, title: vm.uploadForm.title}
      });
    }
  }
}());

