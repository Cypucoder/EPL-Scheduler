//https://scotch.io/tutorials/single-page-apps-with-angularjs-routing-and-templating

var app = angular.module('myApp', ['ngRoute', 'ngMessages','ngCookies']);
//http://stackoverflow.com/questions/15354329/how-to-get-the-route-name-when-location-changes
app.run(['$rootScope','$location', '$routeParams', function($rootScope, $location, $routeParams) {
    if (!window.console) window.console = {}; 
    if (!window.console.log) window.console.log = function () { };
    
    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
      console.log('Current route name: ' + $location.path());
      // Get all URL parameter
      console.log($routeParams);
    });
  }]);

//http://stackoverflow.com/questions/16301554/is-it-possible-to-share-data-between-two-angularjs-apps


app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.factory("user",function(){
        return {};
});

app.filter('characters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }else{
                    while(input.charAt(input.length-1) === ' '){
                        input = input.substr(0, input.length -1);
                    }
                }
                return input + '…';
            }
            return input;
        };
    })
    app.filter('splitcharacters', function() {
        return function (input, chars) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                var prefix = input.substring(0, chars/2);
                var postfix = input.substring(input.length-chars/2, input.length);
                return prefix + '...' + postfix;
            }
            return input;
        };
    })
    app.filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '…';
                }
            }
            return input;
        };
    });
    
    //http://www.techstrikers.com/AngularJS/angularjs-custom-filter.php
    //Used to stop returning results after a certain amount. Basically used for the waiting list.
    app.filter('slice', function() {
      return function(arr, start, end) {
        return (arr || []).slice(start, end);
      };
    });

    app.filter('noWait', function() {
      return function(input, status) {
        var out = [];
          for (var i = 0; i < input.length; i++){
              if(input[i].wait == status)
                  out.push(input[i]);
          }      
        return out;
      };
    });

//the following contains "routes" or the web pages injected into the template page
//template defines the template the page is injected into
//controller defines what the rules and data available for the page are

//http://jonsamwell.com/url-route-authorization-and-security-in-angular/
//http://stackoverflow.com/questions/11541695/redirecting-to-a-certain-route-based-on-condition
app.config(function($routeProvider, $httpProvider){
    
    $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.cache = false;

  if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
  }
  $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    
    $routeProvider
    
    //route for the landing page
    
    .when('/', {
        templateUrl: 'eventlist.html',
        controller: 'data_initUser'
    })
    
    .when('/:building/:age/:order/filt/', {
        templateUrl: 'eventlist.html',
        controller: 'data_fEvent'
    })
    
    .when('/redir/t', {
        templateUrl: 'blank.html',
        controller: 'data_redirT'
    })
    
    .when('/redir/r', {
        templateUrl: 'blank.html',
        controller: 'data_redirR'
    })
    
    .when('/Message/:id', {
        templateUrl: 'Message.html',
        controller: 'data_message'
    })
    
    .when('/event/:id/Attending/', {
        templateUrl: 'Attending.html',
        controller: 'data_attending'
    })
    
    .when('/event/:event/:id/Attendee/', {
        templateUrl: 'Attendee.html',
        controller: 'data_attendee'
    })
    
    //defines specific ticket information
     .when('/event/:id', {
        templateUrl: 'event.html',
        controller: 'data_event'
    })
    
     .when('/event/:id/Registration/', {
        templateUrl: 'Registration.html',
        controller: 'data_event'
    })
    
    .when('/Livetest', {
        templateUrl: 'eventlist.html',
        controller: 'data_live'
    })
    
    .when('/Schedule', {
        templateUrl: 'Schedule.html',
        controller: 'data_Sched'
    })
    
    //set default page or 404    
    .otherwise('/');
          });

//used for datepicker and date inserting
app.directive('datepickerPopup', function (dateFilter, $parse){
    return {
        restrict: 'EAC',
        require: '?ngModel',
        link: function(scope, element, attr, ngModel,ctrl) {
            ngModel.$parsers.push(function(viewValue){
                return dateFilter(viewValue, 'yyyy-MM-dd');
    });
    }
  }
});


