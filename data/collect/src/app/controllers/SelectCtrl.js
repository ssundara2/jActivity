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
    $scope.features = data;
    $scope.sensors = $filter('feature')($scope.features.data);
  });

  /* Watch for newly selected features and change sensor depency list accordingly */
  $scope.$watch('features', function(newVal, oldVal, scope) {
    $scope.sensors = $filter('feature')($scope.features.data);
  }, true);


  /* Get Labels and prepare them using mbenford/ngTagsInput */
  $scope.labels = [];

  $scope.loadLabels = function($query) {
    return ModelService.getLabels().then(function(response) {
      var labels = response.data;
      return labels.filter(function(label) {
        return label.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };

  /* Advance to collect page */
  $scope.next = function() {
    /* Add new labels to database */
    var labels = [];
    $scope.labels.forEach(function(label, index) {
      /* Label variable is undefined for new labels */
      if (typeof label.label === 'undefined') {
        /* Generate machine-readable string as identifier (only alphanumeric with dash) */
        $scope.labels[index].label = label.name.replace(/([^a-z0-9]+)/gi, '-').toLowerCase();
        var data = {
          label: label.label,
          name: label.name
        };
        /* Send new label to database */
        var json = JSON.stringify(data);
        if (json !== '{}') {
          var req = new XMLHttpRequest();
          req.open('POST', "http://" + host + "/api/labels");
          req.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
          req.send(json);
        }
      }
      /* Push each defined label on array */
      labels.push(label.label);
    });

    /* Only pass on selected features */
    var features = $filter('filter')($scope.features.data, {
      value: true
    });

    sharedConfig.setConfig(features, labels);
    $location.path("/collect");
  };

}
