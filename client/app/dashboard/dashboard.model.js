(function(){
  angular
    .module('app')
    .factory('DashboardModel', DashboardModel);

  DashboardModel.$inject = ['Upload', 'ApiURL', '$http'];

  function DashboardModel(Upload, ApiUrl, $http) {

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

      createProject: function(title){
        return $http.post(ApiUrl + '/projects', {title: title})
          .then(function(res){
            return res.data.id;
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