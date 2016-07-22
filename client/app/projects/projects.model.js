(function(){
  angular
    .module('app')
    .factory('ProjectsModel', ProjectsModel);

  ProjectsModel.$inject = ['Upload', 'ApiURL', '$http'];

  function ProjectsModel(Upload, ApiUrl, $http) {

    return {
      getProjects: function () {
        return $http.get(ApiUrl + '/projects')
          .then(function(response){
            return response.data;
          })
          .catch(function(err){
            console.error(err);
          })
      },

      uploadProject: function (files, title) {
        Upload.upload({
          url: ApiUrl + '/projects',
          data: {file: files, title: title}
        });
      }
    }
  }
}());