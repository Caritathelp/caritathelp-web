'use strict';
module.exports = ['localStorageService', 'dataService', 'DataVolunteers', function (localStorageService, dataService, DataVolunteers) {
	var ls = localStorageService;
	var dsc = dataService;
	var volunteers = DataVolunteers;
	var user = null;

	if (ls.get('connected')) {
		user = ls.get('currentUser');
		dsc.setHeaders(ls.get('headers'));
	}

	// Sauvegarde des données de l'utilisateur
	function fillUser(datas) {
		user = {};
		user.id = datas.id;
		user.mail = datas.mail;
		user.firstname = datas.firstname;
		user.lastname = datas.lastname;
		user.birthday = datas.birthday;
		user.gender = datas.gender;
		user.city = datas.city;
		user.latitude = datas.latitude;
		user.longitude = datas.longitude;
		user.allowgps = datas.allowgps;
		user.notifications = datas.notifications;
		user.picture = dsc.getApiUrl() + datas.thumb_path;
		return user;
	}

	return {
		// check si l'user est logged
		user: function () {
			return (user) ? user : false;
		},
		connect: function (datas, headers) {
			// Sauvegarde du token
			dsc.setHeaders(headers);
			ls.set('headers', headers);

			// sauvegarde de l'user
			user = fillUser(datas);
			// Récupération des assos et amis de l'user
			volunteers.friends(datas.id, datas.token)
				.then(function (response) {
					user.friends = response.data.response;
					ls.set('currentUser', user);
				});
			volunteers.associations(datas.id, datas.token)
				.then(function (response) {
					user.assos = response.data.response;
					ls.set('currentUser', user);
				});
			volunteers.events(datas.id, datas.token)
				.then(function (response) {
					user.events = response.data.response;
					ls.set('currentUser', user);
				});

			// Variable connected pour les checks (pas forcément utile mais osef)
			ls.set('connected', true);
			console.log('User connected: ' + headers.uid);
		},
		disconnect: function () {
			user = null;
			dsc.setHeaders(null);

			// On retire les cookies du localhost
			ls.remove('headers');
			ls.remove('currentUser');
			ls.remove('connected');
			console.log('User disconnected');
		},
		setPicture: function (pic) {
			user.picture = pic;
			ls.set('currentUser', user);
		}
	};
}];
