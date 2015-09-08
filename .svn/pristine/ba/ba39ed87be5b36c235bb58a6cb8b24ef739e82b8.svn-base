/**
*   Servicio encargado de obtener la información de las categorías de las recetas.
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 31/07/2015
*/

services.factory("CategoryService", ['$firebaseArray', '$firebaseObject',
	function($firebaseArray, $firebaseObject) {

		var factory = {
			/**
			*	Lista de categorías
			*/
			list: function () {
				// se consultan las categorías
				var categories = new Firebase(CONSTANTS.FIREBASE.HOST + "/" + CONSTANTS.FIREBASE.COLLECTIONS.CATEGORIES);

				return $firebaseArray(categories);
			}, 
			
			/**			
			*	Detalle de una categoría
			*/
			detail: function (categoryId) {
				// se consulta la categoría
				var category = new Firebase(CONSTANTS.FIREBASE.HOST + "/" + CONSTANTS.FIREBASE.COLLECTIONS.CATEGORIES + "/" + categoryId);

				return $firebaseObject(category);
			}, 

			/**
			*	Colecciones de la app
			*/
			category: function (categoryId) {
				// se consulta la categoría
				var category = new Firebase(CONSTANTS.FIREBASE.HOST + "/" + CONSTANTS.FIREBASE.COLLECTIONS.CATEGORIES + "/" + categoryId);

				return category;
			}
		};
		
		return factory;
	}
])