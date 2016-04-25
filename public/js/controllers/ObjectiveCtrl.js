// public/js/controllers/MainCtrl.js
angular.module('ObjectiveCtrl', []).controller('ObjectiveController', [
  '$scope',
  'auth',
  '$state',
  'Upload',
  'objectiveService',
  'currentObjective',
  function($scope, auth, $state, Upload, objectiveService, currentObjective) {
    //Authentication from auth controller
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.state = $state;
    
    $scope.newObjective = {};
    $scope.newObjective = angular.copy(currentObjective);

    
    $scope.allObjectives = objectiveService.allObjectives;
    
    $scope.addNewOutcome = false;
    $scope.editOutcomes = false;
    
    $scope.addAssessmentMethod = false;
    $scope.assessmentFormPage2 = false;
    
    $scope.viewArtifacts = false;
    $scope.addArtifact = false;

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
    
    $scope.toggleAddAssessment = function () {
      if($scope.addAssessmentMethod === true) {
        $scope.addAssessmentMethod = false;
      } else {
        $scope.addAssessmentMethod = true;
      }
    };
    
    $scope.toggleViewArtifacts = function () {
      if($scope.viewArtifacts === true) {
        $scope.viewArtifacts = false;
      } else {
        $scope.viewArtifacts = true;
      }
    };
    
    $scope.toggleAddArtifact = function () {
      if($scope.addArtifact === true) {
        $scope.addArtifact = false;
      } else {
        $scope.addArtifact = true;
      }
    };
    
    $scope.goToAssessmentFormPage2 = function () {
      $scope.assessmentFormPage2 = true;
    };
    
    $scope.goToAssessmentFormPage1 = function () {
      $scope.assessmentFormPage2 = false;
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
    
    $scope.deleteOutcome = function (id, title) {
      objectiveService.deleteOutcome(id);
      if($scope.newObjective.outcomes.length === 1) {
        $scope.newObjective.outcomes = {};
        $scope.toggleEditOutcomes();
      } else {
        $scope.newObjective.outcomes = $scope.newObjective.outcomes.filter(function(obj) {
          return obj._id != id;
        });
      }
    };
    
    $scope.backToObjectiveManage = function () {
     $state.go('manageObjectives');
    };
    
    $scope.submitOutcomeData = function() {
      objectiveService.addOutcome($scope.newObjective._id, $scope.outcome).success(function(outcome) {
        $scope.newObjective.outcomes.push(outcome);
      });
      $scope.outcome = {};
      $scope.toggleAddOutcome();
    };
    
}]);


