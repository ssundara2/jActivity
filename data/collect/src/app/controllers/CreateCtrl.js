/*
	Copyright 2016 KIT Institute for Telematics TecO - David Greiner
	This file is subject to the terms and conditions defined in
	file 'LICENSE', which is part of this source code package.
*/

export default function($scope, $filter, $location, ModelService, host, sharedConfig) {
  'ngInject';
  /* Parse UserAgent using darcyclarke/Detect.js */
  $scope.ua = detect.parse(navigator.userAgent);

  /* Get Features using AJAX and generate sensor dependency list */
  $scope.features = [];
  $scope.sensors = [];

  ModelService.getFeatures().then(function(data) {
    $scope.features = data.data;
    $scope.sensors = $filter('feature')($scope.features.sensors);
  });

  /* Watch for newly selected features and change sensor depency list accordingly */
  $scope.$watch('features', function(newVal, oldVal, scope) {
    $scope.sensors = $filter('feature')($scope.features.sensors);
  }, true);


  /* Get Labels and prepare them using mbenford/ngTagsInput */
  $scope.labels = [];

  $scope.loadLabels = function($query) {
    return ModelService.getLabels().then(function(response) {
	  const series = response.data.results[0].series;
      //var labels = response.data;
      var data = [].concat.apply([], series.map(e=>e.values.filter(x=>x[0]==='label').map(x=>x[1]))).filter((e,i,s)=>s.indexOf(e)===i);
      //const labels = [];
      //var labels = series.map(e=>e.values.filter(x=>x[0]==='label').map(x=>x[1])).reduce((a,b)=>a.IndexOf(b)<0?a.concat(b):a);
      var labels = data.map(e=> ({name:e}));
	  //series.forEach(e => e.values.forEach(v => { if (v[0] === 'label' && labels.indexOf(v[1]) === -1) labels.push({name: v[1]});}));
      return labels.filter(function(label) {
        return label.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };

}