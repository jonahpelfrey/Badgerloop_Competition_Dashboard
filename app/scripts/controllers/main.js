'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
   .controller('MainCtrl', function($scope,$position,NgTableParams,$riffle,$http) {

    //Initialize scope variables

    //Ingest Parser
    $scope.parser = {}
    $http.get('../../parser.json').success(function(data) {
            $scope.parser = data
            console.log($scope.parser)
    });

    //Admin
    $scope.custom = false;
    $scope.raw = false;
    $scope.template = false;
    $scope.msgType = 0;
    $scope.msgDataSize = 0;

    $scope.progress = [];
    
    $scope.items = [{
      id: 1,
      label: 'Heartbeat',
      message: '5C0#10001',
      endpoint: 'hb'
    }, {
      id: 2,
      label: 'Start',
      message: '0x',// TODO add this
      endpoint: 'cmd'
    },
    {
      id: 3,
      label: 'Stop',
      message: '0x',// TODO add this
      endpoint: 'cmd'
    }];

    $scope.modules = [
        {name: 'NONE', mask:'FFF'},
        {name: 'VNM', mask: '001'},
        {name: 'VSM', mask: '002'},
        {name: 'BCM', mask: '004'},
        {name: 'MCM', mask: '008'},
        {name: 'WCM', mask: '010'},
        {name: 'BMS', mask: '020'},
        {name: 'ALL', mask: '400'}
    ];

    $scope.msgSizes = [
        {name: '0', data: ''},
        {name: '1', data: 'FF'},
        {name: '2', data: 'FFFF'},
        {name: '3', data: 'FFFFFF'},
        {name: '4', data: 'FFFFFFFF'},
        {name: '5', data: 'FFFFFFFFFF'},
        {name: '6', data: 'FFFFFFFFFFFF'},
        {name: '7', data: 'FFFFFFFFFFFFFF'},
        {name: '8', data: 'FFFFFFFFFFFFFFFF'},
    ];
    $scope.msgTypes = [
        {name: '0', data: ''},
        {name: '1', data: 'FF'},
        {name: '2', data: 'FFFF'},
        {name: '3', data: 'FFFFFF'},
        {name: '4', data: 'FFFFFFFF'},
        {name: '5', data: 'FFFFFFFFFF'},
        {name: '6', data: 'FFFFFFFFFFFF'},
        {name: '7', data: 'FFFFFFFFFFFFFF'},
        {name: '8', data: 'FFFFFFFFFFFFFFFF'},
    ];

    $scope.selectedModule = $scope.modules[0];
    $scope.selectedSize = $scope.msgSizes[0];
    $scope.customMessage = '0xFFFFFFFF';
    $scope.sendMessage = '0xFFFFFFFF';
    $scope.heartbeat = '0x5C010001';

    $scope.changeModule = function() {
        $scope.customMessage = '0x' + $scope.selectedModule.mask + 'FFFFF';
    }

    $scope.changeSize = function() {
        $scope.customMessage = '0x' + $scope.selectedModule.mask + $scope.selectedSize.name + $scope.selectedSize.data;
    }

    $scope.sentMessages = [];
    $scope.messages = [
        // {module: "MCM", timestamp: 2, value: 30},
        // {module: "MCM", timestamp: 2, value: 30},
        // {module: "MCM", timestamp: 2, value: 30},
        // {module: "MCM", timestamp: 2, value: 30},
        // {module: "MCM", timestamp: 2, value: 30},
        // {module: "MCM", timestamp: 2, value: 30},
        // {module: "MCM", timestamp: 2, value: 30},
        // {module: "VNM", timestamp: 2, value: 20}

    ];
    $scope.sortType = 'module';
    $scope.sortReverse = false;
    $scope.messageSearch = '';

    $scope.data = sinAndCos(); //data for graph
    $scope.title = 'My gauge';
    $scope.titleFontColor = 'blue';
    $scope.value = 1234.358;
    $scope.valueFontColor = 'red';
    $scope.min = 0;
    $scope.max = 1337;
    $scope.valueMinFontSize = undefined;
    $scope.titleMinFontSize = undefined;
    $scope.labelMinFontSize = undefined;
    $scope.minLabelMinFontSize = undefined;
    $scope.maxLabelMinFontSize = undefined;
    $scope.hideValue = false;
    $scope.hideMinMax = false;
    $scope.hideInnerShadow = false;
    $scope.width = undefined;
    $scope.height = undefined;
    $scope.relativeGaugeSize = undefined;
    $scope.gaugeWidthScale = 0.5;
    $scope.gaugeColor = 'grey';
    $scope.showInnerShadow = true;
    $scope.shadowOpacity = 0.5;
    $scope.shadowSize = 3;
    $scope.shadowVerticalOffset = 10;
    $scope.levelColors = ['#00FFF2', '#668C54', '#FFAF2E', '#FF2EF1'];
    $scope.customSectors = [
        {
            color: "#ff0000",
            lo: 0,
            hi: 750
        },
        {
            color: "#00ff00",
            lo: 750,
            hi: 1000
        },
        {
            color: "#0000ff",
            lo: 1000,
            hi: 1337
        }
    ];
    $scope.noGradient = false;
    $scope.label = 'Green label';
    $scope.labelFontColor = 'green';
    $scope.startAnimationTime = 0;
    $scope.startAnimationType = undefined;
    $scope.refreshAnimationTime = undefined;
    $scope.refreshAnimationType = undefined;
    $scope.donut = undefined;
    $scope.donutAngle = 90;
    $scope.counter = true;
    $scope.decimals = 2;
    $scope.symbol = 'X';
    $scope.formatNumber = true;
    $scope.humanFriendly = true;
    $scope.humanFriendlyDecimal = true;
    $scope.textRenderer = function (value) {
        return value;
    };

///////////////////////////HELPER FUNCTIONS///////////////////////////


$scope.get_progress = function() {
    $scope.stacked = [];
    var types = ['success', 'info', 'warning', 'danger'];

    for (var i = 0, n = Math.floor(Math.random() * 4 + 1); i < n; i++) {
        var index = Math.floor(Math.random() * 4);
        $scope.progress.push({
          value: Math.floor(Math.random() * 30 + 1),
          type: types[index]
        });
    }
  };

  $scope.get_progress();

$scope.sendMessage = function(message, endpoint, domain) {
    //$riffleProvider.setDomain(domain);
    $riffle.publish(endpoint, message);    
}

$riffle.subscribe("can", function(data) {
    var d = new Date();
    console.log(data);
    //parse data from parser here
    $scope.messages.push({timestamp:data[0],sid:data[1],type:data[2],value:data[3]});
});
 // These functions will be used to parse and format raw CAN message strings
 
        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e'  //color - optional: choose your own line color.
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                }
                // {
                //     values: sin2,
                //     key: 'Another sine wave',
                //     color: '#7777ff'
                // }
            ];
        };
//////////////////////////CAN MESSAGE TABLE ///////////////////////////
    
    $scope.tableParams = new NgTableParams({}, { dataset: $scope.messages});



//////////////////////////GRAPH CONGFIGURAION///////////////////////////
  	 $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Velocity and Acceleration'
            },
            subtitle: {
                enable: true,
                text: 'Velocity and Acceleration',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: false,
               	text: 'Velocity and Accelleration of the BadgerLoop Pod',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };
  });
