angular
	.module('hive', [])
	.factory('hive', ['$rootScope', '$http', function ($rootScope, $http) {
		return {
			api: function () {
				var hive = new Hive();
				hive.handleErrors = function (errors) {
					errors.forEach(function (error) {
						var message = getMessage(error);
						if (message !== null) {
							$rootScope.alert.showMessage(message, 'danger');
						}
					});
					function getMessage(error) {
						switch (error) {
							case Hive.ERROR.SERVER_ERROR:
							    return 'There was a problem processing your request.';
							case Hive.ERROR.UNKNOWN_APPLICATION:
							    return 'That application doesn\'t exist.';
							case Hive.ERROR.UNKNOWN_USER:
							    return 'That user doesn\'t exist.';
							case Hive.ERROR.WRONG_PASSWORD:
							    return 'That isn\'t the correct password.';
							case Hive.ERROR.USER_EXISTS:
							    return 'That user already exists.';
							case Hive.ERROR.INVALID_USERNAME:
							    return 'That isn\'t a valid username.';
							case Hive.ERROR.INVALID_PASSWORD:
							    return 'That isn\'t a valid password.';
							case Hive.ERROR.INVALID_EMAIL:
							    return 'That isn\'t a valid e-mail.';
							case Hive.ERROR.INVALID_DATA_KEY:
							    return 'That isn\'t a valid key.';
							case Hive.ERROR.PERMISSION_DENIED:
							    return 'You don\'t have permission to access that resource.';
							case Hive.ERROR.UNKNOWN_ADMINISTRATOR:
							    return 'That account doesn\'t exist.';
							case Hive.ERROR.ADMINISTRATOR_EXISTS:
							    return 'That account already exists.';
							case Hive.ERROR.APPLICATION_EXISTS:
							    return 'That application already exists.';
							case Hive.ERROR.INVALID_APPLICATION_NAME:
							    return 'That isn\'t a valid application name.';
							case Hive.ERROR.NOT_YET_CONFIRMED:
							    return 'This account has not yet been confirmed.';
							case Hive.ERROR.WRONG_CONFIRMATION_CODE:
							    return 'That isn\'t the correct confirmation code.';
							case Hive.ERROR.WRONG_RESET_PASSWORD_CODE:
							    return 'That isn\'t the correct password reset code.';
							default:
							    return null;
    					}
					}
				};
				hive.makeHttpRequest = function (method, url, data, authorization, callbacks) {
					var config = {
						method: method,
						url: url,
						headers: {}
					};
					var formData = null;
					for (var key in data) {
						if (formData === null) {
							formData = '';
						} else {
							formData += '&';
						}
						formData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
					}
					if (formData !== null) {
						config.data = formData;
						config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
					}
					if (authorization !== null) {
						config.headers['Authorization'] = authorization;
					}
					$http(config)
						.success(function (data) {
				            if (typeof(data.errors) !== 'undefined') {
				                callbacks.error(data.errors);
				            } else {
				                callbacks.success(data.data);
				            }
						})
						.error(function (data, status) {
							callbacks.error([status]);
						});
				};
				if ($rootScope.login !== null) {
					hive.selectAdministrator($rootScope.login.username, $rootScope.login.password);
				}
				return hive;
			}
		};
	}]);