'use strict';

module.exports = ['$state', '$stateParams', 'userService', 'ModalService', 'DataEvents',
	function ($state, $stateParams, userService, ModalService, DataEvents) {
		var vm = this;
		var usc = userService;
		var modal = ModalService;
		var events = DataEvents;
		vm.apiurl = DataEvents.apiurl;

		vm.current = usc.user();
		vm.event = {};
		vm.loaded = false;
		vm.rights = {};

		events.get($stateParams.id)
		.then(function (response) {
			vm.event = response.data.response;
			events.guests($stateParams.id)
				.then(function (response) {
					vm.event.guests = response.data.response;
					vm.loaded = true;
				});
			getRightsMessages();
		});

		vm.joinEvent = function () {
			events.join(vm.event.id)
			.then(function () {
				vm.event.rights = 'waiting';
				vm.rights.message = 'Vous avez fait une demande pour participer à cet évènement. Un organisateur vous répondra prochainement';
				vm.rights.class = 'alert-info';
			}, function (response) {
				vm.error = (response.data.message);
			});
		};
		vm.cancelJoin = function () {
			vm.event.rights = null;
		};
		vm.leaveEvent = function () {
			events.leave(vm.event.id)
			.then(function () {
				vm.event.rights = null;
			});
		};
		vm.deleteEvent = function () {
			events.delete(vm.event.id)
			.then(function () {
				$state.transitionTo('home');
			});
		};

		function getRightsMessages() {
			switch (vm.event.rights) {
				case null:
					vm.rights.message = 'Vous ne participez pas à cet évènement';
					vm.rights.class = 'alert-warning';
					break;
				case 'member':
					vm.rights.message = 'Vous participez à cet évènement';
					vm.rights.class = 'alert-success';
					break;
				case 'admin':
					vm.rights.message = 'Vous êtes administrateur de cet évènement';
					vm.rights.class = 'alert-success';
					break;
				case 'host':
					vm.rights.message = 'Vous êtes le créateur de cet évènement';
					vm.rights.class = 'alert-success';
					break;
				case 'waiting':
					vm.rights.message = 'Vous avez fait une demande pour participer à cet évènement. Un organisateur vous répondra prochainement';
					vm.rights.class = 'alert-info';
					break;
				default:
					vm.rights.message = 'Impossible de récupérer les informations pour cet évènement';
					vm.rights.class = 'alert-danger';
					break;
			}
		}

		vm.openInvite = function () {
			modal.showModal({
				templateUrl: 'modal/event-invite.html',
				controller: ['close', '$scope', 'DataEvents', function (close, $scope, DataEvents) {
					events.invitable(vm.event.id).then(function (response) {
						$scope.members = response.data.response;
					});
					$scope.apiurl = vm.apiurl;
					this.dismiss = function () {
						close();
					};
					this.invite = function (friendId) {
						DataEvents.invite(friendId, vm.event.id);
						close();
					};
				}],
				controllerAs: 'modal'
			});
		};
	}];
