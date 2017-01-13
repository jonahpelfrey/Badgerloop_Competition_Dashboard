'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', function($scope,$position,NgTableParams) {

    //Initialize scope variables

    
    $scope.progress = [];
    $scope.custom = false;
    $scope.modules = [
        {name: 'NONE', mask: 'FFF'},
        {name: 'VNM', mask: '001'},
        {name: 'VSM', mask: '002'},
        {name: 'BCM', mask: '004'},
        {name: 'MCM', mask: '008'},
        {name: 'WCM', mask: '010'},
        {name: 'BMS', mask: '020'},
        {name: 'ALL', mask: '400'}
    ];

    $scope.msgSizes = [
        {name: '0', mask: '0000', data: ''},
        {name: '1', mask: '0001', data: 'FF'},
        {name: '2', mask: '0010', data: 'FFFF'},
        {name: '3', mask: '0011', data: 'FFFFFF'},
        {name: '4', mask: '0100', data: 'FFFFFFFF'},
        {name: '5', mask: '0101', data: 'FFFFFFFFFF'},
        {name: '6', mask: '0110', data: 'FFFFFFFFFFFF'},
        {name: '7', mask: '0111', data: 'FFFFFFFFFFFFFF'},
        {name: '8', mask: '1000', data: 'FFFFFFFFFFFFFFFF'},
    ];

    $scope.selectedModule = $scope.modules[0];
    $scope.selectedSize = $scope.msgSizes[0];
    $scope.customMessage = '0xFFFFFFFF';

    $scope.changeModule = function() {
        $scope.customMessage = '0x' + $scope.selectedModule.mask + 'FFFFF';
    }

    $scope.changeSize = function() {
        $scope.customMessage = '0x' + $scope.selectedModule.mask + $scope.selectedSize.mask + $scope.selectedSize.data;
    }

    $scope.sentMessages = [];
    $scope.messages = [
        {module: "MCM", timestamp: 2, value: 30},
        {module: "MCM", timestamp: 2, value: 30},
        {module: "MCM", timestamp: 2, value: 30},
        {module: "MCM", timestamp: 2, value: 30},
        {module: "MCM", timestamp: 2, value: 30},
        {module: "MCM", timestamp: 2, value: 30},
        {module: "MCM", timestamp: 2, value: 30},
        {module: "VNM", timestamp: 2, value: 20}

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
