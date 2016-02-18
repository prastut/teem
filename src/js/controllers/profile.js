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
  .controller('ProfileCtrl', ['$scope', 'SessionSvc', '$timeout', function ($scope, SessionSvc, $timeout) {
    SessionSvc.loginRequired(function() {
      $scope.user = SessionSvc.users.current();
      $scope.rawAvatar = '';
      $scope.croppedAvatar = '';
      $scope.cropping = false;
      $scope.avatar = '';

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

      // TODO This timeout shouldn't be necessary!
      $timeout(function() {
        SessionSvc.getUserProfile(function(res) {
          if (res.data.avatar_url) {
            $scope.$apply(function() {
              $scope.avatar = 'http://localhost:9898' + res.data.avatar_url;
            });
          }
        });
      }, 1000);

      $scope.saveAvatar = function() {
        $scope.cropping = false;
        SessionSvc.updateUserProfile({avatar_data: $scope.croppedAvatar}, function (res) {
          if (res.error) {
            return;
          }
          $scope.$apply(function() {
            $scope.avatar = 'http://localhost:9898' + res.data.avatar_url;
          });
        });
      };

      $scope.deleteAvatar = function() {
        SessionSvc.updateUserProfile({avatar_data: false}, function(res) {
          if(res.error) {
            return;
          }
          $scope.rawAvatar = '';
          $scope.croppedAvatar = '';
          $scope.avatar = '';
        });
      };
    });
  }]);
