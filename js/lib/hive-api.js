function Hive() {
    this._applicationName = null;
    this._user = null;
    this._administrator = null;
}

Hive.DATA_PERMISSIONS = {
    NONE: 0,
    PUBLIC_READABLE: 1
};

Hive.ERROR = {
    NONE: 0,
    SERVER_ERROR: 1000,
    UNKNOWN_APPLICATION: 1001,
    UNKNOWN_USER: 1002,
    WRONG_PASSWORD: 1003,
    USER_EXISTS: 1004,
    INVALID_USERNAME: 1005,
    INVALID_PASSWORD: 1006,
    INVALID_EMAIL: 1007,
    INVALID_DATA_KEY: 1008,
    PERMISSION_DENIED: 1009,
    UNKNOWN_ADMINISTRATOR: 1010,
    ADMINISTRATOR_EXISTS: 1011,
    APPLICATION_EXISTS: 1012,
    INVALID_APPLICATION_NAME: 1013,
    NOT_YET_CONFIRMED: 1014,
    WRONG_CONFIRMATION_CODE: 1015,
    WRONG_RESET_PASSWORD_CODE: 1016,
    DATA_KEY_EXISTS: 1017,
    UNKNOWN_DATA_KEY: 1018
};

Hive.prototype.selectApplication = function (name) {
    this._applicationName = name;
    return this;
};

Hive.prototype.selectUser = function (username, password) {
    if (username !== null) {
        this._user = {
            username: username,
            password: password
        };
    } else {
        this._user = null;
    }
    return this;
};

Hive.prototype.selectAdministrator = function (username, password) {
    if (username !== null) {
        this._administrator = {
            username: username,
            password: password
        };
    } else {
        this._administrator = null;
    }
    return this;
};

Hive.prototype.addUser = function (user) {
    var path = ['applications', this._applicationName, 'users'];
    return this._callApi('POST', path, user);
};

Hive.prototype.updateUser = function (user) {
    var path = ['applications', this._applicationName];
    if (this._administrator !== null) {
        path.push('users', this._user.username);
    } else {
        path.push('user');
    }
    return this._callApi('PUT', path, user);
};

Hive.prototype.removeUser = function () {
    var path = ['applications', this._applicationName];
    if (this._administrator !== null) {
        path.push('users', this._user.username);
    } else {
        path.push('user');
    }
    return this._callApi('DELETE', path, {});
};

Hive.prototype.requestResetUserPassword = function (username) {
    var path = ['applications', this._applicationName, 'users', username, 'request-reset-password'];
    return this._callApi('POST', path, {});
};

Hive.prototype.resetUserPassword = function (username, resetCode) {
    var path = ['applications', this._applicationName, 'users', username, 'reset-password'];
    return this._callApi('POST', path, {
        resetCode: resetCode
    });
};

Hive.prototype.saveData = function (data) {
    var path = ['applications', this._applicationName];
    if (this._administrator !== null) {
        path.push('users', this._user.username);
    }
    path.push('data');
    return this._callApi('POST', path, data);
};

Hive.prototype.addData = function (data) {
    var path = ['applications', this._applicationName, 'users', this._user.username, 'add-data'];
    return this._callApi('POST', path, data);
};

Hive.prototype.updateData = function (key, data) {
    var path = ['applications', this._applicationName, 'users', this._user.username, 'data', key];
    return this._callApi('PUT', path, data);
};

Hive.prototype.getData = function (key) {
    var path = ['applications', this._applicationName];
    if (this._administrator !== null) {
        path.push('users', this._user.username);
    }
    path.push('data', key);
    return this._callApi('GET', path, {});
};

Hive.prototype.getUserData = function (username, key) {
    var path = ['applications', this._applicationName, 'data', key];
    return this._callApi('GET', path, {
        username: username
    });
};

Hive.prototype.removeData = function (key) {
    var path = ['applications', this._applicationName];
    if (this._administrator !== null) {
        path.push('users', this._user.username);
    }
    path.push('data', key);
    return this._callApi('DELETE', path, {});
};

