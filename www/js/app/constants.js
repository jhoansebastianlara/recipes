/**
*   Script que contiene las constantes de la aplicación.
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 31/07/2015
*/

var constants = angular.module('starter.constants', []);

var CONSTANTS = {
    /**
    *   BAAS
    */	
	FIREBASE: {
        /**
        *   Host de conexión a Firebase
        */
        HOST: 'https://recipeskijho.firebaseio.com',

        /**
        *	Colecciones de la base de datos
        */
        COLLECTIONS: {
            CATEGORIES: 'categories',
        	RECIPES: 'recipes',
            APP: 'app',
            COLLECTIONS: 'collections'
        }
	},

    /**
    *   Constantes para el almacenamiento local
    */
    LOCAL_STORAGE: {
        AUTH_USER_DATA: 'auth_user_data'
    },

    LANGUAGES: {
        ES: 'es',
        EN: 'en'
    }

    
};

// constantes de la aplicación
constants.constant('CONSTANTS', CONSTANTS);

/********* Plugins instalados *************/
/*
*
* cordova plugin add cordova-plugin-globalization --> Plugin para la globalización.
*
* cordova plugin add https://github.com/pbernasconi/cordova-progressIndicator.git --> Resultado del progreso.
*
*/
