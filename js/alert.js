angular
	.module('alert', [])
	.factory('alert', ['$rootScope', function ($rootScope) {
		var messages = [];
		var queue = [];

		$rootScope.$on('$locationChangeSuccess', function () {
			Array.prototype.splice.apply(messages, [0, messages.length].concat(queue));
			queue.splice(0, queue.length);
		});

		return {
			showMessage: function (text, type) {
				messages.push(createMessage(text, type));
			},
			queueMessage: function (text, type) {
				queue.push(createMessage(text, type));
			},
			messages: messages
		};

		function createMessage(text, type) {
			var message = {
				text: text,
				type: typeof(type) !== 'undefined' ? type : 'info'
			};
			message.close = function () {
				messages.splice(messages.indexOf(message), 1);
			}
			return message;
		}
	}]);