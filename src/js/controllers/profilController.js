'use strict';
module.exports = /*@ngInject*/ function (userService, $stateParams, $state, dataService) {
	var vm = this;
	var usc = userService;
	var dsc = dataService;
	var angular = require('angular');

	vm.currentUser = usc.user();
	vm.user = {};

	vm.isCurrent = false;

	vm.tab = 1;
	if ($stateParams.id) {
		if ($stateParams.id == vm.currentUser.id) { // eslint-disable-line eqeqeq
			$state.transitionTo('profil.home');
		}
		dsc.getVolunteer($stateParams.id)
			.success(function (data) {
				vm.user = data.response;
				vm.user.picture = 'http://api.caritathelp.me' + data.response.thumb_path;
			});
		dsc.getFriends($stateParams.id)
			.success(function (data) {
				vm.user.friends = data.response;
			});
		dsc.getEvents($stateParams.id)
			.success(function (data) {
				vm.user.events = data.response;
			});
		dsc.getAssos($stateParams.id)
			.success(function (data) {
				vm.user.assos = data.response;
			});
	} else {
		vm.isCurrent = true;
		vm.user = vm.currentUser;
		console.log(vm.user.assos);
	}

	vm.addFriend = function () {
		angular.element('#addFriend').html('<i class="fa fa-spin fa-spinner"></i> ').attr('disabled', true);
		dsc.addFriend(vm.user.id)
			.success(function () {
				vm.user.friendship = 'invitation sent';
				angular.element('#addFriend').html('Demande envoyée').attr('disabled', true);
			});
	};

	vm.setTab = function (activeTab) {
		vm.tab = activeTab;
	};
	vm.isSet = function (tab) {
		return vm.tab === tab;
	};
};
