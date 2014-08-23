angular
	.module('controller', [])
	.controller('MainController', ['$rootScope', '$location', function ($rootScope, $location) {
		$rootScope.logOut = function () {
			$rootScope.login = null;
			sessionStorage.removeItem('login');
			$location.path('/');
		};
	}])
	.controller('IndexController', ['$scope', '$location', function ($scope, $location) {
		if ($scope.login === null) {
			$location.path('/login');
		} else {
			$location.path('/home');
		}
	}])
	.controller('LoginController', ['$rootScope', '$scope', '$location', 'hive', function ($rootScope, $scope, $location, hive) {
		$scope.username = '';
		$scope.password = '';
		$scope.logIn = function () {
			$scope.form.username.$setValidity('unknown', true);
			$scope.form.username.$setValidity('unconfirmed', true);
			$scope.form.password.$setValidity('wrong', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.selectAdministrator($scope.username, $scope.password)
				.getAdministrator()
				.success(function (administrator) {
					$rootScope.login = {
						username: $scope.username,
						password: $scope.password
					};
					sessionStorage.setItem('login', JSON.stringify($rootScope.login));
					$location.path('/');
				})
				.error(function (errors) {
					$scope.form.username.$setValidity('unknown', errors.indexOf(Hive.ERROR.UNKNOWN_ADMINISTRATOR) == -1);
					$scope.form.username.$setValidity('unconfirmed', errors.indexOf(Hive.ERROR.NOT_YET_CONFIRMED) == -1);
					$scope.form.password.$setValidity('wrong', errors.indexOf(Hive.ERROR.WRONG_PASSWORD) == -1);
				});
		};
	}])
	.controller('ForgotPasswordController', ['$scope', '$location', 'hive', function ($scope, $location, hive) {
		$scope.username = '';
		$scope.requestReset = function () {
			$scope.form.username.$setValidity('unknown', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.requestResetAdministratorPassword($scope.username)
				.success(function (data) {
					$scope.alert.queueMessage('You\'ll be receiving an e-mail shortly with instructions on how to reset your password.');
					$location.path('/login');
				})
				.error(function (errors) {
					$scope.form.username.$setValidity('unknown', errors.indexOf(Hive.ERROR.UNKNOWN_ADMINISTRATOR) == -1);
				});
		};
	}])
	.controller('ResetPasswordController', ['$scope', '$routeParams', 'hive', function ($scope, $routeParams, hive) {
		$scope.status = null;
		hive.api()
			.resetAdministratorPassword($routeParams.username, $routeParams.code)
			.success(function (data) {
				$scope.password = data;
				$scope.status = 'success';
			})
			.error(function (errors) {
				$scope.status = 'error';
			});
	}])
	.controller('SignUpController', ['$scope', '$location', 'hive', function ($scope, $location, hive) {
		$scope.administrator = {
			username: '',
			password: '',
			email: ''
		};
		$scope.register = function () {
			$scope.form.username.$setValidity('taken', true);
			$scope.form.email.$setValidity('email', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.addAdministrator($scope.administrator)
				.success(function (data) {
					$scope.alert.queueMessage('You\'ll be receiving an e-mail shortly to confirm your account. Once confirmed, you\'ll be able to start using Hive.');
					$location.path('/login');
				})
				.error(function (errors) {
					$scope.form.username.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_USERNAME) == -1);
					$scope.form.username.$setValidity('taken', errors.indexOf(Hive.ERROR.ADMINISTRATOR_EXISTS) == -1);
					$scope.form.password.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_PASSWORD) == -1);
					$scope.form.email.$setValidity('email', errors.indexOf(Hive.ERROR.INVALID_EMAIL) == -1);
				});
		};
	}])
	.controller('ConfirmController', ['$scope', '$routeParams', 'hive', function ($scope, $routeParams, hive) {
		$scope.status = null;
		hive.api()
			.confirmAdministrator($routeParams.username, $routeParams.code)
			.success(function (data) {
				$scope.password = data;
				$scope.status = 'success';
			})
			.error(function (errors) {
				$scope.status = 'error';
			});
	}])
	.controller('HomeController', ['$scope', '$location', 'hive', function ($scope, $location, hive) {
		$scope.applications = null;
		hive.api()
			.getApplications()
			.success(function (applications) {
				$scope.applications = applications;
			});
	}])
	.controller('AdministratorController', ['$scope', '$location', 'hive', function ($scope, $location, hive) {
		$scope.administrator = null;
		hive.api()
			.getAdministrator()
			.success(function (administrator) {
				$scope.administrator = administrator;
			});
		$scope.save = function () {
			$scope.form.username.$setValidity('taken', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.updateAdministrator({
                    username: $scope.administrator.username,
                    email: $scope.administrator.email
                })
				.success(function (data) {
					$scope.login.username = $scope.administrator.username;
					$location.path('/');
				})
				.error(function (errors) {
					$scope.form.username.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_USERNAME) == -1);
					$scope.form.username.$setValidity('taken', errors.indexOf(Hive.ERROR.ADMINISTRATOR_EXISTS) == -1);
					$scope.form.email.$setValidity('email', errors.indexOf(Hive.ERROR.INVALID_EMAIL) == -1);
				});
		};
	}])
    .controller('ChangePasswordController', ['$scope', '$location', 'hive', function ($scope, $location, hive) {
        $scope.administrator = {
            password: ''
        };
        $scope.save = function () {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.form.$invalid) {
                return;
            }
            hive.api()
                .updateAdministrator($scope.administrator)
                .success(function (data) {
                    $scope.login.password = $scope.administrator.password;
                    $location.path('/administrator');
                })
                .error(function (errors) {
                    $scope.form.password.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_PASSWORD) == -1);
                });
        };
    }])
	.controller('CloseAccountController', ['$scope', '$location', 'hive', function ($scope, $location, hive) {
		$scope.remove = function () {
			hive.api()
				.removeAdministrator()
				.success(function (data) {
					$scope.login = null;
					$location.path('/');
				});
		};
	}])
	.controller('AddApplicationController', ['$scope', '$location', 'hive', function ($scope, $location, hive) {
		$scope.application = {
			name: ''
		};
		$scope.addApplication = function () {
			$scope.form.name.$setValidity('taken', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.addApplication($scope.application)
				.success(function (data) {
					$location.path('/');
				})
				.error(function (errors) {
					$scope.form.name.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_APPLICATION_NAME) == -1);
					$scope.form.name.$setValidity('taken', errors.indexOf(Hive.ERROR.APPLICATION_EXISTS) == -1);
				});
		};
	}])
	.controller('ApplicationController', ['$scope', '$routeParams', 'hive', function ($scope, $routeParams, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.users = null;
		hive.api()
			.selectApplication($scope.applicationName)
			.getUsers()
			.success(function (users) {
				$scope.users = users;
			});
	}])
	.controller('AddUserController', ['$scope', '$routeParams', '$location', 'hive', function ($scope, $routeParams, $location, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.user = {
			username: '',
			password: '',
			email: ''
		};
		$scope.addUser = function () {
			$scope.form.username.$setValidity('taken', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.selectApplication($scope.applicationName)
				.addUser($scope.user)
				.success(function (data) {
					$location.path('/applications/' + encodeURIComponent($scope.applicationName));
				})
				.error(function (errors) {
					$scope.form.username.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_USERNAME) == -1);
					$scope.form.username.$setValidity('taken', errors.indexOf(Hive.ERROR.USER_EXISTS) == -1);
					$scope.form.password.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_PASSWORD) == -1);
					$scope.form.email.$setValidity('email', errors.indexOf(Hive.ERROR.INVALID_EMAIL) == -1);
				});
		};
	}])
	.controller('UpdateApplicationController', ['$scope', '$routeParams', '$location', 'hive', function ($scope, $routeParams, $location, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.application = null;
		hive.api()
			.selectApplication($scope.applicationName)
			.getApplication()
			.success(function (application) {
				$scope.application = application;
			});
		$scope.save = function () {
			$scope.form.name.$setValidity('taken', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.selectApplication($scope.applicationName)
				.updateApplication($scope.application)
				.success(function (data) {
					$location.path('/applications/' + encodeURIComponent($scope.application.name));
				})
				.error(function (errors) {
					$scope.form.name.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_APPLICATION_NAME) == -1);
					$scope.form.name.$setValidity('taken', errors.indexOf(Hive.ERROR.APPLICATION_EXISTS) == -1);
				});
		};
	}])
	.controller('RemoveApplicationController', ['$scope', '$routeParams', '$location', 'hive', function ($scope, $routeParams, $location, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.remove = function () {
			hive.api()
				.selectApplication($scope.applicationName)
				.removeApplication()
				.success(function (data) {
					$location.path('/');
				});
		};
	}])
	.controller('UserController', ['$scope', '$routeParams', 'hive', function ($scope, $routeParams, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.username = $routeParams.username;
		$scope.allData = null;
		hive.api()
			.selectApplication($scope.applicationName)
			.selectUser($scope.username)
			.getAllData()
			.success(function (allData) {
				allData.forEach(function (data) {
					data.permissionText = (data.permissions & Hive.DATA_PERMISSIONS.PUBLIC_READABLE) ? 'Publicly Readable' : 'Private';
				});
				$scope.allData = allData;
			});
	}])
	.controller('UpdateUserController', ['$scope', '$routeParams', '$location', 'hive', function ($scope, $routeParams, $location, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.username = $routeParams.username;
		$scope.user = null;
		hive.api()
			.selectApplication($scope.applicationName)
			.selectUser($scope.username)
			.getUser()
			.success(function (user) {
				$scope.user = user;
			});
		$scope.save = function () {
			$scope.form.username.$setValidity('taken', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.selectApplication($scope.applicationName)
				.selectUser($scope.username)
				.updateUser({
					username: $scope.user.username,
					email: $scope.user.email
				})
				.success(function (data) {
					$location.path('/applications/' + encodeURIComponent($scope.applicationName) + '/users/' + encodeURIComponent($scope.user.username));
				})
				.error(function (errors) {
					$scope.form.username.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_USERNAME) == -1);
					$scope.form.username.$setValidity('taken', errors.indexOf(Hive.ERROR.USER_EXISTS) == -1);
					$scope.form.email.$setValidity('email', errors.indexOf(Hive.ERROR.INVALID_EMAIL) == -1);
				});
		};
	}])
    .controller('ChangeUserPasswordController', ['$scope', '$routeParams', '$location', 'hive', function ($scope, $routeParams, $location, hive) {
        $scope.applicationName = $routeParams.applicationName;
        $scope.username = $routeParams.username;
        $scope.user = {
            password: ''
        };
        $scope.save = function () {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.form.$invalid) {
                return;
            }
            hive.api()
                .selectApplication($scope.applicationName)
                .selectUser($scope.username)
                .updateUser($scope.user)
                .success(function (data) {
                    $location.path('/applications/' + encodeURIComponent($scope.applicationName) + '/users/' + encodeURIComponent($scope.username) + '/update');
                })
                .error(function (errors) {
                    $scope.form.password.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_PASSWORD) == -1);
                });
        };
    }])
	.controller('RemoveUserController', ['$scope', '$routeParams', '$location', 'hive', function ($scope, $routeParams, $location, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.username = $routeParams.username;
		$scope.remove = function () {
			hive.api()
				.selectApplication($scope.applicationName)
				.selectUser($scope.username)
				.removeUser()
				.success(function (data) {
					$location.path('/applications/' + encodeURIComponent($scope.applicationName));
				});
		};
	}])
	.controller('AddDataController', ['$scope', '$routeParams', '$location', 'hive', function ($scope, $routeParams, $location, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.username = $routeParams.username;
		$scope.data = {
			key: '',
			value: '',
			publicReadable: false
		};
		$scope.addData = function () {
			$scope.form.key.$setValidity('taken', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.selectApplication($scope.applicationName)
				.selectUser($scope.username)
				.addData({
					key: $scope.data.key,
					value: $scope.data.value,
					permissions: $scope.data.publicReadable ? Hive.DATA_PERMISSIONS.PUBLIC_READABLE : Hive.DATA_PERMISSIONS.NONE
				})
				.success(function (data) {
					$location.path('/applications/' + encodeURIComponent($scope.applicationName) + '/users/' + encodeURIComponent($scope.username));
				})
				.error(function (errors) {
					$scope.form.key.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_DATA_KEY) == -1);
					$scope.form.key.$setValidity('taken', errors.indexOf(Hive.ERROR.DATA_KEY_EXISTS) == -1);
				});
		};
	}])
	.controller('DataController', ['$scope', '$routeParams', '$location', 'hive', function ($scope, $routeParams, $location, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.username = $routeParams.username;
		$scope.key = $routeParams.key;
		$scope.data = null;
		hive.api()
			.selectApplication($scope.applicationName)
			.selectUser($scope.username)
			.getData($scope.key)
			.success(function (data) {
				$scope.data = {
					key: data.key,
					value: data.value,
					publicReadable: (data.permissions & Hive.DATA_PERMISSIONS.PUBLIC_READABLE) != 0
				};
			});
		$scope.save = function () {
			$scope.form.key.$setValidity('taken', true);
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.form.$invalid) {
				return;
			}
			hive.api()
				.selectApplication($scope.applicationName)
				.selectUser($scope.username)
				.updateData($scope.key, {
					key: $scope.data.key,
					value: $scope.data.value,
					permissions: $scope.data.publicReadable ? Hive.DATA_PERMISSIONS.PUBLIC_READABLE : Hive.DATA_PERMISSIONS.NONE
				})
				.success(function (data) {
					$location.path('/applications/' + encodeURIComponent($scope.applicationName) + '/users/' + encodeURIComponent($scope.username));
				})
				.error(function (errors) {
					$scope.form.key.$setValidity('pattern', errors.indexOf(Hive.ERROR.INVALID_DATA_KEY) == -1);
					$scope.form.key.$setValidity('taken', errors.indexOf(Hive.ERROR.DATA_KEY_EXISTS) == -1);
				});
		};
	}])
	.controller('RemoveDataController', ['$scope', '$routeParams', '$location', 'hive', function ($scope, $routeParams, $location, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.username = $routeParams.username;
		$scope.key = $routeParams.key;
		$scope.remove = function () {
			hive.api()
				.selectApplication($scope.applicationName)
				.selectUser($scope.username)
				.removeData($scope.key)
				.success(function (data) {
					$location.path('/applications/' + encodeURIComponent($scope.applicationName) + '/users/' + encodeURIComponent($scope.username));
				});
		};
	}])
	.controller('ResetUserPasswordController', ['$scope', '$routeParams', 'hive', function ($scope, $routeParams, hive) {
		$scope.applicationName = $routeParams.applicationName;
		$scope.status = null;
		hive.api()
			.selectApplication($scope.applicationName)
			.resetUserPassword($routeParams.username, $routeParams.code)
			.success(function (data) {
				$scope.password = data;
				$scope.status = 'success';
			})
			.error(function (errors) {
				$scope.status = 'error';
			});
	}]);