'use strict';

describe('SessionCtrl', function() {

  // load the controller's module
  // We need to override the async translateProvider
  // http://angular-translate.github.io/docs/#/guide/22_unit-testing-with-angular-translate
  beforeEach(module('Teem', function ($provide, $translateProvider) {
    $provide.factory('customLoader', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('customLoader');
  }));

  var SessionCtrl,
      SessionSvc,
      $controller,
      $route,
      $rootScope,
      scope,
      $timeout,
      swellRT,
      nick = 'testingnick',
      password = 'testingpassword',
      email = 'testing@local.net';


  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, _$route_, _$rootScope_, _$timeout_, _swellRT_, _SessionSvc_) {
    $controller = _$controller_;
    $route = _$route_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    swellRT = _swellRT_;
    SessionSvc = _SessionSvc_;
  }));

  describe('when logging in', function() {
    beforeEach(function() {
      $route.current = {
        params: {
          form: 'login'
        }
      };
    });

    describe('and SwellRT will send the ok', function() {
      var calledNick, calledPassword;

      beforeEach(function() {
        spyOn(SwellRT, 'startSession').
        and.callFake(function(domain, nick, password, success) {
          calledNick = nick;
          calledPassword = password;

          __session.address = nick + '@' + __session.domain;

          success();
        });

        scope = $rootScope.$new();

        SessionCtrl = $controller('SessionCtrl', {
          $route: $route,
          $scope: scope
        });

        scope.form.login.values = {
          nick: nick,
          password: password
        };

        scope.form.login.submit();

        $timeout.flush();
      });

      it('should call SwellRT', function() {
        expect(SwellRT.startSession).
        toHaveBeenCalled();
      });

      it('should pass the right credentials', function() {
        expect(calledNick).toBe(nick);
        expect(calledPassword).toBe(password);
      });

      it('should set current user', function() {
        expect(SessionSvc.users.current()).toBe(nick + '@' + __session.domain);
      });
    });

    describe('and SwellRT will send an error', function() {
      beforeEach(function() {
        spyOn(SwellRT, 'startSession').
        and.callFake(function(domain, nick, password, success, error) {
          error();
        });
      });

      it('should show the error', function() {
        // TODO
      });
    });
  });

  describe('when registering', function() {
    beforeEach(function() {
      $route.current = {
        params: {
          form: 'register'
        }
      };
    });

    describe('and SwellRT will send the ok', function() {
      var calledNick, calledPassword;

      beforeEach(function() {
        spyOn(SwellRT, 'registerUser').
        and.callFake(function(domain, nick, password, success) {
          calledNick = nick;
          calledPassword = password;

          success();
        });

        // TODO email
        // TODO calling also to sessionStart?

        scope = $rootScope.$new();

        SessionCtrl = $controller('SessionCtrl', {
          $route: $route,
          $scope: scope
        });

        scope.form.login.values = {
          nick: nick,
          password: password,
          password_repeat: password,
          email: email
        };

        scope.form.login.submit();

        $timeout.flush();
      });

      it('should call SwellRT', function() {
        expect(SwellRT.registerUser).
        toHaveBeenCalled();
      });

      it('should pass the right credentials', function() {
        expect(calledNick).toBe(nick);
        expect(calledPassword).toBe(password);
      });

      /* TODO sessionStart also?
      it('should set current user', function() {
        expect(SessionSvc.users.current()).toBe(nick + '@' + __session.domain);
      });
      */
    });

    describe('and SwellRT will send an error', function() {
      beforeEach(function() {
        spyOn(SwellRT, 'startSession').
        and.callFake(function(domain, nick, password, success, error) {
          error();
        });
      });

      it('should show the error', function() {
        // TODO
      });
    });
  });

  describe('when forgot password', function() {
    beforeEach(function() {
      $route.current = {
        params: {
          form: 'forgotten_password'
        }
      };
    });
  });

  describe('when recovering password', function() {
    beforeEach(function() {
      $route.current = {
        params: {
          form: 'recover_password'
        }
      };
    });
  });
});
