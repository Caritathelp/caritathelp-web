angular.module('social')
.factory('UserService', function(localStorageService){
	var ls = localStorageService;

	if (ls.get('connected')) {
		var connected = true,
				token = ls.get('token'),
				user = ls.get('currentUser');
	}

	return {
		connected: function(){
			return connected;
		},
		token: function(){
			return token;
		},
		user: function(){
			return user;
		},
		connect: function(datas) {
			//sauvegarde de l'user
			user = {};
			user.id = datas.id;
			user.mail = datas.mail
			user.firstname = datas.firstname;
			user.lastname = datas.lastname;
			user.birthday = datas.birthday;
			user.gender = datas.gender;
			user.city = datas.city;
			user.allowgps = datas.allowgps;
			ls.set('currentUser', user);

			//Sauvegarde du token
			token = datas.token;
			ls.set('token', token);

			//Variable connected pour les checks (pas forcément utile mais osef)
			connected = true;
			ls.set('connected', true);
			console.log('User connected: ' + user.mail);
		},
		disconnect: function() {
			user = null;
			token = "";
			connected = false;

			ls.remove('token');
			ls.remove('currentUser');
			ls.remove('connected');
			console.log('User disconnected');
		}
	}
});