/*
  Import all Angular components via ES6 imports and register them
  at your module via their corresponding functions (controller, service, etc.).
*/

import ButtonsCtrl from './controllers/ButtonsCtrl';
import SensorCtrl from './controllers/SensorCtrl';
import ModelService from './services/ModelService';
import sensorFilter from './filters/sensorFilter';
import labelFilter from './filters/labelFilter';

angular.module('myApp', ['ui.bootstrap', 'ui.router', 'timer'])
	.service('ModelService', ModelService)
	.controller('ButtonsCtrl', ButtonsCtrl)
	.controller('SensorCtrl', SensorCtrl)
	.filter('sensor', sensorFilter)
	.filter('label', labelFilter)
	.service('sharedConfig', function () {
        var config = {};

        return {
            getConfig: function () {
                return config;
            },
            setConfig: function(value) {
                config = value;
            }
        };
	 })
	.config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
  function($httpProvider, $stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('collect', {
        url: '/collect',
        templateUrl: 'collect.html',
        controller: 'ButtonsCtrl'
      })
      .state('sensor', {
        url: '/sensor',
        templateUrl: 'sensor.html',
        controller: 'SensorCtrl',
      });

    $urlRouterProvider.otherwise('/collect');
  }
]);