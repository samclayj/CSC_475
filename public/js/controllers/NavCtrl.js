angular.module('NavCtrl', []).controller('NavController', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
  $scope.navLinks = [];
  
  //Links for basic access (view only).
  var basicAccessLinks = [
    {sectionDescription: 'View Accreditation Material'},
    {description: 'Courses', link:'/#/home'},
    {description: 'Objectives', link:'/#/home'},
    {description: 'Artifacts', link:'/#/home'},
  ];
  
  var facultyAccessLinks = [
    {sectionDescription: 'Meet requirements'},
    {description: 'Your Courses', link:'/#/home'},
    {description: 'Your Objectives', link:'/#/home'},
    {description: 'Create Artifacts', link:'/#/home'},
  ];
  
  var adminAccessLinks = [
    {sectionDescription: 'Administration'},
    {description: 'Manage Users', link:'/#/manageUsers'},
    {description: 'Manage Assessments', link:'/#/home'},
    {description: 'Manage Courses', link:'/#/home'},
    {description: 'Manage Objectives', link:'/#/home'},
    {description: 'Manage Artifacts', link:'/#/home'},
  ];
  
  $scope.navLinks.push.apply($scope.navLinks, basicAccessLinks);    

  if(auth.accountType() == 'Faculty') {
    $scope.navLinks.push.apply($scope.navLinks, facultyAccessLinks);  
  } 
  else if(auth.accountType() == 'Administration') {
    $scope.navLinks.push.apply($scope.navLinks, facultyAccessLinks);
    $scope.navLinks.push.apply($scope.navLinks, adminAccessLinks);
  }
  
  
}]);