app.controller('data_live', function($scope, $http, socket){   
$http.get('/event').success(function(data){$scope.data=data;});
console.log("connected");
    $scope.Show1 = "1";
socket.on('Realtime_Dat', function(test){
    console.log(test);
    console.log("accessing Realtime_Dat client");
    $http.get('/event').success(function(data){$scope.data=data;});
});
});

app.controller('data_Sched', function($scope, $http, socket){   
    $http.get('/Sched').success(function(data){$scope.data=data;$scope.Sun = data[0].Sun;$scope.Mon = data[0].Mon;$scope.Tue = data[0].Tue;$scope.Wed = data[0].Wed;$scope.Thu = data[0].Thu;$scope.Fri = data[0].Fri;$scope.Sat = data[0].Sat});
});

//for things that are persistant across the navbar and footer
app.controller('data_view', function($scope, $http, socket, $routeParams, $cookieStore){
    var user = $cookieStore.get("username");
    if (user != undefined){
    $scope.LoggedIn = "1";
        }
    else{
        //$scope.LoggedIn = "";
    }
});

//defines the rules and data available to the web page
//more efficient use of the server

app.controller('data_initUser', function($scope, $http, socket, $routeParams, $cookieStore){
$scope.user = $cookieStore.get("username");
    console.log($cookieStore.get("username"));
    
//$scope.user = $cookieStore.get("username");
//$scope.user.Auth = $routeParams.user;
console.log($cookieStore.get("username"));


/*$scope.building ="*";
$scope.age ="*";
$scope.order ="*";*/
    
    $scope.PasPres = [{
            Id: 1,
            Name: 'Current'
        }, {
            Id: 2,
            Name: 'Past'
        }];
    
    $scope.dateRange = "Current";
    $scope.fCurrent = function(){
        
        //console.log("fCurrent");
        //console.log($scope.dateRange);
         if($scope.dateRange == "Current")
         {
             $http.get('/flevent/').success(function(data){$scope.data=data;});
         }else{
             $http.get('/flevent/a').success(function(data){$scope.data=data;});    
         }
    }
    
    
if ($scope.user == "" || $scope.user == undefined)
    {
        $http.get('/event/').success(function(data){$scope.data=data;});
    }
    else
        {
            //Originally used to return ONLY events that relate to the user for update purposes
            //$http.get('/eventLogged/'+user.Auth).success(function(data){$scope.data=data;});
            $http.get('/flevent/').success(function(data){$scope.data=data;});
            
            if ($scope.user != "Lakesha" ||$scope.user != "Jen" ||$scope.user != "Lyn")
            {
                $scope.Show8="1";
            }
        }
    
if ($scope.user == "Lakesha" ||$scope.user == "Jen" ||$scope.user == "Lyn")
{
    $scope.Ad = "true";
    if ($scope.user == "Lyn")
        {
            $scope.Show2="1";
        }
    if ($scope.user == "Jen")
        {
            $scope.Show3="1";
        }
    if ($scope.user == "Lakesha")
        {
            $scope.Show4="1";
        }
    if ($scope.user == "Setup")
        {
            $scope.Show5="1";
        }
    }else
{
    $scope.Ad = "false";
    $scope.Show1 = "1";
    if ( $scope.user != undefined && $scope.user !="")
        {
            $scope.Show6="1";
        }
}
//$http.get('/event/').success(function(data){$scope.data=data;});
})

