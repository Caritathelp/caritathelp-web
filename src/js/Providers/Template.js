'use strict';

var template = require('angular').module('caritathelp.service.template', []);

template.provider('Template', [function TemplateProvider() {
	var provider = {

		view: function (name) {
			return 'view/' + name + '.html';
		},

		partial: function (name) {
			return 'view/partials/' + name + '.html';
		},

		modal: function (name) {
			return 'modal/' + name + '.html';
		}
	};

	this.$get = function () {
		return provider;
	};
}]);

module.export = template;
