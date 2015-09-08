// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    // libs
    'ionic',
    'firebase',
    'ngCordova',
    'ngLodash',
    'pascalprecht.translate',
    'ngMessages',

    // custom
    'starter.constants',
    'starter.controllers',
    'starter.directives',
    'starter.services',
    'starter.filters',
    'starter.utilities'
])

.run(function($ionicPlatform, $rootScope, lodash, $cordovaProgress, $translate, $cordovaGlobalization, utilities, $cordovaKeyboard) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        // indica si se esta o no realizando un proceso en la app
        $rootScope.isLoading = false;

        // utilidades de la app
        $rootScope.lodash = lodash;

        // utilidades propias de la app
        $rootScope.utilities = utilities;

        // indicadores de progreso
        $rootScope.progress = $cordovaProgress;

        // idoma por defecto para llenar los contenidos
        $rootScope.contentsLang = CONSTANTS.LANGUAGES.ES;

        // variable para manejar el idioma de los contenidos cuando se estan ingresando
        $rootScope.lang = CONSTANTS.LANGUAGES.ES;

        // Idioma por defecto de la app
        $rootScope.defaultLang = CONSTANTS.LANGUAGES.EN;

        // instancia de firebase
        $rootScope.firebase = new Firebase(CONSTANTS.FIREBASE.HOST);

        // datos del usuario autenticado (si existe). Se consulta en el almacenamiento local
        $rootScope.authUserData = angular.fromJson($rootScope.utilities.localStorage.getItem(CONSTANTS.LOCAL_STORAGE.AUTH_USER_DATA));

        // Globalization
        setTimeout(function(){ 
        $cordovaGlobalization.getPreferredLanguage().then(
            function(result) {
                var str = result.value;
                var res = str.split("-")[0];
                $translate.use(res);
                $rootScope.defaultLang = res;
            },
            function(error) {
              // error
              console.log('getPreferredLanguage: ', error);
          });
        }, 1000); 

    });

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {        
        console.log('$rootScope.authUserData');
        console.log($rootScope.authUserData);
        // se verifica si se oculta o no el accesorio del teclado
        // if (angular.isDefined(toState.hideAccessoryBar)) {
        //     $cordovaKeyboard.hideAccessoryBar(toState.hideAccessoryBar);
        // } else {
        //     $cordovaKeyboard.hideAccessoryBar(true);
        // }
    });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
    })

    // Each tab has its own nav history stack:
    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html'
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginController',
                hideAccessoryBar: false,
                isLogin: true
            }
        }
    })

    .state('app.categories', {
        url: '/categories',
        views: {
            'menuContent': {
                templateUrl: 'templates/categories/categories.html',
                controller: 'CategoryController'
            }
        }
    })

    .state('app.categories-recipes', {
        url: "/categories/:categoryId/recipes",
        views: {
            'menuContent': {
                templateUrl: "templates/recipes/recipes.html",
                controller: 'RecipeController',
                resolve: {
                    options: function() {
                        return {
                            action: 'list'
                        }
                    }
                }
            }
        }
    })

    .state('app.category-recipes-detail', {
        url: "/categoriesr/:categoryId/recipes/:recipeId",
        views: {
            'menuContent': {
                templateUrl: "templates/recipes/recipe-view.html",
                controller: 'RecipeController',
                resolve: {
                    options: function() {
                        return {
                            action: 'detail'
                        }
                    }
                }
            }
        }
    })

    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsController'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/categories');

    // implementacion del traductor
    $translateProvider.useStaticFilesLoader({
        prefix: 'json/language/',
        suffix: '.lang.json'
    });

    // se indica el idioma por defecto de la app
    $translateProvider.preferredLanguage(CONSTANTS.LANGUAGES.EN);

});