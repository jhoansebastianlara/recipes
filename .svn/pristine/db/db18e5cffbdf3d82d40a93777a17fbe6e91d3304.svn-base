/**
*   Script que contiene los filtros de la aplicación.
*
*   @author: Sebastián Lara <jlara@kijho.com>
*   
*   @date: 05/08/2015
*/

var filters = angular.module('starter.filters', []);

filters.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);
