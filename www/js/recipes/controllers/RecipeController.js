/**
*   Controlador responsable de las acciones realizadas en el módulo de recetas.
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 05/08/2015
*/

controllers.controller("RecipeController", ['$rootScope', '$scope', 'RecipeService', 'CategoryService', '$timeout', '$ionicActionSheet', '$stateParams', 'options', '$ionicModal', '$ionicPopup', '$translate', '$ionicPopup', '$filter', '$state',
	function($rootScope, $scope, RecipeService, CategoryService, $timeout, $ionicActionSheet, $stateParams, options, $ionicModal, $ionicPopup, $translate, $ionicPopup, $filter, $state) {
		console.log('$stateParams.categoryId: ', $stateParams.categoryId);
		console.log('$stateParams.recipeId: ', $stateParams.recipeId);
		init();
		// estructura base para un ingrediente de una receta
		$scope.ingredient = getEmptyIngredientRecipe();

		// estructura base para un paso de una receta
		$scope.step = getEmptyStepRecipe();

		// indica si se esta o no cargando una imagen principal
		$scope.loadingImage = false;

		if (options.action == 'list') {
			// se consultan los datos de la categoría
			$scope.category = CategoryService.detail($stateParams.categoryId);
			// se obtienen las recetas
			$scope.recipes = RecipeService.list($stateParams.categoryId);

			$scope.recipes.$loaded().then(function (data) {
				console.log('loaded data');
				console.log(data);
			});

			// modal que se usa para agregar una nueva receta.
			$ionicModal.fromTemplateUrl('templates/recipes/recipe-add.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				// instancia del modal para agregar recetas
				$scope.addRecipeModal = modal;
			});
		} else if (options.action == 'detail') {
			// se consulta el detalle de una receta
			$scope.recipe = RecipeService.detail($stateParams.categoryId, $stateParams.recipeId);
			console.log('recipe: ', $stateParams.recipeId)
			console.log($scope.recipe)
		}

		/**
		*	Función responsable de agregar una nueva receta
		*/
		$scope.newRecipe = function () {
			// verificamos si el usuario tiene permisos de escritura
			if ($scope.userHasWritePermissions()) {
				// se reinicia el lenguaje de contenidos
				$rootScope.lang = $rootScope.contentsLang;
				
				// se reinicia la estructura base para la nueva receta
				$scope.recipe = getEmptyRecipe();

				// se abre el modal para agregar la categoría
		    	$scope.addRecipeModal.show();
		    }
	    }

	    /**
	  	*	Función responsable de dar al usuario la posibilidad de cargar una imagen 
	  	*	ya sea cargandola desde el dispositivo o tomando una fotografía.
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
							$scope.recipe[$scope.lang].image = 'data:image/jpeg;base64,' + imageData;
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
									$scope.recipe[$scope.lang].image = base64Img;
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
	  	*	Función responsable de dar al usuario la posibilidad de cargar una imagen 
	  	*	ya sea cargandola desde el dispositivo o tomando una fotografía para asignarla 
	  	*	a un paso de la receta.
	  	*/
	  	$scope.getImageStep = function () {
	  		// opciones para la imagen de cada paso
	  		var options = {
	  			title: 'Imagen paso #' + ($scope.lodash.size($scope.recipe[$scope.lang].steps) + 1),
	  			fromTake: {
	  				/**
					*	Función que se ejecuta cuando la imagen es tomada
					*/
	  				callback: function(imageData) {
		  				// se valida que llegue información de la imagen
		  				if (!$scope.lodash.isEmpty(imageData)) {
							// se asigna al contexto la imagen tomada
							$scope.step[$scope.lang].image = 'data:image/jpeg;base64,' + imageData;
						}
					}
				},
				fromDevice: {
					/**
					*	Función que se ejecuta cuando la imagen es cargada desde el dispositivo
					*/
					callback: function (results) {
						// se valida si hay resultados
						if (!$scope.lodash.isEmpty(results)) {
							// se convierte la imagen seleccionada a base 64
							$scope.utilities.image.convertImgToBase64URL(results[0], function(base64Img) {
								// se asigna la imagen al contexto
								$scope.$apply(function () {
									$scope.step[$scope.lang].image = base64Img;
								});
							});
						}
					}
				}
	  		};

			// se ejecuta la funcionalidad para tomar / cargar una foto para asignarla como imagen de un paso
	  		$scope.setPicture(options);
	  	}

	  	/**
	  	*	Función responsable de mostrar el detalle de una receta para verla / editarla (Según los permisos)
	  	*/
	  	$scope.showRecipe = function (recipe) {
	  		console.log('showRecipe')
	  		console.log(recipe);
	  		// verificamos si el usuario tiene permisos de escritura
			if ($scope.userHasWritePermissions()) {
	  			// Show the action sheet
				var hideSheet = $ionicActionSheet.show({
					buttons: [
						{
							text: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_RECIPES.SEE')
						}, {
							text: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_RECIPES.EDIT')
						}
					],
					destructiveText: 'Eliminar',
					titleText: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_RECIPES.OPTIONS'),
					cancelText: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_RECIPES.CANCEL'),
					cancel: function() {
						// add cancel code..
						console.log('cancel!');
					},
					buttonClicked: function(index) {
						console.log(index);
						// verificamos si presiono la primera opcion: Ver Receta
						if (index === 0) {
							// se envia al usuario al detalle
							$state.go('app.category-recipes-detail', {
								categoryId: $stateParams.categoryId,
								recipeId: recipe.$id
							});
						} else if (index === 1) {
							// se reinicia el lenguaje de contenidos
							$rootScope.lang = $rootScope.contentsLang;

							// loading
							$scope.startLoading();

							// Editar receta, se consultan la info
				            $scope.recipe = RecipeService.detail($stateParams.categoryId, recipe.$id);

				            $scope.recipe.$loaded().then(function (data) {
				            	console.log('data');
				            	console.log(data);

				            	// se asigna la recepa al contexto
				            	$scope.recipe = data;
					            
				            	// end loading
								$scope.finishLoading();
								console.log('finish loading.......')
					            // se abre el modal para actualizar la receta
						    	$scope.addRecipeModal.show();
				            });

						}

						return true;
					},

					/**
					*	Función que se llama cuando el botón de eliminar es llamado
					*/
					destructiveButtonClicked: function (res) {
						console.log(res);
				  		// se busca el índice de la receta
				  		var index = $scope.lodash.indexOf($scope.recipes, recipe);
				  		console.log('remove: ', index)
				  		// validamos que la posición exista
				  		if (index > -1) {
				  			// se cierra el action sheet
							hideSheet();

				  			// se pide confirmación para eliminar el item
				  			var confirmPopup = $ionicPopup.confirm({
								title: $filter('translate')('NEW_RECIPE_OPT.CONFIG.DELETE_RECIPE'),
								template: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.DELETE_SURE_QUEST_CAT') + ' "' + recipe[$scope.lang].title + '"?'
							});

					  		// callback del confirm
							confirmPopup.then(function(res) {
								// se verifica si el usuario confirmó
								if (res) {
									// loading...
				  					$scope.startLoading();

									// se elimina el item
								    $scope.recipes.$remove(recipe).then(function (ref) {
								    	console.log('ref', ref);
								    	// se actualiza la cantidad de recetas por categoría
								    	updateRecipesSize(false);

								    	// end loading
								    	$scope.finishLoading();	

								    	// Se muestra el mensaje de éxito
					  					$scope.utilities.messages.showSimpleMessage($filter('translate')('NEW_RECIPE_OPT.CONFIG.RECIPE_DELETED'));
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
	  			// se envia al usuario al detalle
				$state.go('app.category-recipes-detail', {
					categoryId: $stateParams.categoryId,
					recipeId: recipeId
				});
	  		}	  		
	  	}

	  	/**
	  	*	Función responsable de almacenar / actualizar una receta
	  	*/
	  	$scope.saveRecipe = function () {
	  		// verificamos si el usuario tiene permisos de escritura
			if ($scope.userHasWritePermissions()) {
		  		// se valida que mínimo exista un ingrediente y un paso
		  		var checkIngredients = ($scope.lodash.size($scope.recipe[$scope.lang].ingredients) > 0);
		  		var checkSteps = ($scope.lodash.size($scope.recipe[$scope.lang].steps) > 0);
		  		 
		  		console.log('checkIngredients ', checkIngredients);
		  		console.log('checkSteps ', checkSteps);

		  		// validamos que el formulario sea válido
		  		if (checkIngredients && checkSteps) {
			  		// loading...
			  		$scope.startLoading();

			  		// se ejecuta cuando se agrega / actualiza una categoria
			  		var success = function() {
			  			// se incrementa el contador de recetas en la categoría
			  			updateRecipesSize(true);

			            // loading end
			  			$scope.finishLoading();

			  			// Se muestra el mensaje de éxito
			  			$scope.utilities.messages.showSimpleMessage($filter('translate')('GENERAL.CONFIG.ACTION_SHEET_RECIPES.SAVED'));

			  			// se cierra el modal despues de medio segundo
			  			$timeout(function () {
				            // se cierra el modal
				            $scope.addRecipeModal.hide();
			  			}, 800);
			        }

			  		// verificamos si se esta creando o actualizando
			  		if ($scope.lodash.isUndefined($scope.recipe.$id)) {
			  			// creando, se agrega
						$scope.recipes.$add($scope.recipe).then(success);
			  		} else {
			  			// actualizando
			  			$scope.recipe.$save().then(success);
			  		}
		  		}
		  	}
	  	}

	  	/**
	  	*	Función responsable de agregar un ingrediente a una receta.
	  	*/
	  	$scope.addIngredient = function () {
	  		console.log('add ingredient');

	  		if (!$scope.lodash.isEmpty($scope.ingredient[$scope.lang].name)) {
	  			// agregamos el ingrediente a la receta
				$scope.recipe[$scope.lang].ingredients.push($scope.ingredient[$scope.lang]);

				// se reinicia la estructura base para un ingrediente de una receta
				$scope.ingredient = getEmptyIngredientRecipe();
				console.log('add!')
			} else {
				console.log('fail to add');
			}
	  	}

	  	/**
	  	*	Función responsable de validar si un ingrediente ya existe en el listado.
	  	*	@param ingredient Objecto, ingrediente a validar.
	  	*	@return boolean, true cuando el ingrediente ya existe, false en caso contrario.
	  	*/
	  	$scope.existsIngredient = function () {
	  		// se suponse que el ingrediente no existe
	  		var exists = false;

	  		if ($scope.recipe[$scope.lang] && $scope.lodash.size($scope.recipe[$scope.lang].ingredients) > 0) {
		  		// se recorren los ingredientes para verificar si ya existe
				angular.forEach($scope.recipe[$scope.lang].ingredients, function (ingredient, key) {
					if (!exists && (ingredient.name.toLowerCase() == $scope.ingredient[$scope.lang].name.toLowerCase())) {
						exists = true;
					}
				});
	  		}

			return exists;
	  	}

	  	/**
	  	*	Función responsable de eliminar un ingrediente a una receta
	  	*/
	  	$scope.deleteIngredient = function (ingredient) {
	  		// se obtiene el índice del item
	  		var index = $scope.lodash.indexOf($scope.recipe[$scope.lang].ingredients, ingredient);
	  		console.log('remove: ', index)
	  		// validamos que la posición exista
	  		if (index > -1) {
			    $scope.recipe[$scope.lang].ingredients.splice(index, 1);
			}
	  	}

	  	/**
	  	*	Función responsable de agregar un paso a la receta
	  	*/
	  	$scope.addStep = function () {
	  		console.log('add step')
	  		// se agrega el paso al listado
	  		$scope.recipe[$scope.lang].steps.push($scope.step[$scope.lang]);

	  		// Se muestra el mensaje de éxito
	  		$scope.utilities.messages.showSimpleMessage($filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.STEP_CREATE'));

			// se reinicia la estructura base del paso
			$scope.step = getEmptyStepRecipe(true);
	  	}

	  	/**
	  	*	Función responsable de eliminar un paso de la receta
	  	*/
	  	$scope.deleteStep = function (step) {
	  		// se obtiene el índice del item
	  		var index = $scope.lodash.indexOf($scope.recipe[$scope.lang].steps, step);
	  		console.log('remove: ', index)
	  		// validamos que la posición exista
	  		if (index > -1) {
	  			// se realiza la confirmación para eliminar el item
		  		var confirmPopup = $ionicPopup.confirm({
					title: $filter('translate')('NEW_RECIPE_OPT.CONFIG.DELETE_STEP'),
					template: $filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.DELETE_SURE_QUEST_CAT') + ' "' + step.title + '"?'
				});

		  		// callback del confirm
				confirmPopup.then(function(res) {
					// se verifica si el usuario confirmó
					if (res) {
						// ok, se elimina el paso
						$scope.recipe[$scope.lang].steps.splice(index, 1);

						// Se muestra el mensaje de éxito
	  					$scope.utilities.messages.showSimpleMessage($filter('translate')('GENERAL.CONFIG.ACTION_SHEET_CATEGORIES.DELETE_OK'));
					}
				});			    
			}
	  	}

		/**
		*	Función responsable de marcar una receta para ver más tarde
		*/
		$scope.bookmarkRecipe = function () {

		}

		/**
		*	Función responsable de obtener la estructura base de una receta
		*/
		function getEmptyRecipe() {
			// estructura base de una receta
			var recipeBase = {
				title: '',
				subtitle: '',
				image: '',
				description: '',
				ingredients: [],
				steps: []
			};

			return {
				// receta en inglés
				en: angular.copy(recipeBase),
				// receta en español
				es: angular.copy(recipeBase)
			};
		}

		/**
		*	Función responsable de obtener la estructura base de un ingrediente para una receta
		*/
		function getEmptyIngredientRecipe() {
			// estructura base de un ingrediente para una receta
			var ingredientRecipeBase = {
				name: ''
			};

			return {
				en: angular.copy(ingredientRecipeBase),
				es: angular.copy(ingredientRecipeBase)
			};
		}

		/**
		*	Función responsable de obtener la estructura base de un paso para una receta.
		*	@param saved, indica si se acaba de guardar un paso de la receta.
		*/
		function getEmptyStepRecipe(saved) {
			// estructura base de unun paso para una receta
			var stepRecipeBase = {
				title: '',
				image: '',
				description: ''
			};

			// por defecto la informacion de los pasos es vacía en todos los idiomas
			var en = angular.copy(stepRecipeBase);
			var es = angular.copy(stepRecipeBase);

			// se verifica si se acaba de guardar un paso
			if (saved) {
				// verifico el idioma para resetear el paso
				switch ($scope.lang) {
					case CONSTANTS.LANGUAGES.EN:
						es = $scope.step.es
					break;

					case CONSTANTS.LANGUAGES.ES:
						en = $scope.step.en
					break;

					default:
						en = angular.copy(stepRecipeBase)
						es = angular.copy(stepRecipeBase)
					break;
				}
			}

			return {
				en: en,
				es: es
			};
		}		

		/**
		*	Función que se ejecuta cuando inicia el modulo
		*/
		function init() {
			console.log('options ', options);

			// opciones para el listado de ingredientes
			$scope.ingredientsListOptions = {
				showDelete: false,
				showReorder: false,
				type: 'list-inset',
				canSwipe: true,
				move: function(ingredientToMove, fromIndex, toIndex) {
					$scope.recipe[$scope.lang].ingredients.splice(fromIndex, 1);
					$scope.recipe[$scope.lang].ingredients.splice(toIndex, 0, ingredientToMove);
				}
			};

			// opciones para el listado de pasos
			$scope.stepsListOptions = {
				showDelete: false,
				showReorder: false,
				type: 'list-inset',
				canSwipe: true,
				move: function(stepToMove, fromIndex, toIndex) {
					$scope.recipe[$scope.lang].steps.splice(fromIndex, 1);
					$scope.recipe[$scope.lang].steps.splice(toIndex, 0, stepToMove);
				}
			};

			// se reinicia el lenguaje de contenidos
			$rootScope.lang = $rootScope.contentsLang;
			
			// estructura base para una receta
			$scope.recipe = getEmptyRecipe();

			// estructura base para un ingrediente de una receta
			$scope.ingredient = getEmptyIngredientRecipe();

			// estructura base para un paso de una receta
			$scope.step = getEmptyStepRecipe();

			// loading...
	  		$scope.startLoading();

			// verificamos si se esta usando el controlador para listar o para un detalle
			if (options.action === 'list') {
				// se consultan los datos de la categoría
				$scope.category = CategoryService.detail($stateParams.categoryId);

				// variable para manipular los 
				$scope.categoryData = CategoryService.category($stateParams.categoryId);

				// promesa que se cumple cuando ha cargado la categoría
				$scope.category.$loaded().then(function (data) {
					console.log('loaded category data');
					console.log(data);
					
					// Se asignan la categoría al contexto
					$scope.category = data;
				});

				// se obtienen las recetas
				$scope.recipes = RecipeService.list($stateParams.categoryId);

				// promesa que se cumple cuando ha terminado de cargar las recetas
				$scope.recipes.$loaded().then(function (data) {
					console.log('loaded recipes data');
					console.log(data);

					// Se asignan las recetas al contexto
					$scope.recipes = data;

					// end loading
					$scope.finishLoading();
				});

				// modal que se usa para agregar una nueva receta.
				$ionicModal.fromTemplateUrl('templates/recipes/recipe-add.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function(modal) {
					// instancia del modal para agregar recetas
					$scope.addRecipeModal = modal;
				});
			} else if (options.action === 'detail') {
				// se consulta el detalle de una receta
				$scope.recipe = RecipeService.detail($stateParams.categoryId, $stateParams.recipeId);

				// promesa que se cumple cuando ha terminado de cargar la receta
				$scope.recipe.$loaded().then(function (data) {
					console.log('loaded recipe data');
					console.log(data);
					
					// Se asignan las recetas al contexto
					$scope.recipe = data;

					// end loading
					$scope.finishLoading();
				});
			}
		}

		/**
		*
		*/
		function updateRecipesSize(increment) {
			// 
			$scope.categoryData.child('recipes_size').transaction(function (currentValue) {
				var newValue = 0;

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
					console.log('fail increment recipes_size')
				} else if (commited) {
					console.log('success recipes_size: %s', snapshot.val());
				}
			});
		}

	}
]);