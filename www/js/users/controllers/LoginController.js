/**
*   Controlador responsable de realizar el login de un usuario en la app
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 24/08/2015
*/

controllers.controller("LoginController", ['$rootScope', '$scope', '$ionicHistory', '$firebaseAuth', '$state', '$cordovaVibration', '$timeout',
	function($rootScope, $scope, $ionicHistory, $firebaseAuth, $state, $cordovaVibration, $timeout) {
		// credenciales del usuario que realiza el login
		$scope.user = {
			email: '',
			password: ''
		};

		// objeto que almacena los posibles errores en el login
		$scope.error = null;

		// instancia para la autenticación con firebase
		var fbAuth = $firebaseAuth($scope.firebase);

		/**
		*	Función responsable de realizar el login de un usuario para administrar la información
		*/
		$scope.doLogIn = function () {
			console.log('doLogIn')
			// start loading...
			$scope.startLoading();

			// se realiza el login con firebase
			fbAuth.$authWithPassword($scope.user).then(function(authData) {
				console.log('authData')
				console.log(authData);
				// finish Loading.
				$scope.finishLoading();

				// éxito en la autenticación, se construye la información del usuario para almacenarla
	            console.log($scope.authUserData);

	            $rootScope.authUserData = {
	            	isConnected: true,
					uid: authData.uid,
					token: authData.token,
					name: authData.password.email.replace(/@.*/, ''),
					email: authData.password.email,
					profileImage: authData.password.profileImageURL
				};

				console.log('$rootScope.authUserData');
				console.log($rootScope.authUserData);

				// se almacena la info del usuario
				$scope.utilities.localStorage.addItem(CONSTANTS.LOCAL_STORAGE.AUTH_USER_DATA, angular.toJson($scope.authUserData));

				// Se muestra el mensaje de éxito
				$scope.utilities.messages.showSimpleMessage('OK!');

				// se envie el usuario al listado de categorías
	            $state.go("app.categories");
	        }).catch(function(error) {
	        	// finish Loading.
				$scope.finishLoading();
	            console.error("ERROR: ");
	            console.log(error);

				if (error) {
					$scope.error = error;
					switch (error.code) {
						case "INVALID_EMAIL":
							console.log("The specified user account email is invalid.");
						break;
						case "INVALID_PASSWORD":
							console.log("The specified user account password is incorrect.");
						break;
						case "INVALID_USER":
							console.log("The specified user account does not exist.");
						break;
						default:
							console.log("Error logging user in:", error);
					}
				}
	        });
		}

		/**
		*	Función responsable de registrar un nuevo usuario
		*/
		$scope.register = function() {
			console.log('register');
	        fbAuth.$createUser($scope.user).then(function(userData) {
	        	console.log('fbAuth.$createUser');
	        	// Vibra para informar al usuario del evento
	            return fbAuth.$authWithPassword($scope.user);
	        }).then(function(authData) {
	            console.log('authData')
	            console.log(authData)
	            $cordovaVibration.vibrate(10);
	            $timeout(function () {
	            	$cordovaVibration.vibrate(20);
	            }, 100);
	        }).catch(function(error) {
	            console.error("ERROR: " + error);
	            $cordovaVibration.vibrate(5);
	            $timeout(function () {
	            	$cordovaVibration.vibrate(5);
	            }, 200);
	        });
	    }
	}
]);