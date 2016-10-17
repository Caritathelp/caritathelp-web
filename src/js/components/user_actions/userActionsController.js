'use strict';

module.exports = ['$stateParams', 'userService', 'dataService', function ($stateParams, userService, dataService) {
	var vm = this;
	var usc = userService;
	var dsc = dataService;

	if ($stateParams.id) {
		dsc.getVolunteer($stateParams.id)
			.then(function (data) {
				vm.user = data.response;
			});
	} else {
		vm.user = usc.user();
	}

	vm.addFriend = function () {
		dsc.addFriend(vm.user.id)
			.then(function () {
				vm.user.friendship = 'invitation sent';
			})
	};
	vm.removeFriend = function () {
		dsc.removeFriend(vm.user.id)
			.then(function () {
				vm.user.friendship = 'none';
			});
	};
}];
