angular.module('mainApp').directive('navBar', navBar);

function navBar() {
  return {
    restrict: 'E',
    templateUrl: 'navigation/nav-bar-directive/nav-bar.html'
  };
}