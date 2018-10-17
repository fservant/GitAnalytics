angular.module('authorship', ['ngRoute'])
  //
  // .factory('graph', function(){
  //   return {build: function(){
  //
  //   }}
  // })

  .controller('homeCtrl', function(){

    var home = this;

    //////////////////////////////D3 Code Begins////////////////////////////////////////////////////////////////////
    var w = 600;                        //width
    var h = 500;                        //height
    var padding = {top: 40, right: 40, bottom: 40, left:40};
    var dataset;
    //Set up stack method
    var stack = d3.layout.stack();

    d3.json("mperday.json",function(json){
      dataset = json;

      //Data, stacked
      stack(dataset);

      var color_hash = {
          0 : ["Invite","#1f77b4"],
          1 : ["Accept","#2ca02c"],
          2 : ["Decline","#ff7f0e"]

      };


      //Set up scales
      var xScale = d3.time.scale()
        .domain([new Date(dataset[0][0].time),d3.time.day.offset(new Date(dataset[0][dataset[0].length-1].time),8)])
        .rangeRound([0, w-padding.left-padding.right]);

      var yScale = d3.scale.linear()
        .domain([0,
          d3.max(dataset, function(d) {
            return d3.max(d, function(d) {
              return d.y0 + d.y;
            });
          })
        ])
        .range([h-padding.bottom-padding.top,0]);

      var xAxis = d3.svg.axis()
               .scale(xScale)
               .orient("bottom")
               .ticks(d3.time.days,1);

      var yAxis = d3.svg.axis()
               .scale(yScale)
               .orient("left")
               .ticks(10);



      //Easy colors accessible via a 10-step ordinal scale
      var colors = d3.scale.category10();

      //Create SVG element
      var svg = d3.select("#mbars")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

      // Add a group for each row of data
      var groups = svg.selectAll("g")
        .data(dataset)
        .enter()
        .append("g")
        .attr("class","rgroups")
        .attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
        .style("fill", function(d, i) {
          return color_hash[dataset.indexOf(d)][1];
        });

      // Add a rect for each data value
      var rects = groups.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("width", 2)
        .style("fill-opacity",1e-6);


      rects.transition()
           .duration(function(d,i){
             return 500 * i;
           })
           .ease("linear")
          .attr("x", function(d) {
          return xScale(new Date(d.time));
        })
        .attr("y", function(d) {
          return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
        })
        .attr("height", function(d) {
          return -yScale(d.y) + (h - padding.top - padding.bottom);
        })
        .attr("width", 15)
        .style("fill-opacity",1);

        svg.append("g")
          .attr("class","x axis")
          .attr("transform","translate(40," + (h - padding.bottom) + ")")
          .call(xAxis);


        svg.append("g")
          .attr("class","y axis")
          .attr("transform","translate(" + padding.left + "," + padding.top + ")")
          .call(yAxis);

        // adding legend

        var legend = svg.append("g")
                .attr("class","legend")
                .attr("x", w - padding.right - 65)
                .attr("y", 25)
                .attr("height", 100)
                .attr("width",100);

        legend.selectAll("g").data(dataset)
            .enter()
            .append('g')
            .each(function(d,i){
              var g = d3.select(this);
              g.append("rect")
                .attr("x", w - padding.right - 65)
                .attr("y", i*25 + 10)
                .attr("width", 10)
                .attr("height",10)
                .style("fill",color_hash[String(i)][1]);

              g.append("text")
               .attr("x", w - padding.right - 50)
               .attr("y", i*25 + 20)
               .attr("height",30)
               .attr("width",100)
               .style("fill",color_hash[String(i)][1])
               .text(color_hash[String(i)][0]);
            });

        svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 - 5)
        .attr("x", 0-(h/2))
        .attr("dy","1em")
        .text("Number of Commits");

      svg.append("text")
         .attr("class","xtext")
         .attr("x",w/2 - padding.left)
         .attr("y",h - 5)
         .attr("text-anchor","middle")
         .text("Days");

      svg.append("text")
          .attr("class","title")
          .attr("x", (w / 2))
          .attr("y", 20)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text("Number of Commits Per Day");

      //On click, update with new data
      d3.selectAll(".m")
        .on("click", function() {
          var date = this.getAttribute("value");

          var str;
          if(date == "2014-02-19"){
            str = "19.json";
          }else if(date == "2014-02-20"){
            str = "20.json";
          }else if(date == "2014-02-21"){
            str = "21.json";
          }else if(date == "2014-02-22"){
            str = "22.json";
          }else{
            str = "23.json";
          }

          d3.json(str,function(json){

            dataset = json;
            stack(dataset);

            console.log(dataset);

            xScale.domain([new Date(0, 0, 0,dataset[0][0].time,0, 0, 0),new Date(0, 0, 0,dataset[0][dataset[0].length-1].time,0, 0, 0)])
            .rangeRound([0, w-padding.left-padding.right]);

            yScale.domain([0,
                    d3.max(dataset, function(d) {
                      return d3.max(d, function(d) {
                        return d.y0 + d.y;
                      });
                    })
                  ])
                  .range([h-padding.bottom-padding.top,0]);

            xAxis.scale(xScale)
                 .ticks(d3.time.hour,2)
                 .tickFormat(d3.time.format("%H"));

            yAxis.scale(yScale)
                 .orient("left")
                 .ticks(10);

             groups = svg.selectAll(".rgroups")
                        .data(dataset);

                        groups.enter().append("g")
                        .attr("class","rgroups")
                        .attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
                        .style("fill",function(d,i){
                            return color(i);
                        });


                        rect = groups.selectAll("rect")
                        .data(function(d){return d;});

                        rect.enter()
                          .append("rect")
                          .attr("x",w)
                          .attr("width",1)
                          .style("fill-opacity",1e-6);

                    rect.transition()
                        .duration(1000)
                        .ease("linear")
                        .attr("x",function(d){
                            return xScale(new Date(0, 0, 0,d.time,0, 0, 0));
                        })
                        .attr("y",function(d){
                            return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
                        })
                        .attr("height",function(d){
                            return -yScale(d.y) + (h - padding.top - padding.bottom);
                        })
                        .attr("width",15)
                        .style("fill-opacity",1);

                    rect.exit()
                 .transition()
                 .duration(1000)
                 .ease("circle")
                 .attr("x",w)
                 .remove();

                    groups.exit()
                 .transition()
                 .duration(1000)
                 .ease("circle")
                 .attr("x",w)
                 .remove();


            svg.select(".x.axis")
               .transition()
               .duration(1000)
               .ease("circle")
               .call(xAxis);

            svg.select(".y.axis")
               .transition()
               .duration(1000)
               .ease("circle")
               .call(yAxis);

            svg.select(".xtext")
               .text("Hours");

            svg.select(".title")
                .text("Number of messages per hour on " + date + ".");
          });
        });
    });
  })

  .controller('primary', function($http){
    var p = this;
    p.sumOfContribution = 0;
    p.authKey = '28b2d9e6fc82252bd80bf0c395c96a761cb72571'

    p.getRepos = function(user, callback){
      var myUser = user
      //Getting repos for p.user
      if (!user){
        myUser = p.user
      }

      var payload = {
        method: 'GET',
        headers:{
          'Authorization': 'token ' + p.authKey
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
      p.getTopics()
      p.getContributors()

      // var payload = {
      //   method: 'GET',
      //   url: 'https://api.github.com/repos/'+ p.user +'/' + p.repo + '/commits'
      // }
      // $http(payload).then(function(result){
      //   p.commits = result.data
      //   console.log(result)
      // }, function(err){
      //   console.log(err)
      // })
    }

    p.getTopics = function(){
      var payload = {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.mercy-preview+json',
          'Authorization': 'token ' + p.authKey
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
              'Authorization': 'token ' + p.authKey
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
          'Authorization': 'token ' + p.authKey
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

  .config(function($routeProvider) {
    $routeProvider
   .when('/', {
     templateUrl: 'home.html',
     controller: 'homeCtrl',
     controllerAs: 'home'
    })
    .when('/about', {
      templateUrl: 'about.html',
    })
    .when('/collaborators', {
      templateUrl: 'collaborators.html',
      // controller: 'graphCtrl',
      // controllerAs: 'g'
    });
})