app.controller('data_event', function($scope, $http, socket, $routeParams, $cookieStore, $location){
$scope.user = $cookieStore.get("username");
    console.log($scope.user);
    
    $scope.print = function() {window.print();}
    
//$scope.updticket = function(ticket){socket.emit('update_ticket', ticket)};
    //$scope.redirect = function(){location.reload();};    
$http.get('/event/'+$routeParams.id).success(function(data){$scope.x=data; $http.get('/REPTIMES/'+data.title+'/'+data.ContMail+'/'+data.Location_Room).success(function(data){$scope.T=data;});
if ($scope.user != "" && $scope.user != undefined)
    {
        $scope.x.show = "1";
    }
    else
        {
            $scope.x.show = "";
        }
if($scope.user == "Tracy" || $scope.user == "Jen")
    {
        if($scope.T.length != 1)
            {
        $scope.Show1="1";
                }
    }
                                                            
if ($scope.user == "Setup")
    {
        $scope.Show2="1";
    }
                                                            
if (data.AttendCap != "0")
    {
        $scope.Show3="1";
    } else {
        console.log("Attendcap is 0");
    }
                                                            
if ($scope.user != "" && $scope.user != undefined)
    {
        $scope.Show4="1";
    }
                                                           
            });
    
    $scope.fTicketId = $routeParams.id;
$scope.fTicketSo = $http.get('/event/'+$routeParams.id).success(function(data){$scope.s=data;});
$scope.addRegis = function(Regis){socket.emit('add_Regis', Regis)};
$scope.deleteEvent = function(eve){socket.emit('deleteEvent', eve)};
socket.on('SchedChangeLoc', function(res){
    $location.path(res);  
     console.log("SchedChangeLoc");
});

});

app.controller('data_fEvent', function($scope, $http, socket, $routeParams, $location, $cookieStore){
$scope.user = $cookieStore.get("username");
    
$http.get('/fevent/'+$routeParams.building+'/'+$routeParams.age+'/'+$routeParams.order).success(function(data){$scope.data=data;});
$scope.addRegis = function(Regis){socket.emit('add_Regis', Regis)};
$scope.building = $routeParams.building;
$scope.age = $routeParams.age;
$scope.order = $routeParams.order;
    
    if ($scope.user == "Lakesha" ||$scope.user == "Jen" ||$scope.user == "Lyn")
{
    $scope.Ad = "true";
    if ($scope.user == "Lyn")
        {
            $scope.Show2="1";
        }
    if ($scope.user == "Jen")
        {
            $scope.Show3="1";
        }
    if ($scope.user == "Lakesha")
        {
            $scope.Show4="1";
        }
    }else{
    if ($scope.user == "Setup")
        {
            $scope.Show5="1";
        }    
    $scope.Ad = "false";
    $scope.Show1 = "1";
    if ( $scope.user != undefined && $scope.user !="")
        {
            $scope.Show6="1";
        }
}
    
    // at the bottom of your controller
var init = function () {
   // check if there is query in url
   // and fire search in case its value is not empty
    //$location.search('key', null)
};
// and fire it after definition
init();
});

app.controller('data_message', function($scope, $http, socket, $routeParams, $location, $cookieStore, $timeout){
$scope.user = $cookieStore.get("username");
    var Id = $routeParams.id;
    
    if (Id == "1")
        {
            $scope.Message = "Your Event has been added";
            $scope.Show1 = "1";
            $scope.Show2 = "1";
            $scope.Show4 = "1";
            $scope.Title = $cookieStore.get("tempsched.eTitle");
            $scope.Mail = $cookieStore.get("tempsched.ContMail");
            $scope.SH = $cookieStore.get("tempsched.eStH");
            $scope.SM = $cookieStore.get("tempsched.eStM");
            $scope.PreSAM = $cookieStore.get("tempsched.eStAmPm");
            if($scope.PreSAM = "12"){$scope.SAM = "pm"}else{$scope.SAM = "am"};
            $scope.EH = $cookieStore.get("tempsched.eEnH");
            $scope.EM = $cookieStore.get("tempsched.eEnM");
            if($scope.PreEAM = "12"){$scope.EAM = "pm"}else{$scope.EAM = "am"};
            $scope.Start = $scope.SH + ":" + $scope.SM + $scope.SAM;
            $scope.End = $scope.EH + ":" + $scope.EM + $scope.EAM;
            $scope.Description = $cookieStore.get("tempsched.eDescription");
        }else if (Id == "2")
        {
            $scope.Message = "The Event has been updated";
            $scope.Show1 = "";
            $scope.Show2 = "";
            $scope.Show3 = "1"
            
            $scope.counter = 5;
    $scope.onTimeout = function(){
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout,1000);
    }
    var mytimeout = $timeout($scope.onTimeout,1000);

    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }
    
            $timeout(function() {
              $location.path("");
              }, 5000);
            
        }else if (Id =="3")
        {
            $scope.Message = "Thanks for registering!";
            $scope.Show1 = "";
            $scope.Show2 = "";
            $scope.Show3 = "1";
             $scope.counter = 5;
    $scope.onTimeout = function(){
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout,1000);
    }
    var mytimeout = $timeout($scope.onTimeout,1000);

    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }
    
            $timeout(function() {
              $location.path("");
              }, 5000);
        }else if (Id == "4")
        {
            $scope.Message = "Your Event has been removed";
            $scope.Show1 = "1";
            $scope.Show2 = "1";
        }else{
            $scope.Message = "There was an error, please go back and try again.";
            $scope.Show1 = "";
            $scope.Show2 = "";
        }
            
    

});

