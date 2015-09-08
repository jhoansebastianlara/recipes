/**
*   Servicio encargado de obtener la información relacionada a las recetas.
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 05/08/2015
*/

services.factory("RecipeService", ['$firebaseArray', '$firebaseObject',
	function($firebaseArray, $firebaseObject) {

		var factory = {
			/**
			*	Lista de recetas
			*/
			list: function (categoryId) {
				// se consultan las recetas
				var recipes = new Firebase(CONSTANTS.FIREBASE.HOST + "/" + CONSTANTS.FIREBASE.COLLECTIONS.RECIPES + "/" + categoryId);

				return $firebaseArray(recipes);
			}, 
			
			/**
			*	Detalle de una receta
			*/
			detail: function (categoryId, recipeId) {
				// se consulta la receta
				var category = new Firebase(CONSTANTS.FIREBASE.HOST + "/" + CONSTANTS.FIREBASE.COLLECTIONS.RECIPES + "/" + categoryId + "/" + recipeId);

				return $firebaseObject(category);
			}, 
		};
		
		return factory;
	}
]);
