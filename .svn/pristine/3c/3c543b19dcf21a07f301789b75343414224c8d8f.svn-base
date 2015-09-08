/**
*   Módulo que encapsula los controladores de la aplicación.
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 31/07/2015
*/

var controllers = angular.module('starter.controllers', []);

controllers.controller('AppController', ['$rootScope', '$scope', '$translate', '$filter', '$timeout', '$ionicActionSheet', '$cordovaImagePicker', '$cordovaCamera', '$filter', '$cordovaVibration', '$state', '$ionicHistory', '$ionicLoading', 'AppService',
	function ($rootScope, $scope, $translate, $filter, $timeout, $ionicActionSheet, $cordovaImagePicker, $cordovaCamera, $filter, $cordovaVibration, $state, $ionicHistory, $ionicLoading, AppService) {
	    // colecciones
		$rootScope.collections = AppService.collections();

		/**
		*	Función responsable de incrementar / decrementar la cantiad de items 
		*	que se tienen para cada colección.
		*/
		$rootScope.updateCollectionSize = function (collection, increment) {
			$scope.collections.child(collection).transaction(function (currentValue) {
				console.log('currentValue: ', currentValue);
				// var que almacena el nuevo valor del contador
				var newValue = 0;

				// se verifica si se debe incrementar o decrementar el contador
				if (increment) {
					newValue = (currentValue || 0) + 1;
				} else {
					newValue = (currentValue || 0) - 1;

					if (newValue < 0) {
						newValue = 0;
					}
				}

				return newValue;
			}, function (err, commited, snapshot) {
				if (err) {
					console.log('fail increment categories')
				} else if (commited) {
					console.log('success: %s', snapshot.val());
				}
			});
		}

	    /**
	    *	Función responsable de verificar si el usuario esta o no autennticado
	    *	para poder actualizar los contenidos de la app.
	    */
	    $rootScope.userHasWritePermissions = function () {
	    	// var que indica si el usuario puede o no editar los contenidos, se asume que no los tiene
	    	var hasPermissions = false;
	    	
	    	// se verifica que el usuario este conectado
	    	if ($rootScope.authUserData && $rootScope.authUserData.isConnected) {
	    		// OK!
	    		hasPermissions = true;
	    	} else {
	    		console.log('without write permissions');
	    	}

	    	return hasPermissions;
	    }

	    /**
	    *	Función responsable de finalizar un proceso de carga en la app
	    */
	    $rootScope.finishLoading = function () {
	    	console.log('finish loading', $rootScope.isLoading);
	    	// se valida si la app esta realizando un proceso
	    	$rootScope.isLoading = false;
			$ionicLoading.hide(); 
	    }

	    /**
	    *	Función responsable de iniciar un proceso de carga en la app
	    */
	    $rootScope.startLoading = function () {
	    	console.log('loading.');
	    	$rootScope.isLoading = true;

	    	$rootScope.loading = $ionicLoading.show({
			   showBackdrop: true
			});
		  	
		  	// tiempo máximo para el loading
		  	$timeout(function () {
		  		// end loading
		  	   $rootScope.finishLoading();
		  	}, 60000);
	    }

	    /**
	    *	Función responsable de cambiar el idioma para un contenido
	    */
	    $rootScope.setLang = function (lang) {
	    	$rootScope.lang = lang;
	    	console.log('lang: ', $scope.lang)
	    }

	    /**
	    *	Retorna una configuración básica para tomar u obtener una imagen del carrete desde el dispositivo
	    */
	    $rootScope.getImageConfig = function (options) {
	    	// opciones configurables
	    	var targetWidth = 400;
	    	var targetHeight = 300;
	    	var targetQuality = 100;

	    	// si llega una configuracion se aplica
	    	if (!$scope.lodash.isUndefined(options)) {
	    		console.log(options)
		    	targetWidth = ($scope.lodash.isUndefined(options.width)) ? 400 : options.width;
		    	targetHeight = ($scope.lodash.isUndefined(options.height)) ? 300 : options.height;
		    	targetQuality = ($scope.lodash.isUndefined(options.quality)) ? 300 : options.quality;
	    	}

	    	// opciones para la imagen principal
			var imageOptions = {
				// opciones cuando se toma la imagen con la camara
				fromTake: {
					quality: targetQuality,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					allowEdit: true,
					encodingType: Camera.EncodingType.JPEG,
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false
			    },

		    	// opciones cuando se carga la imagen desde el dispositivo
				fromDevice: {
					maximumImagesCount: 1,
					width: targetWidth,
					height: targetHeight,
					quality: targetQuality
				}
			};

			return imageOptions;
	    }

	    /**
		*	Función responsable de ejecutar la funcionalidad para tomar / cargar una foto para asignarla 
		*	a un elemento del contexto.
		*/
		$rootScope.setPicture = function (options) {
			// configuración para tomar la imagen tomandola con el dispositivo directamente
			var fromTakeImageOptions = $scope.getImageConfig(options.fromTake.imageConfig || undefined).fromTake;
			// configuración para tomar desde el carrete del dispositivo
			var fromDeviceImageOptions = $scope.getImageConfig(options.fromDevice.imageConfig || undefined).fromDevice;
			// función que se ejecuta por defecto cuando hay un error tomando la imagen directamente con la cámara del dispositivo
			var fromTakeErrorCallback = function(err) {
				// error
				console.log('Error!', err);
			};
			// función que se ejecuta por defecto cuando hay un error tomando la imagen cargandola desde el carrete
			var fromDeviceErrorCallback = function(error) {
				// error getting photos
				console.log('error getting photos', error);
			};

			// se valida si llega una funcion personalizada cuando ocurre un error tomando una foto
			if ($scope.lodash.isFunction(options.fromTake.callbackError)) {
				fromTakeErrorCallback = options.fromTake.callbackError;
			}

			// se valida si llega una funcion personalizada cuando ocurre un error obteniendo la imagen desde el carrete
			if ($scope.lodash.isFunction(options.fromDevice.callbackError)) {
				fromDeviceErrorCallback = options.fromDevice.callbackError;
			}

			// action sheet para la carga de la imagen
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{
						text: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.TAKE_PIC')// Take Photo
					}, {
						text: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.SELECT_PIC_EXIST')
					}
				],
				titleText: options.title,
				cancelText:  $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.CANCEL'),
				cancel: function() {
					// add cancel code..
					console.log('cancel!');
				},
				buttonClicked: function(index) {
					console.log(index);
					// verificamos si presiono la primera opcion: tomar foto
					if (index === 0) {
						console.log(fromTakeImageOptions)
						// se habilita la camara del dispositivo para tomar una foto
						$cordovaCamera.getPicture(fromTakeImageOptions).then(
							options.fromTake.callback, 
							fromTakeErrorCallback
						);
					} else if (index === 1) {
						console.log(fromDeviceImageOptions)
						// seleccionar imagen existente
						$cordovaImagePicker.getPictures(fromDeviceImageOptions)
						.then(
							options.fromDevice.callback, 
							fromDeviceErrorCallback
						);
					}

					return true;
				}
			});
	  	};

	  	/**
	  	*	Función que realiza el logout de un usuario en la app
	  	*/
	  	$rootScope.logout = function () {
	  		// se reinicia la información del usuario
	  		$rootScope.authUserData = {
            	isConnected: false,
				uid: '',
				token: '',
				name: '',
				email: '',
				profileImage: ''
			};

			// se elimina la info del almacenamiento local
			$scope.utilities.localStorage.removeItem(CONSTANTS.LOCAL_STORAGE.AUTH_USER_DATA);
	  	}

	  	// bandera que se activa cuando el evento onHold del settings esta activado
	  	$scope.onHoldSettingsActive = false;

	  	/**
	  	*
	  	*/
	  	$scope.onHoldSettings = function () {
	  		console.log('onHoldSettings fired')
	  		// Vibra para informar al usuario del evento
	  		$cordovaVibration.vibrate(200);
	  		// se activa el evento onHold del settings
	  		$scope.onHoldSettingsActive = true;
	  		// se queda a la espera (10s) del evento "onDragRightSettings" para activar el panel de login
	  		$timeout(function () {
	  			$scope.onHoldSettingsActive = true;
	  		}, 10000);
	  	}

	  	/**
	  	*	Cuando este evento es lanzado y se tiene la bandera "onHoldSettingsActive" activada,
	  	*	se envía al usuario al login.
	  	*/
	  	$scope.onDragRightSettings = function () {
	  		console.log('onDragRightSettings fired', $scope.onHoldSettingsActive);
	  		if ($scope.onHoldSettingsActive) {
	  			// navigation options
				$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true
				});
		  		// se envia al usuario al login
		  		$state.go('app.login');
	  		}
	  	}

	  	/**
	  	*	Cuando este evento es lanzado y se tiene la bandera "onHoldSettingsActive" activada, 
	  	*	se realiza el logout.
	  	*/
	  	$scope.onDragLeftSettings = function () {
	  		console.log('onDragRightSettings fired', $scope.onHoldSettingsActive);
	  		if ($scope.onHoldSettingsActive) {
		  		// se realiza el logout en la app
		  		$scope.logout();
	  		}
	  	}



	}
]);