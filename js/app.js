angular
	.module('hivePanelApp', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'ui.bootstrap.showErrors', 'match', 'alert', 'hive', 'controller'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/', {
				template: '',
				controller: 'IndexController'
			})
			.when('/login', {
				templateUrl: 'html/login.html',
				controller: 'LoginController'
			})
			.when('/forgot-password', {
				templateUrl: 'html/forgot-password.html',
				controller: 'ForgotPasswordController'
			})
			.when('/administrators/:username/reset-password', {
				templateUrl: 'html/reset-password.html',
				controller: 'ResetPasswordController'
			})
			.when('/sign-up', {
				templateUrl: 'html/sign-up.html',
				controller: 'SignUpController'
			})
			.when('/administrators/:username/confirm', {
				templateUrl: 'html/confirm.html',
				controller: 'ConfirmController'
			})
			.when('/home', {
				templateUrl: 'html/home.html',
				controller: 'HomeController'
			})
			.when('/administrator', {
				templateUrl: 'html/administrator.html',
				controller: 'AdministratorController'
			})
            .when('/change-password', {
                templateUrl: 'html/change-password.html',
                controller: 'ChangePasswordController'
            })
			.when('/close-account', {
				templateUrl: 'html/close-account.html',
				controller: 'CloseAccountController'
			})
			.when('/add-application', {
				templateUrl: 'html/add-application.html',
				controller: 'AddApplicationController'
			})
			.when('/applications/:applicationName', {
				templateUrl: 'html/application.html',
				controller: 'ApplicationController'
			})
			.when('/applications/:applicationName/add-user', {
				templateUrl: 'html/add-user.html',
				controller: 'AddUserController'
			})
			.when('/applications/:applicationName/update', {
				templateUrl: 'html/update-application.html',
				controller: 'UpdateApplicationController'
			})
			.when('/applications/:applicationName/remove', {
				templateUrl: 'html/remove-application.html',
				controller: 'RemoveApplicationController'
			})
			.when('/applications/:applicationName/users/:username', {
				templateUrl: 'html/user.html',
				controller: 'UserController'
			})
			.when('/applications/:applicationName/users/:username/update', {
				templateUrl: 'html/update-user.html',
				controller: 'UpdateUserController'
			})
			.when('/applications/:applicationName/users/:username/change-password', {
				templateUrl: 'html/change-user-password.html',
				controller: 'ChangeUserPasswordController'
			})
			.when('/applications/:applicationName/users/:username/remove', {
				templateUrl: 'html/remove-user.html',
				controller: 'RemoveUserController'
			})
			.when('/applications/:applicationName/users/:username/add-data', {
				templateUrl: 'html/add-data.html',
				controller: 'AddDataController'
			})
			.when('/applications/:applicationName/users/:username/data/:key', {
				templateUrl: 'html/data.html',
				controller: 'DataController'
			})
			.when('/applications/:applicationName/users/:username/data/:key/remove', {
				templateUrl: 'html/remove-data.html',
				controller: 'RemoveDataController'
			})
			.when('/applications/:applicationName/users/:username/reset-password', {
				templateUrl: 'html/reset-user-password.html',
				controller: 'ResetUserPasswordController'
			})
			.otherwise({
				redirectTo: '/'
			});
	}])
	.run(['$rootScope', '$location', 'alert', function ($rootScope, $location, alert) {
		$rootScope.alert = alert;
		var login = sessionStorage.getItem('login');
		if (login !== null) {
			$rootScope.login = JSON.parse(login);
		} else {
			$rootScope.login = null;
		}
		$rootScope.$on('$locationChangeSuccess', function () {
			if ($rootScope.login !== null) {
				return;
			}
			var PUBLIC_PATHS = [
				/^\/$/,
				/^\/login/,
				/^\/forgot-password/,
				/^\/administrators\/[^\/]+\/reset-password/,
				/^\/sign-up/,
				/^\/administrators\/[^\/]+\/confirm/,
				/^\/applications\/[^\/]+\/users\/[^\/]+\/reset-password/
			];
			if (!PUBLIC_PATHS.some(function (path) {
					return path.test($location.path());
				})) {
				$location.path('/');
			}
		});
	}]);