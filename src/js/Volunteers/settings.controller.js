'use strict';
module.exports = ['dataService', 'userService', 'DataVolunteers', 'DataAssociations', 'DataEvents', '$state',
	function (dataService, userService, DataVolunteers, DataAssociations, DataEvents, $state) {
		var vm = this;
		var usc = userService;
		var dsc = dataService;
		var volunteers = DataVolunteers;
		var associations = DataAssociations;
		var events = DataEvents;

		vm.user = usc.user();
		vm.tab = 1;
		vm.invited = {};
		vm.apiurl = volunteers.apiurl;

		associations.invites()
		.then(function (response) {
			vm.invited.assos = response.data.response;
		});
		events.invites()
		.then(function (response) {
			vm.invited.events = response.data.response;
		});
		volunteers.pending()
		.then(function (response) {
			vm.invited.friends = response.data.response;
		});

		vm.updateVolunteer = function () {
		// mail, password, firstname, lastname, birthday, gender
			vm.updating = true;
			volunteers.update(vm.user.mail, vm.password, vm.user.firstname, vm.user.lastname, null)
			.then(function () {
				vm.success = true;
				vm.successMessage = 'Votre profil a bien été modifié';
			}, function (response) {
				vm.error = true;
				vm.errorMessage = response.data.message;
			})
			.finally(function () {
				vm.updating = false;
			});
		};

		vm.updatePicture = function () {
			vm.updating = true;
			dsc.postPicture(vm.picture.base64, vm.picture.filename, vm.picture.filename)
			.then(function (response) {
				vm.user.picture = volunteers.apiurl + response.data.response.thumb_path;
				usc.setPicture(vm.user.picture);
				$state.reload();
			})
			.finally(function () {
				vm.updating = false;
			});
		};

		vm.answerAsso = function (notifId, acceptance, index) {
			associations.replyInvite(notifId, acceptance)
			.then(function () {
				vm.invited.assos.splice(index, 1);
				vm.success = true;
				vm.successMessage = 'La demande a bien été traitée';
			}, function (response) {
				vm.error = response.data.message;
			});
		};

		vm.answerEvent = function (notifId, acceptance, index) {
			events.replyInvite(notifId, acceptance)
			.then(function () {
				vm.invited.events.splice(index, 1);
				vm.success = true;
				vm.successMessage = 'La demande a bien été traitée';
			}, function (response) {
				vm.error = response.data.message;
			});
		};

		vm.answerFriend = function (notifId, acceptance, index) {
			volunteers.reply(notifId, acceptance)
			.then(function () {
				vm.invited.friends.splice(index, 1);
				vm.success = true;
				vm.successMessage = 'La demande a bien été traitée';
			}, function (response) {
				vm.error = response.data.message;
			});
		};

		vm.popupBirthdate = {
			opened: false
		};

		vm.openBirthdate = function () {
			vm.popupBirthdate.opened = true;
		};

		vm.setTab = function (activeTab) {
			vm.tab = activeTab;
		};
		vm.isSet = function (tab) {
			return vm.tab === tab;
		};
	}];
