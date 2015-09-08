/**
*   Controlador responsable de las acciones realizadas en el módulo de categorías.
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 31/07/2015
*/

controllers.controller("CategoryController", ['$rootScope', '$scope', '$cordovaCamera', '$ionicModal', 'CategoryService', '$timeout', '$ionicActionSheet', '$state', '$filter', '$translate', '$ionicPopup', '$firebaseArray', 'AppService',
	function($rootScope, $scope, $cordovaCamera, $ionicModal, CategoryService, $timeout, $ionicActionSheet, $state, $filter, $translate, $ionicPopup, $firebaseArray, AppService) {
		// se cargan las recetas
		init();
		
		// schema para las categorías
		$scope.category = getEmptyCategory();

		// variable para saber si existen más registros por cargar en el scroll infinito
		$scope.noMoreItemsAvailable = false;

		// modal que se usa para agregar una nueva categoría.
		$ionicModal.fromTemplateUrl('templates/categories/category-add.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			// instancia del modal para agregar categorías
			$scope.addCategoryModal = modal;
		});

		/**
		*	Función responsable de mostrar el modal con el formulario para agregar una nueva 
		*	categoría.
		*/
		$scope.newCategory = function() {
			// se validan los permisos del usuario
			if ($scope.userHasWritePermissions()) {
				// se reinicia el lenguaje de contenidos
				$rootScope.lang = $rootScope.contentsLang;

				// se reinicia el schema para las categorías
				$scope.category = getEmptyCategory();

				// se abre el modal para agregar la categoría
		    	$scope.addCategoryModal.show();				
			}
	  	};

	  	/**
	  	*	Función responsable de verificar si hay más items para cargar de la lista
	  	*/
	  	$scope.moreDataCanBeLoaded = function () {
	  		return true;
	  	};

	  	/**
	  	*	Función responsable de almacenar una nueva categoría
	  	*/
	  	$scope.saveCategory = function () {
	  		// se validan los permisos del usuario
			if ($scope.userHasWritePermissions()) {
		  		// loading...
		  		$scope.startLoading();

		  		// se ejecuta cuando se agrega / actualiza una categoria
		  		var success = function() {
		  			console.log('success add');

		  			// se incrementa el contador de categorías
					$scope.updateCollectionSize(CONSTANTS.FIREBASE.COLLECTIONS.CATEGORIES, true);

		            // loading end
		  			$scope.finishLoading();

		  			// Se muestra el mensaje de éxito
		  			$scope.utilities.messages.showSimpleMessage($filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.SAVED'));

		  			// se cierra el modal despues de medio segundo
		  			$timeout(function () {
			            // se cierra el modal
			            $scope.addCategoryModal.hide();
		  			}, 800);
		        }

		  		// verificamos si se esta creando o actualizando la categoria
		  		if ($scope.lodash.isUndefined($scope.category.$id)) {
		  			// creando, se almacena la categoría
					$scope.categories.$add($scope.category).then(success);
		  		} else {
		  			// actualizando
		  			$scope.category.$save().then(success);
		  		}
		  	}
	  	}

	  	/**
	  	*	Función responsable de mostrar el detalle de una categoría para verla / editarla
	  	*/
	  	$scope.showCategory = function (category) {
	  		// verificamos si el usuario tiene permisos de escritura
			if ($scope.userHasWritePermissions()) {
	  			// Show the action sheet
				var hideSheet = $ionicActionSheet.show({
					buttons: [
						{
							text: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET.OPT_1')
						}, {
							text: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET.OPT_2')
						}
					],
					destructiveText: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET.OPT_3'),
					titleText: $filter('translate')('GENERAL.CONFIG.NAVIGATION.OPTION'),
					cancelText: $filter('translate')('GENERAL.CONFIG.NAVIGATION.CANCEL'),
					cancel: function() {
						// add cancel code..
						console.log('cancel!');
					},

					/**
					*	Función que es llamada cuando alguna de las opciones es "clickeada"
					*/
					buttonClicked: function(index) {
						console.log(index);
						// verificamos si presiono la primera opcion: Ver Recetas
						if (index === 0) {
							// se envia al usuario al listado de recetas de la categoría que llega por parámetro
							$state.go('app.categories-recipes', {
								categoryId: category.$id
							});
						} else if (index === 1) {
							// se reinicia el lenguaje de contenidos
							$rootScope.lang = $rootScope.contentsLang;							
							// Editar categoría, se consultan los datos
				            $scope.category = CategoryService.detail(category.$id);
				            // se abre el modal para actualizar la categoría
					    	$scope.addCategoryModal.show();
						}

						return true;
					},

					/**
					*	Función que se llama cuando el botón de eliminar es llamado
					*/
					destructiveButtonClicked: function (res) {
						console.log(res);

				  		// se busca el índice de la categoría
				  		var index = $scope.lodash.indexOf($scope.categories, category);
				  		console.log('remove: ', index)
				  		// validamos que la posición exista
				  		if (index > -1) {
				  			// se cierra el action sheet
							hideSheet();

				  			// se pide confirmación para eliminar el item
				  			var confirmPopup = $ionicPopup.confirm({
								title: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.DELETE_CATEGORY'),
								template: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.DELETE_SURE_QUEST_CAT ') + ' ' + category[$scope.lang].name + '?'
							});

					  		// callback del confirm
							confirmPopup.then(function(res) {
								// se verifica si el usuario confirmó
								if (res) {
									// loading...
				  					$scope.startLoading();

									// se elimina el item
								    $scope.categories.$remove(category).then(function (ref) {
								    	// se incrementa el contador de categorías
										$scope.updateCollectionSize(CONSTANTS.FIREBASE.COLLECTIONS.CATEGORIES, false);

								    	console.log('ref', ref);
								    	// end loading
								    	$scope.finishLoading();	

								    	// Se muestra el mensaje de éxito
					  					$scope.utilities.messages.showSimpleMessage($filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.DELETE_OK'));
								    }, function (error) {
								    	console.log('error', error);
								    	// end loading
										$scope.finishLoading();
								    });
								}
							});
						} else {
							// end loading
							$scope.finishLoading();
						}
					}
				});
	  		} else {
				// se envia al usuario al listado de recetas de la categoría que llega por parámetro
				$state.go('app.categories-recipes', {
					categoryId: category.$id
				});
	  		}
	  	}

	  	/**
	  	*	Función responsable de asignar la imagen principal de la categoría
	  	*/
	  	$scope.getImage = function () {
	  		// opciones para la imagen principal
	  		var options = {
	  			title: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.PRINCIPAL_IMAGE'),
	  			// opciones cuando la imagen se toma directamente
	  			fromTake: {
	  				/**
					*	Función que se ejecuta cuando la imagen es tomada
					*/
	  				callback: function(imageData) {
		  				// se valida que llegue información de la imagen
		  				if (!$scope.lodash.isEmpty(imageData)) {
							// se asigna al contexto la imagen tomada
							$scope.category[$scope.lang].image = 'data:image/jpeg;base64,' + imageData;
						}
					},
				},
				// opciones cuando la imagen se toma del carrete
				fromDevice: {
					/**
					*	Función que se ejecuta cuando la imagen es cargada desde el carrete
					*/
					callback: function (results) {
						// se valida si hay resultados
						if (!$scope.lodash.isEmpty(results)) {
							// se convierte la imagen seleccionada a base 64
							$scope.utilities.image.convertImgToBase64URL(results[0], function(base64Img) {
								// se asigna la imagen al contexto
								$scope.$apply(function () {
									// se asigna la imagen al contexto
									$scope.category[$scope.lang].image = base64Img;
								});
							});
						}
					}
				}
	  		};

	  		// se ejecuta la funcionalidad para tomar / cargar una foto para asignarla como imagen principal de la receta
	  		$scope.setPicture(options);
	  	}

	  	/**
		*	Función responsable de obtener la estructura base de una categoría
		*/
		function getEmptyCategory() {
			// estructura base de una categoría
			var categoryBase = {
				name: '',
				image: ''
			};

			return {
				// categoría en inglés
				en: angular.copy(categoryBase),
				// categoría en español
				es: angular.copy(categoryBase)
			};
		}

	  	/**
		*	Función que se ejecuta cuando inicia el modulo
		*/
		function init() {
			console.log('Init!');

			console.log('load collections')			

			// // attach an asynchronous callback to read the data at our collections reference
			// $scope.collections.on('value', function (snapshot) {
			// 	console.log(snapshot.val());
			// 	collections = snapshot.val();
			// }, function (errorObject) {
			// 	console.log('the read failed: ' + errorObject.code);
			// });

			// se reinicia el lenguaje de contenidos
			$rootScope.lang = $rootScope.contentsLang;

			// loading...
	  		$scope.startLoading();

			// se obtienen las categorías
			$scope.categories = CategoryService.list();

			// callback que se ejecuta cuando cargan las categorías
			$scope.categories.$loaded().then(function (data) {
				console.log('Loaded');
				console.log(data);

				// se asignanan las categorías al contexto
				$scope.categories = data;

				// end loading
				$scope.finishLoading();
			});
		}
	}
]);