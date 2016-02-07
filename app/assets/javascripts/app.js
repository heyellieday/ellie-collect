var app = angular.module('app', ['ngResource']);

app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
      		scope.$apply(read);
      });
    }
  };
});

app.run(['$rootScope', '$sce', function($rootScope, $sce){


  $rootScope.currentUser = window.currentUser;

  $rootScope.signedIn = function(){
  	return $rootScope.currentUser != null;
  };

  $rootScope.userCanAccess = function(object){
  	return (object.attributes != null && object.attributes.uid != null && $rootScope.signedIn && object.attributes.uid != null && object.attributes.uid == $rootScope.currentUser.uid);
  };

}]);

app.config(['$httpProvider', function($httpProvider) {
  //$httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
}]);

$(document).on('ready page:load', function() {
  return angular.bootstrap(document.body, ['app']);
});