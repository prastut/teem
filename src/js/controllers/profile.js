'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/profile', {
        templateUrl: 'profile/index.html',
        controller: 'ProfileCtrl'
      });
  }])
  .controller('ProfileCtrl', ['$scope', 'SessionSvc', function ($scope, SessionSvc) {
    SessionSvc.loginRequired(function() {
      $scope.user = SessionSvc.users.current();
      $scope.rawAvatar = '';
      $scope.croppedAvatar = '';
      $scope.cropping = false;
      $scope.avatar = '';
      $scope.transparent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

      function handleFileSelect(evt) {
        $scope.cropping = true;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
          $scope.$apply(function($scope) {
            $scope.rawAvatar = evt.target.result;
          });
        };
        reader.readAsDataURL(file);
      }
      angular.element(document.querySelector('#avatar')).on('change', handleFileSelect);

      SessionSvc.getUserProfile(function(res) {
        if (res.data.avatarUrl) {
          $scope.$apply(function() {
            $scope.avatar = res.data.avatarUrl;
          });
        }
      });

      $scope.saveAvatar = function() {
        $scope.cropping = false;
        SessionSvc.updateUserProfile({avatarData: $scope.croppedAvatar}, function (res) {
          if (res.error) {
            return;
          }
          $scope.$apply(function() {
            $scope.avatar = res.data.avatarUrl;
          });
        });
      };

      $scope.deleteAvatar = function() {
        SessionSvc.updateUserProfile({avatarData: ''}, function(res) {
          if(res.error) {
            return;
          }
          $scope.$apply(function() {
            $scope.rawAvatar = '';
            $scope.croppedAvatar = '';
            $scope.avatar = '';
          });
        });
      };
    });
  }]);
