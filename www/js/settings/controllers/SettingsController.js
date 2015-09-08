/**
*   Controlador responsable de las acciones realizadas en el módulo de settings.
*
*   @author: Alejandro Castaño <acastano@kijho.com>
*   
*   @date: 11/08/2015
*/

controllers.controller("SettingsController", ['$rootScope', '$scope', '$rootScope', '$translate', '$state',
	function($rootScope, $scope, $rootScope, $translate, $state) {

	$scope.radioChoiceLanguage = [
	    { text: "Español", value: "es" },
	    { text: "English", value: "en" }
	];

	$scope.dataLang = {
	    radioChoice: $rootScope.defaultLang
	};

	console.log('$rootScope.defaultLang: ', $rootScope.defaultLang);
	// Función que determina el idiona de la aplicación.
	$scope.selectLanguage = function (idLang) {
        $translate.use(idLang);
        $rootScope.defaultLang = idLang;
    }

}]);