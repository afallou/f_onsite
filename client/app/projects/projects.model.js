(function(){
  angular
    .module('app')
    .factory('ProjectsModel', ProjectsModel);

  ProjectsModel.$inject = ['ApiURL', '$http'];

  function ProjectsModel(ApiUrl, $http) {

    return {
      getProject: function (id) {
        return $http.get(ApiUrl + '/projects/' + id)
          .then(function(response){
            return response.data[0];
          })
          .catch(function(err){
            console.error(err);
          })
      }
    }
  }
}());