(function() {
  'use strict';
  angular.module('cognitive.experiment')
    .controller('DataInputController', DataInputController);

  function DataInputController (
    $scope, WhiteboardService, FileInputService,
    UserService, $location, $mdDialog, DataService) {

    var vm = this;

    vm.user = UserService.getCurrentUser();
    vm.experiment_id = $location.search()['id'];

    vm.createNode = function() {
      FileInputService.createNode(
        vm.user.id, vm.experiment_id,
        vm.user.token, file_name, file_body)
        .success(function (data, status, headers, config) {
        WhiteboardService.appendNode(data.id, FileInputService.definition)
        $mdDialog.cancel();
      });
    };

    $scope.uploadFile = function (event) {
      var file = event.target.files[0];
      $scope.file_name = file.name;
      var reader = new FileReader();
      reader.onload = function (event) {
        file_body = event.target.result;
        $scope.file_body = file_body
        parsed_file = $.csv.toArrays(file_body);
        $scope.parsed_file = parsed_file
      };
      reader.readAsText(file);
      file_name = file.name;
    }
  };

})();
