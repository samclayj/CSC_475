angular.module('NavCtrl', []).controller('navController', [
'$scope',
'$rootScope',
'$state',
'auth',
function($scope, $rootScope, $state, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.navLinks = [];
  
  //Links for basic access (view only).
  var basicAccessLinks = [
    {sectionDescription: 'Accreditation Material'},
    {description: 'Courses', link:'/#/home'},
    {description: 'Objectives', link:'/#/home'},
    {description: 'Artifacts', link:'/#/home'},
  ];
  
  var facultyAccessLinks = [
    {sectionDescription: 'Meet Requirements'},
    {description: 'Your Courses', link:'/#/home'},
    {description: 'Your Objectives', link:'/#/home'},
    {description: 'Create Artifacts', link:'/#/home'},
  ];
  
  var adminAccessLinks = [
    {sectionDescription: 'Administration'},
    {description: 'Manage Users', link:'/#/manageUsers'},
    {description: 'Manage Assessments', link:'/#/home'},
    {description: 'Manage Courses', link:'/#/home'},
    {description: 'Manage Objectives', link:'/#/manageObjectives'},
    {description: 'Manage Artifacts', link:'/#/home'},
  ];
  
  var refreshLinks = function() {
      $scope.navLinks = [];
      $scope.navLinks.push.apply($scope.navLinks, basicAccessLinks);    

      if(auth.accountType() == 'Faculty') {
        $scope.navLinks.push.apply($scope.navLinks, facultyAccessLinks);  
      } 
      else if(auth.accountType() == 'Administration') {
        $scope.navLinks.push.apply($scope.navLinks, facultyAccessLinks);
        $scope.navLinks.push.apply($scope.navLinks, adminAccessLinks);
      }
  };
  
  //Refresh the links when a user registers or logs in.
  $rootScope.$on('linkRefreshEvent', function(event, args) {refreshLinks();});
  
  $scope.logOut = function() {
    $state.go('home');
    auth.logOut();
    refreshLinks();
  };
  
  refreshLinks();
  
}]);