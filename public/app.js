angular.module('authorship', ['ngRoute'])
  //
  // .factory('graph', function(){
  //   return {build: function(){
  //
  //   }}
  // })
  .factory('graphFactory', function($http){
    var graph = {
      initDayNightPie: function(user, repo){
        var payload = {
            method: 'GET',
            url: 'https://api.github.com/repos/'+ user+'/' + repo + '/commits'
        }
        $http(payload).then(function(result){
            graph.commits = result.data
            graph.dayCommits.length = 0
            graph.nightCommits.length = 0
            result.data.forEach(function(commit){
              var dateStr = new Date(commit.commit.author.date).toLocaleTimeString()
              if(dateStr.substring(dateStr.length - 2).indexOf("AM") != -1){
                graph.dayCommits.push(commit.commit.committer.name)
              }else{
                graph.nightCommits.push(commit.commit.committer.name)
              }
            })
            console.log(graph.dayCommits)
            console.log(graph.nightCommits)
            graph.buildDayNightPie()
            graph.buildBarGraph()
        }, function(err){
            console.log(err)
        })
      },
      dayCommits: [],
      nightCommits: [],
      buildDayNightPie: function(){
        var dayCommitsPair = {
          label: "Day Commits",
          value: graph.dayCommits.length
        }
        var nightCommitsPair = {
          label: "Night Commits",
          value: graph.nightCommits.length
        }
        document.getElementById("dayNightPie").innerHTML = ''
          graph.pie = new d3pie("dayNightPie", {
            "data": {
              "content": [dayCommitsPair, nightCommitsPair]
            }
          });
      },
      buildBarGraph: function(){
        document.getElementById("barGraph").innerHTML = ''
        //home.factory = myFactory
     var margin = {top: 20, right: 20, bottom: 30, left: 40},
         width = 960 - margin.left - margin.right,
         height = 500 - margin.top - margin.bottom;

     var x = d3.scale.ordinal()
         .rangeRoundBands([0, width*0.9], .1);

     var y = d3.scale.linear()
         .rangeRound([height, 0]);

     var color = d3.scale.ordinal()
         .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

     var xAxis = d3.svg.axis()
         .scale(x)
         .orient("bottom");

     var yAxis = d3.svg.axis()
         .scale(y)
         .orient("left")
         .tickFormat(d3.format(".2s"));

         console.log('create svg')

     var svg = d3.select(document.getElementById("barGraph")).append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
       .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     var active_link = "0"; //to control legend selections and hover
     var legendClicked; //to control legend selections
     var legendClassArray = []; //store legend classes to select bars in plotSingle()
     var legendClassArray_orig = []; //orig (with spaces)
     var sortDescending; //if true, bars are sorted by height in descending order
     var restoreXFlag = false; //restore order of bars back to original




     //disable sort checkbox
     d3.select("label")
       .select("input")
       .property("disabled", true)
       .property("checked", false);

     console.log('make req');


     var map = {};
     //Bug fix: Bug, fix, error
     //Refactor: refactor, factor, change, modify, update, version, remove, delete
     //Feature: add, new, create
     //Other
     const bugFix = ["bug", "fix", "error"];
     const refactor = ["refactor", "factor", "change", "modify", "update", "version", "remove", "delete", "revert"];
     const feature = ["add", "new", "create", "feature"];

     // console.log("here")
     // console.log(myFactory.commits);
     var commitArr = graph.commits;
     commitArr.forEach(function(element) {
        if (element.author == null) {
            return;
        }
        var username = element.author.login;
        console.log(element.author.login)
        var message = element.commit.message;
        message = message.toLowerCase();

        if(!(username in map)){
            var item = [];
            item.bugFix = 0;
            item.refactor = 0;
            item.feature = 0;
            item.other = 0;
            map[username] = item;
        }
        var other = true;
        if(new RegExp(bugFix.join("|")).test(message)) {
            map[username]['bugFix'] += 1;
            other = false;
        }
        if(new RegExp(refactor.join("|")).test(message)) {
            map[username]['refactor'] += 1;
            other = false;
        }
        if(new RegExp(feature.join("|")).test(message)) {
            map[username]['feature'] += 1;
            other = false;
        }
        if(other) {
            map[username]['other'] += 1;
        }

     });
     console.log(map)

     //Column names of csv
     var colNames = "State"
     //Bug fix rows of csv
     var bugFixRow = "Bug fix"
     //Refactor rows of csv
     var refactorRow = "Refactor"
     //Feature rows of csv
     var featureRow = "Feature"
     //Other rows of csv
     var otherRow = "Other"

     var keys = Object.keys(map);
     keys.forEach(function(key) {
         console.log(key);
         colNames += ("," + key);
         bugFixRow += ("," + map[key]['bugFix']);
         refactorRow += ("," + map[key]['refactor']);
         featureRow += ("," + map[key]['feature']);
         otherRow += ("," + map[key]['other']);
     });


     var csvString = colNames + "\n" + bugFixRow + "\n" + refactorRow + "\n" + featureRow + "\n" + otherRow;

     console.log(csvString);

     var fileName = "state_data.csv";

     var data = d3.csv.parse(csvString);
     console.log(data);

     d3.csv(fileName, function(datee) {
       console.log('data', data)

       color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

       data.forEach(function(d) {
         var mystate = d.State; //add to stock code
         var y0 = 0;
         //d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
         d.ages = color.domain().map(function(name) {
           //return { mystate:mystate, name: name, y0: y0, y1: y0 += +d[name]}; });
           return {
             mystate:mystate,
             name: name,
             y0: y0,
             y1: y0 += +d[name],
             value: d[name],
             y_corrected: 0
           };
           });
         d.total = d.ages[d.ages.length - 1].y1;

       });

       //Sort totals in descending order
       data.sort(function(a, b) { return b.total - a.total; });

       x.domain(data.map(function(d) { return d.State; }));
       y.domain([0, d3.max(data, function(d) { return d.total; })]);

       svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis);

       svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
         .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end");
           //.text("Population");

       var state = svg.selectAll(".state")
           .data(data)
         .enter().append("g")
           .attr("class", "g")
           .attr("transform", function(d) { return "translate(" + "0" + ",0)"; });
           //.attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; })

        height_diff = 0;  //height discrepancy when calculating h based on data vs y(d.y0) - y(d.y1)
        state.selectAll("rect")
           .data(function(d) {
             return d.ages;
           })
         .enter().append("rect")
           .attr("width", x.rangeBand())
           .attr("y", function(d) {
             height_diff = height_diff + y(d.y0) - y(d.y1) - (y(0) - y(d.value));
             y_corrected = y(d.y1) + height_diff;
             d.y_corrected = y_corrected //store in d for later use in restorePlot()

             if (d.name === "Tommy") height_diff = 0; //reset for next d.mystate

             return y_corrected;
             // return y(d.y1);  //orig, but not accurate
           })
           .attr("x",function(d) { //add to stock code
               return x(d.mystate)
             })
           .attr("height", function(d) {
             //return y(d.y0) - y(d.y1); //heights calculated based on stacked values (inaccurate)
             return y(0) - y(d.value); //calculate height directly from value in csv file
           })
           .attr("class", function(d) {
             classLabel = d.name.replace(/\s/g, ''); //remove spaces
             return "bars class" + classLabel;
           })
           .style("fill", function(d) { return color(d.name); });

       state.selectAll("rect")
            .on("mouseover", function(d){

               var delta = d.y1 - d.y0;
               var xPos = parseFloat(d3.select(this).attr("x"));
               var yPos = parseFloat(d3.select(this).attr("y"));
               var height = parseFloat(d3.select(this).attr("height"))

               d3.select(this).attr("stroke","blue").attr("stroke-width",0.8);

               svg.append("text")
               .attr("x",xPos)
               .attr("y",yPos +height/2)
               .attr("class","tooltip")
               .text(d.name +": "+ delta);

            })
            .on("mouseout",function(){
               svg.select(".tooltip").remove();
               d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);

             })


       var legend = svg.selectAll(".legend")
           .data(color.domain().slice().reverse())
         .enter().append("g")
           .attr("class", function (d) {
             legendClassArray.push(d.replace(/\s/g, '')); //remove spaces
             legendClassArray_orig.push(d); //remove spaces
             return "legend";
           })
           .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

       //reverse order to match order in which bars are stacked
       legendClassArray = legendClassArray.reverse();
       legendClassArray_orig = legendClassArray_orig.reverse();

       legend.append("rect")
           .attr("x", width - 18)
           .attr("width", 18)
           .attr("height", 18)
           .style("fill", color)
           .attr("id", function (d, i) {
             return "id" + d.replace(/\s/g, '');
           })
           .on("mouseover",function(){

             if (active_link === "0") d3.select(this).style("cursor", "pointer");
             else {
               if (active_link.split("class").pop() === this.id.split("id").pop()) {
                 d3.select(this).style("cursor", "pointer");
               } else d3.select(this).style("cursor", "auto");
             }
           })
           .on("click",function(d){

             if (active_link === "0") { //nothing selected, turn on this selection
               d3.select(this)
                 .style("stroke", "black")
                 .style("stroke-width", 2);

                 active_link = this.id.split("id").pop();
                 plotSingle(this);

                 //gray out the others
                 for (i = 0; i < legendClassArray.length; i++) {
                   if (legendClassArray[i] != active_link) {
                     d3.select("#id" + legendClassArray[i])
                       .style("opacity", 0.5);
                   } else sortBy = i; //save index for sorting in change()
                 }

                 //enable sort checkbox
                 d3.select("label").select("input").property("disabled", false)
                 d3.select("label").style("color", "black")
                 //sort the bars if checkbox is clicked
                 d3.select("input").on("change", change);

             } else { //deactivate
               if (active_link === this.id.split("id").pop()) {//active square selected; turn it OFF
                 d3.select(this)
                   .style("stroke", "none");

                 //restore remaining boxes to normal opacity
                 for (i = 0; i < legendClassArray.length; i++) {
                     d3.select("#id" + legendClassArray[i])
                       .style("opacity", 1);
                 }


                 if (d3.select("label").select("input").property("checked")) {
                   restoreXFlag = true;
                 }

                 //disable sort checkbox
                 d3.select("label")
                   .style("color", "#D8D8D8")
                   .select("input")
                   .property("disabled", true)
                   .property("checked", false);


                 //sort bars back to original positions if necessary
                 change();

                 //y translate selected category bars back to original y posn
                 restorePlot(d);

                 active_link = "0"; //reset
               }

             } //end active_link check


           });

       legend.append("text")
           .attr("x", width - 24)
           .attr("y", 9)
           .attr("dy", ".35em")
           .style("text-anchor", "end")
           .text(function(d) { return d; });

       // restore graph after a single selection
       function restorePlot(d) {
         //restore graph after a single selection
         d3.selectAll(".bars:not(.class" + class_keep + ")")
               .transition()
               .duration(1000)
               .delay(function() {
                 if (restoreXFlag) return 3000;
                 else return 750;
               })
               .attr("width", x.rangeBand()) //restore bar width
               .style("opacity", 1);

         //translate bars back up to original y-posn
         d3.selectAll(".class" + class_keep)
           .attr("x", function(d) { return x(d.mystate); })
           .transition()
           .duration(1000)
           .delay(function () {
             if (restoreXFlag) return 2000; //bars have to be restored to orig posn
             else return 0;
           })
           .attr("y", function(d) {
             //return y(d.y1); //not exactly correct since not based on raw data value
             return d.y_corrected;
           });

         //reset
         restoreXFlag = false;

       }

       // plot only a single legend selection
       function plotSingle(d) {

         class_keep = d.id.split("id").pop();
         idx = legendClassArray.indexOf(class_keep);

         //erase all but selected bars by setting opacity to 0
         d3.selectAll(".bars:not(.class" + class_keep + ")")
               .transition()
               .duration(1000)
               .attr("width", 0) // use because svg has no zindex to hide bars so can't select visible bar underneath
               .style("opacity", 0);

         //lower the bars to start on x-axis
         state.selectAll("rect").forEach(function (d, i) {

           //get height and y posn of base bar and selected bar
           h_keep = d3.select(d[idx]).attr("height");
           y_keep = d3.select(d[idx]).attr("y");

           h_base = d3.select(d[0]).attr("height");
           y_base = d3.select(d[0]).attr("y");

           h_shift = h_keep - h_base;
           y_new = y_base - h_shift;

           //reposition selected bars
           d3.select(d[idx])
             .transition()
             .ease("bounce")
             .duration(1000)
             .delay(750)
             .attr("y", y_new);

         })

       }

       //adapted change() fn in http://bl.ocks.org/mbostock/3885705
       function change() {

         if (this.checked) sortDescending = true;
         else sortDescending = false;

         colName = legendClassArray_orig[sortBy];

         var x0 = x.domain(data.sort(sortDescending
             ? function(a, b) { return b[colName] - a[colName]; }
             : function(a, b) { return b.total - a.total; })
             .map(function(d,i) { return d.State; }))
             .copy();

         state.selectAll(".class" + active_link)
              .sort(function(a, b) {
                 return x0(a.mystate) - x0(b.mystate);
               });

         var transition = svg.transition().duration(750),
             delay = function(d, i) { return i * 20; };

         //sort bars
         transition.selectAll(".class" + active_link)
           .delay(delay)
           .attr("x", function(d) {
             return x0(d.mystate);
           });

         //sort x-labels accordingly
         transition.select(".x.axis")
             .call(xAxis)
             .selectAll("g")
             .delay(delay);


         transition.select(".x.axis")
             .call(xAxis)
           .selectAll("g")
             .delay(delay);
       }

     });

      }
    }

    return graph
  })


  .controller('primary', function($http, $location, $rootScope, graphFactory){
    var p = this;
    p.isLogin = function(){
      if ($location.path() == '/'){
        return true
      }
      return false
    }

    p.location = $location.path()
    console.log($location.path())

    p.sumOfContribution = 0;

    p.getRepos = function(user, callback){
      var myUser = user
      //Getting repos for p.user
      if (!user){

        myUser = p.user
      }
      $rootScope.user = p.user
      var payload = {
        method: 'GET',
        headers:{
          'Authorization': 'Basic ' + $rootScope.auth
        },
        url: 'https://api.github.com/users/'+ myUser +'/repos'
      }

      //if this is not used to find repos of p.user
      if (user){
        console.log("Getting repos for user")
        $http(payload).then(function(result){
          //console.log(result.data)
          p.contributors[user].repos = result.data
          console.log(p.contributors[user].repos)
          if (callback){
            callback()
          }
        }, function(err){
          console.log(err)
        })
      }else{
        $http(payload).then(function(result){
          p.repos = result.data
          console.log(result)
        }, function(err){
          console.log(err)
        })
      }
    }

    p.getAnalysis = function(){
      p.repoName = p.repo
      $rootScope.repo = p.repo
      p.getTopics()
      p.getContributors()
      graphFactory.initDayNightPie($rootScope.user, $rootScope.repo)
    }




    p.getTopics = function(){
      var payload = {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.mercy-preview+json',
          'Authorization': 'Basic ' + $rootScope.auth
        },
        url: 'https://api.github.com/repos/' + p.user + '/' + p.repo + '/topics'
      }
      $http(payload).then(function(result){
        p.topics = result.data.names
        console.log(result)
      }, function(err){
        console.log(err)
      })
    }


    p.getAllLanguages = function(user){
      // if (!user){
      //   user = p.user
      // }
      p.getRepos(user, function(){
        var repos = p.contributors[user].repos
        console.log(p.contributors[user].repos)
        repos.forEach(function(repo){
          var payload = {
            method: 'GET',
            headers:{
              'Authorization': 'Basic ' + $rootScope.auth
            },
            url: 'https://api.github.com/repos/' + user + '/' + repo.name + '/languages'
          }

          $http(payload).then(function(result){
            Object.keys(result.data).forEach(function(language){
              if (p.contributors[user].languages[language]){
                p.contributors[user].languages[language]++
              }else{
                p.contributors[user].languages[language] = 1
              }

            })

            //callback()
            // console.log('here')
            // // console.log(p.contributors)
            // Object.keys(p.contributors).forEach(function(contributor){
            //   console.log(contributor)
            // })

          }, function(err){
            console.log(err)
          })

        })
      })

    }

    p.getContributors = function(callback){

      console.log("here")
      var payload1 = {
        method: 'GET',
        headers:{
          'Authorization': 'Basic ' + $rootScope.auth
        },
        url: 'https://api.github.com/repos/' + p.user + '/' + p.repo + '/contributors'
      }

      //Get a list of contributors of the repo
      $http(payload1).then(function(result){
        p.contributors = {}
        result.data.forEach(function(contributorData){
          p.sumOfContribution = p.sumOfContribution + contributorData.contributions
          p.contributors[contributorData.login] = {}
          p.contributors[contributorData.login].name = contributorData.login
          p.contributors[contributorData.login].avatar = contributorData.avatar_url
          p.contributors[contributorData.login].contributions = contributorData.contributions
          p.contributors[contributorData.login].repos = []
          p.contributors[contributorData.login].languages = {}
        })

        console.log(p.contributors)
    }, function(err){
      console.log(err)
    })

  }





    // var colors = ['#ff0000', '#00ff00', '#0000ff'];
    // var random_color = colors[Math.floor(Math.random() * colors.length)];
    // document.getElementById('title').style.color = random_color;



  })


  .controller('loginCtrl', function($http, $window, $location, $rootScope){
    var l = this;
    l.error = false
    l.login = function(){
      console.log(l.username + ':' + l.password)
      var b = encodeURIComponent(window.btoa(l.username + ':' + l.password))
      var encodedAuth = b.toString('base64')
      console.log(encodedAuth)

      var payload = {
        method:"GET",
        url:'https://api.github.com/user',
        headers:{
          'Authorization' : 'Basic ' + encodedAuth
        }
      }

      $http(payload).then(function(result){
        console.log(result)
        if(result.status == 200){
          l.error = false;
          $rootScope.auth = encodedAuth
          $window.location.href = "../#/home";
        }else{
          l.error = true
          console.log(l.error)
        }
      },function(err){
        l.error = true;
        console.log(err)
      })

    }
  })

  .config(function($routeProvider) {
    $routeProvider
   .when('/home', {
     templateUrl: 'home.html'
   })
    .when('/about', {
      templateUrl: 'about.html',
    })
    .when('/collaborators', {
      templateUrl: 'collaborators.html',
      // controller: 'graphCtrl',
      // controllerAs: 'g'
    })
    .when('/', {
      templateUrl: 'login.html',
      controller: 'loginCtrl',
      controllerAs: 'l'
    });
})
