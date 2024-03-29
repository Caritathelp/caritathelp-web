'use strict';

require('../Components/Timeline/Timeline');
require('../Components/Calendar');
require('../Components/UserSummary');

var associations = require('angular').module('caritathelp.associations', [
	'caritathelp.component.user_summary',
	'caritathelp.component.timeline',
	'caritathelp.component.calendar'
]);

associations.config(['$stateProvider', 'TemplateProvider', function ($stateProvider, TemplateProvider) {
	var Template = TemplateProvider.$get();

	$stateProvider
		.state('associations', {
			url: '/association',
			templateUrl: Template.view('Associations/directory'),
			abstract: true,
			authenticate: true
		})
		.state('associations.directory', {
			url: '',
			templateUrl: Template.partial('Associations/directory'),
			controller: require('./directory.controller'),
			controllerAs: 'directory',
			authenticate: true
		})
		.state('associations.create', {
			url: '/creer',
			templateUrl: Template.partial('Associations/create'),
			controller: require('./creation.controller'),
			controllerAs: 'create',
			authenticate: true
		})

		.state('association', {
			url: '/association/{id}',
			templateUrl: Template.view('Associations/index'),
			controller: require('./associations.controller'),
			controllerAs: 'vm',
			abstract: true,
			authenticate: true
		})
		.state('association.home', {
			url: '',
			templateUrl: Template.view('Associations/home'),
			authenticate: true
		})
		.state('association.members', {
			url: '/membres',
			templateUrl: Template.view('Associations/members'),
			authenticate: true
		})
		.state('association.calendar', {
			url: '/calendrier',
			templateUrl: Template.view('Associations/calendar'),
			authenticate: true
		})

		.state('association.settings', {
			url: '/parametres',
			templateUrl: Template.view('Associations/settings'),
			controller: require('./settings.controller'),
			controllerAs: 'settings',
			abstract: true,
			authenticate: true
		})
		.state('association.settings.general', {
			url: '',
			templateUrl: Template.partial('Associations/general'),
			authenticate: true
		})
		.state('association.settings.shelters', {
			url: '/centres',
			templateUrl: Template.partial('Associations/shelters'),
			authenticate: true
		})
		.state('association.settings.picture', {
			url: '/avatar',
			templateUrl: Template.partial('Associations/picture'),
			authenticate: true
		})
		.state('association.settings.members', {
			url: '/membres',
			templateUrl: Template.partial('Associations/members'),
			authenticate: true
		})
		.state('association.settings.delete', {
			url: '/suppression',
			templateUrl: Template.partial('Associations/delete'),
			authenticate: true
		});
}]);

module.exports = associations;