Hive.prototype.addAdministrator = function (administrator) {
    return this._callApi('POST', ['administrators'], administrator);
};

Hive.prototype.confirmAdministrator = function (username, confirmationCode) {
    var path = ['administrators', username, 'confirm'];
    return this._callApi('POST', path, {
        confirmationCode: confirmationCode
    });
};

Hive.prototype.updateAdministrator = function (administrator) {
    return this._callApi('PUT', ['administrator'], administrator);
};

Hive.prototype.removeAdministrator = function () {
    return this._callApi('DELETE', ['administrator']);
};

Hive.prototype.requestResetAdministratorPassword = function (username) {
    var path = ['administrators', username, 'request-reset-password'];
    return this._callApi('POST', path, {});
};

Hive.prototype.resetAdministratorPassword = function (username, resetCode) {
    var path = ['administrators', username, 'reset-password'];
    return this._callApi('POST', path, {
        resetCode: resetCode
    });
};

Hive.prototype.addApplication = function (application) {
    return this._callApi('POST', ['applications'], application);
};

Hive.prototype.updateApplication = function (application) {
    var path = ['applications', this._applicationName];
    return this._callApi('PUT', path, application);
};

Hive.prototype.removeApplication = function () {
    var path = ['applications', this._applicationName];
    return this._callApi('DELETE', path, {});
};

Hive.prototype.getApplications = function () {
    return this._callApi('GET', ['applications'], {});
};

Hive.prototype.getUsers = function () {
    var path = ['applications', this._applicationName, 'users'];
    return this._callApi('GET', path, {});
};

Hive.prototype.getAllData = function () {
    var path = ['applications', this._applicationName];
    if (this._administrator !== null) {
        path.push('users', this._user.username);
    }
    path.push('data');
    return this._callApi('GET', path, {});
};

Hive.prototype.getAdministrator = function () {
    return this._callApi('GET', ['administrator'], {});
};

Hive.prototype.getApplication = function () {
    return this._callApi('GET', ['applications', this._applicationName], {})
};

Hive.prototype.getUser = function () {
    return this._callApi('GET', ['applications', this._applicationName, 'users', this._user.username], {});
};

Hive.prototype._callApi = function (method, path, parameters) {
    var url = 'https://www.hiveds.com/api';
    for (var i = 0; i < path.length; i++) {
        url += '/' + encodeURIComponent(path[i]);
    }
    var authorization = null;
    if (this._administrator !== null) {
        authorization = 'Hive type="administrator", username="' + this._administrator.username + '", password="' + this._administrator.password + '"';
    } else if (this._user !== null) {
        authorization = 'Hive type="user", username="' + this._user.username + '", password="' + this._user.password + '"';
    }
    var callbacks = {
        success: function (data) {},
        error: this.handleErrors
    };
    this.makeHttpRequest(method, url, parameters, authorization, callbacks);
    var settings = {
        success: function (callback) {
            callbacks.success = callback;
            return settings;
        },
        error: function (callback) {
            callbacks.error = callback;
            return settings;
        }
    };
    return settings;
};

Hive.prototype.handleErrors = function (errors) {};

Hive.prototype.makeHttpRequest = function (method, url, data, authorization, callbacks) {
    var formData = new FormData();
    for (var key in data) {
        formData.append(key, data[key]);
    }
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState != 4) {
            return;
        }
        if (httpRequest.status == 200) {
            var response = JSON.parse(httpRequest.responseText);
            if (typeof(response.errors) !== 'undefined') {
                callbacks.error(response.errors);
            } else {
                callbacks.success(response.data);
            }
        } else {
            callbacks.error([httpRequest.status]);
        }
    };
    httpRequest.open(method, url);
    if (authorization !== null) {
        httpRequest.setRequestHeader('Authorization', authorization);
    }
    httpRequest.send(formData);
};