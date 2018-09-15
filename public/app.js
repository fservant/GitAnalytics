angular.module('authorship', [])
  .controller('primary', function($http, $timeout){
    var p = this;
    p.focus = false;
    p.test = function(event){
      console.log(event)
    }

    p.getRepos = function(){
      var payload = {
        method: 'GET',
        url: 'https://api.github.com/users/'+ p.user +'/repos'
      }
      $http(payload).then(function(result){
        p.repos = result.data
        console.log(result)
      }, function(err){
        console.log(err)
      })
    }

    // p.getCommits = function(){
    //   var payload = {
    //     method: 'GET',
    //     url: 'https://api.github.com/repos/'+ p.user +'/' + p.repo + '/commits'
    //   }
    //   $http(payload).then(function(result){
    //     p.commits = result.data
    //     console.log(result)
    //   }, function(err){
    //     console.log(err)
    //   })
    // }
  })
