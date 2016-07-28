(function(){
  angular
    .module('app')
    .factory('ProjectsModel', ProjectsModel);

  ProjectsModel.$inject = ['Upload', 'ApiURL', '$http'];

  function ProjectsModel(Upload, ApiUrl, $http) {

    return {
      getProject: function (id) {
        return $http.get(ApiUrl + '/projects/' + id)
          .then(function(response){
            return response.data[0];
          })
          .catch(function(err){
            console.error(err);
          })
      },

      uploadFiles: function (files, projectId) {
      Upload.upload({
        url: ApiUrl + '/projects/' + projectId,
        data: {file: files},
        method: 'PUT'
      });
    }
    }
  }
}());