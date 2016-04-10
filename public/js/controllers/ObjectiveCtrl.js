// public/js/controllers/MainCtrl.js
angular.module('ObjectiveCtrl', []).controller('ObjectiveController', [
  '$scope',
  'auth',
  '$state',
  'objectiveService',
  'currentObjective',
  function($scope, auth, $state, objectiveService, currentObjective) {
    //Authentication from auth controller
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.state = $state;
 $scope.testModal = false;
    
    $scope.newObjective = {};


    $scope.objective = {};
    $scope.objective = angular.copy(currentObjective);

    
    $scope.allObjectives = objectiveService.allObjectives;
    
    $scope.addNewOutcome = false;
    $scope.editOutcomes = false;
    $scope.outcome = {};
    
    //Current user will be null unless a user is being edited.
    $scope.editingObjective = currentObjective != null;
    
    $scope.editObjective = function (id) {
     $state.go('editObjective', { "id": id});
    };
    
    $scope.manageObjectiveOutcomes = function (id) {
     $state.go('manageObjectiveOutcomes', { "id": id});
    };
    
    $scope.addObjective = function () {
     $state.go('addObjective');
    };
    
    $scope.toggleAddOutcome = function () {
      if($scope.addNewOutcome === true) {
        $scope.addNewOutcome = false;
      } else {
        $scope.addNewOutcome = true;
      }
    };
    
    $scope.toggleEditOutcomes = function () {
      if($scope.editOutcomes === true) {
        $scope.editOutcomes = false;
      } else {
        $scope.editOutcomes = true;
      }
    };
    
    $scope.submitObjectiveData = function() {
      //if(!$scope.title || $scope.title === '') { return; }
      
      if($scope.editingObjective) {
          //If the user is being edited, call the update.
          objectiveService.updateObjective($scope.newObjective).error(function(error) {
            $scope.error = error;
          }).then(function() {
           //Objective uodated successfully.
          });
      } else {
          //Otherwise, add a new objective.
          objectiveService.create($scope.newObjective);
      }
      
    };
    
    $scope.deleteObjective = function (id) {
      objectiveService.deleteObjective(id);
      
      if($scope.allObjectives.length === 1) {
        $scope.allObjectives = {};
        $scope.toggleEditOutcomes();
      } else {
        $scope.allObjectives = $scope.allObjectives.filter(function(obj) {
          return obj._id === id;
        });
      }
    };
    
    $scope.deleteOutcome = function (id) {
      objectiveService.deleteOutcome(id);
      if($scope.objective.outcomes.length === 1) {
        $scope.objective.outcomes = {};
        $scope.toggleEditOutcomes();
      } else {
        $scope.objective.outcomes = $scope.objective.outcomes.filter(function(obj) {
          return obj._id === id;
        });
      }
    };
    
    $scope.backToObjectiveManage = function () {
     $state.go('manageObjectives');
    };
    
    $scope.submitOutcomeData = function() {
      objectiveService.addOutcome($scope.objective._id, $scope.outcome).success(function(outcome) {
        $scope.objective.outcomes.push(outcome);
      });
      $scope.outcome = {};
      $scope.toggleAddOutcome();
    };
    
    $scope.testModal = function() {
      $scope.testModal = true;
    }
    
}]);


