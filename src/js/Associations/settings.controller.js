'use strict';

module.exports = ['$state', '$stateParams', 'dataService', 'DataAssociations', 'DataShelters',
	function ($state, $stateParams, dataService, DataAssociations, DataShelters) {
		var vm = this;
		var dsc = dataService;
		var associations = DataAssociations;
		var shelters = DataShelters;
		vm.apiurl = dataService.getApiUrl();
		vm.apiurl2 = 'http://staging.caritathelp.me';

		vm.tab = 1;
		vm.adding = false;

		associations.get($stateParams.id)
		.then(function (response) {
			vm.asso = response.data.response;
			associations.members($stateParams.id)
				.then(function (response) {
					vm.asso.members = response.data.response;
				});
			associations.invited($stateParams.id)
				.then(function (response) {
					vm.asso.invited = response.data.response;
				});
			associations.waiting($stateParams.id)
				.then(function (response) {
					vm.asso.waiting = response.data.response;
				});
			associations.shelters($stateParams.id)
				.then(function (response) {
					vm.asso.shelters = response.data.response;
				});
		});

		vm.updateAsso = function () {
			vm.updating = true;
			associations.update(vm.asso.id, vm.asso.name, vm.asso.description, vm.asso.birthday, vm.asso.city, null, null)
			.then(function () {
				vm.success = 'Votre association a bien été modifiée';
				$state.reload();
			}, function (response) {
				vm.error = response.data.message;
			})
			.finally(function () {
				associations.get($stateParams.id).then(function (response) {
					vm.asso = response.data.response;
				});
				vm.updating = false;
			});
		};

		vm.updatePicture = function () {
			vm.updating = true;
			dsc.postAssoPicture(vm.picture.base64, vm.picture.filename, vm.picture.filename, vm.asso.id)
			.then(function (response) {
				vm.success = 'L\'image a bien été mise à jour';
				vm.asso.thumb_path = response.data.response.thumb_path;
				$state.reload();
			}, function (response) {
				vm.error = response.data.message;
			})
			.finally(function () {
				vm.updating = false;
			});
		};

		vm.deleteAsso = function () {
			associations.delete(vm.asso.id)
			.then(function () {
				$state.transitionTo('home');
			});
		};

		vm.promoteUser = function (userId) {
			associations.rights(userId, vm.asso.id, 'admin')
			.then(function () {
				vm.success = 'Le membre a bien été promu';
			}, function (response) {
				vm.error = response.data.message;
			})
			.finally(function () {
				associations.members($stateParams.id)
					.then(function (response) {
						vm.asso.members = response.data.response;
					});
			});
		};

		vm.demoteUser = function (userId) {
			associations.rights(userId, vm.asso.id, 'member')
			.then(function () {
				vm.success = 'Le membre a bien été rétrogradé';
			}, function (response) {
				vm.error = response.data.message;
			})
			.finally(function () {
				associations.members($stateParams.id)
					.then(function (response) {
						vm.asso.members = response.data.response;
					});
			});
		};

		vm.kickUser = function (userId) {
			associations.kick(userId, vm.asso.id)
			.then(function () {
				vm.success = 'Le membre a bien été expulsé';
			}, function (response) {
				vm.error = response.data.message;
			})
			.finally(function () {
				associations.members($stateParams.id)
					.then(function (response) {
						vm.asso.members = response.data.response;
					});
			});
		};

		vm.replyDemand = function (notifId, answer, index) {
			associations.replyDemand(notifId, answer)
			.then(function () {
				vm.asso.waiting.splice(index, 1);
				vm.success = 'La demande a bien été traitée';
			}, function (response) {
				vm.error = response.data.message;
			})
			.finally(function () {
				associations.members($stateParams.id)
					.then(function (response) {
						vm.asso.members = response.data.response;
					});
			});
		};

		vm.addShelter = function () {
			vm.creating = true;
			shelters.create(vm.asso.id, vm.shelter.name, vm.shelter.address, vm.shelter.zipcode, vm.shelter.city, vm.shelter.total_places, vm.shelter.free_places, vm.shelter.description)
			.then(function (response) {
				if (response.data.status == 200) {
					$state.transitionTo('shelter', {id: response.data.response.id});
					vm.adding = false;
				} else {
					vm.error = response.data.message;
				}
				vm.creating = false;
			}, function (response) {
				vm.error = response.data.message;
			});
		};
		vm.disableShelterCreation = function () {
			vm.adding = false;
			addShelterForm.$setUntouched();
		};

		vm.setTab = function (activeTab) {
			vm.success = false;
			vm.error = false;
			vm.tab = activeTab;
		};
		vm.isSet = function (tab) {
			return vm.tab === tab;
		};
	}];
