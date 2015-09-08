/**
*   Módulo que encapsula los servicios de la aplicación.
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 31/07/2015
*/

var services = angular.module('starter.services', []);

/**
*   Servicio general de la aplicación.
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 26/08/2015
*/

services.factory("AppService", ['$firebaseArray', '$firebaseObject',
	function($firebaseArray, $firebaseObject) {

		var factory = {
			/**
			*	Colecciones de la app
			*/
			collections: function () {
				// se consultan las colecciones
				var collections = new Firebase(CONSTANTS.FIREBASE.HOST + "/" + CONSTANTS.FIREBASE.COLLECTIONS.APP + "/" + CONSTANTS.FIREBASE.COLLECTIONS.COLLECTIONS);

				return collections;
			}
			
		};
		
		return factory;
	}
]);
