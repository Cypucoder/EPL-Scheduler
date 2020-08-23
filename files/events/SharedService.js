angular.module('sharedService', []).factory('SharedService', function() {

  var SharedService;

  SharedService = (function() {

    function SharedService() {
      /* method code... */
    }

    SharedService.prototype.setData = function(name, data) {
      /* method code... */
    };
    return SharedService;

  })();

  if (typeof(window.angularSharedService) === 'undefined' || window.angularSharedService === null) {
    window.angularSharedService = new SharedService();
  }
  return window.angularSharedService;});
  /* now you can share the service data between two apps */
  //angular.module("app1", ['sharedService'])
    /* module code */
  //angular.module("app2", ['sharedService'])
    /* module code */