app.controller('data_attendee', function($scope, $http, socket, $routeParams, $cookieStore){
    $scope.user = $cookieStore.get("username");
    

$http.get('/Attendees/'+$routeParams.id).success(function(data){$scope.x=data;});
$http.get('/Title/'+$routeParams.event).success(function(data){$scope.title=data.title; $scope.count=data.AttendCount;});

});

app.controller('data_attending', function($scope, $http, socket, $routeParams, $cookieStore){
    $scope.user = $cookieStore.get("username");
//Cut events based on how many per family, create a repeat event and add regAttending until number = AttendCap
$http.get('/Title/'+$routeParams.id).success(function(data){$scope.title=data.title; $scope.count=data.AttendCount; $scope.cap = data.AttendCap; $scope.tot = data.total; $http.get('/Attendings/'+$routeParams.id+'/'+$scope.cap).success(function(a){$scope.data=a;});});

$scope.updWait = function(UpdReg){socket.emit('updWait', UpdReg)};
$scope.updRemove = function(UpdRem){socket.emit('updRemove', UpdRem)};    
    
socket.on('Upd_Att_Stream', function(){
    console.log("update successful");
    console.log("accessing Upd_Att_Stream client");
    $http.get('/Title/'+$routeParams.id).success(function(data){$scope.title=data.title; $scope.count=data.AttendCount; $scope.cap = data.AttendCap; $scope.tot = data.total; $http.get('/Attendings/'+$routeParams.id+'/'+$scope.cap).success(function(a){$scope.data=a;});});
});

$scope.tots = function(dat){
    var total = 0;
    for(var i = 0; i < dat.length; i++){
        total = total + dat[i].regAttending;
    }
    console.log(total);
    return total;
}



});


app.controller('data_redirT', function($scope, $http, socket, $routeParams, $location, $cookieStore){
   
    
 // at the bottom of your controller
var init = function () {
   // check if there is query in url
   // and fire search in case its value is not empty
    if($scope.user == undefined||$scope.user =="")
    {
            $cookieStore.remove("username");
            
        $route.reload();
    }
    else
    {
            $cookieStore.remove("username");
            
        $route.reload();
          
        
    }
};
// and fire it after definition
init();
});

app.controller('data_redirR', function($scope, $http, socket, $routeParams, $location, $cookieStore){
    
    $scope.user = $cookieStore.get("username");
    
    
 // at the bottom of your controller
var init = function () {
   // check if there is query in url
   // and fire search in case its value is not empty
    if($scope.user == undefined||$scope.user =="")
    {
        window.location='http://google.com';    
    }
    else
    {
        window.location='http://localhost/epl/eventkeeper/schedule.html';
    }
};
// and fire it after definition
init();
});


//needed for the datepicker functions
app.controller('Datepicker', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2070, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.status = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
});


    
