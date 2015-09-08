/**
 *  Fábrica que contiene utilidades generales para uso en toda la aplicación.
 *
 *	@author Sebastián Lara <jlara@kijho.com>
 *
 *	@created 19/08/2015
 */

var utilities = angular.module('starter.utilities', []);

utilities.factory('utilities', ['$rootScope', '$ionicLoading',
    function($rootScope, $ionicLoading) {
    
        var utilities = {
            image: {
                /**
                * Convert an image 
                * to a base64 url
                * @param  {String}   url         
                * @param  {Function} callback    
                * @param  {String}   [outputFormat=image/png]
                */
                convertImgToBase64URL: function (url, callback, outputFormat){
                    var img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = function(){
                        var canvas = document.createElement('CANVAS'),
                        ctx = canvas.getContext('2d'), dataURL;
                        canvas.height = this.height;
                        canvas.width = this.width;
                        ctx.drawImage(this, 0, 0);
                        dataURL = canvas.toDataURL(outputFormat);
                        callback(dataURL);
                        canvas = null; 
                    };
                    img.src = url;
                }                
            },

            messages: {

                showSimpleMessage: function(message) {
                    console.log('message: %s', message);
                    // si en las opciones llega un mensaje, este se asigna al contexto global
                    if (!$rootScope.lodash.isEmpty(message)) {
                        $rootScope.infoDialog = message;
                        
                        // se muestra el dialogo.
                        $ionicLoading.show({
                            template: '<b>' + message + '</b>',
                            duration: 3000,
                        });
                    }
                },
            },

            /**
            *   Utilidades para el almacenamiento local
            */
            localStorage : {
                /**
                *   Función responsable de verificar si el almacenamiento local html5 
                *   esta disponible.
                */
                isSupport : function () {
                    try {
                        return (('localStorage' in window) && (window['localStorage'] !== null));
                    } catch (e) {
                        return false;
                    }
                },

                /**
                *   Función responsable de crear un nuevo item en el "local storage"
                */
                addItem : function(key, value) {
                    // se asume el peor de los casos
                    var result = false;

                    if ($rootScope.lodash.isString(key) && !$rootScope.lodash.isEmpty(value)) {
                        localStorage.setItem(key, value);
                        result = true;
                    }

                    return result;
                },

                /**
                *   Función responsable de obtener el valor de una variable del 
                *   "local storage" por su llave
                **/
                getItem : function (key) {
                    var result = null;

                    if ($rootScope.lodash.isString(key)) {
                        result = localStorage.getItem(key);
                    }

                    return result;
                },

                /**
                *   Función responsable de eliminar un item del "local storage"
                */
                removeItem : function (key) {
                    var result = null;

                    if ($rootScope.lodash.isString(key)) {
                        localStorage.removeItem(key);
                        result = true;
                    }

                    return result;
                },

                /**
                *   Función responsable de obtener todos items almacenados
                *   en el "local storage".
                */
                viewItems : function() {

                },

                /**
                *   Función responsable de obtener todos items almacenados
                *   en el "local storage".
                */
                clear : function() {
                    localStorage.clear();
                }

            },
            
        };

        return utilities;      
    }
]);
