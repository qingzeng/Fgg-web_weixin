/**
 * accuratevaluation-results/精准估价结果页
 */
define(['app', 'jquery', 'handler', '_layer', 'echarts', 'echarts/chart/line', 'jValidate', 'jValidateexpand', '_swipe', '../../../services/propertyvaluation/accuratevaluation/accuratevaluationResultServices'], function(app, $, handler, $layer, ec, accuratevaluationResultServices) {
	app.controller('Accuratevaluation-resultsCtrl', function($scope, accuratevaluationResultServices) {
		handler.setTitle("精准估价结果页");
		$scope.formData = {};
		//案例
		$scope.caseInfos = {};
		$scope.caseinfoType = "挂牌";
		//周边小区
		$scope.getresidentialArealist = [];
		$scope.iscommit = false;
		$scope.ngloading = false;
		$scope.type = {};
		$scope.formData.kehuId = window.localStorage.getItem("keHuID");
		$scope.formData.cityName = window.localStorage.getItem("cityName");

		$scope.getResidentialAreaDetai = {};

		if (getParameterByName("resultStr") != "" && getParameterByName("resultStr") != null) {
			$scope.getResidentialAreaDetai = $.parseJSON(getParameterByName("resultStr"));
			$scope.formData.residentialAreaID = $scope.getResidentialAreaDetai.residentialId;
			$scope.formData.residentialAreaName = $scope.getResidentialAreaDetai.residentialAreaName;
			$scope.formData.price = $scope.getResidentialAreaDetai.price;
			$scope.formData.totalprice = $scope.getResidentialAreaDetai.totalprice;
			$scope.type.xunjiaID = $scope.getResidentialAreaDetai.xunjiaID;
			$scope.position = {};
			$scope.position = {
				x: $scope.getResidentialAreaDetai.x,
				y: $scope.getResidentialAreaDetai.y
			};
			window.localStorage.setItem("position", JSON.stringify($scope.position));
		}

		$scope.formData.pageSize = 10;
		$scope.formData.pageIndex = 1;
		$(function() {
			valid();
			$("#wrap1,#wrap2,#wrap3").hide();
			$("#wrap0").show();
			$(".results ul li").click(function() {
				$(".results ul li").removeClass('current');
				$(this).addClass('current');
				var i = $(this).index();
				switch (i) {
					case 0:
						$("#wrap1,#wrap2,#wrap3").hide();
						$("#wrap0").show();
						break;
					case 1:
						$("#wrap0,#wrap2,#wrap3").hide();
						$("#wrap1").show();
						$scope.formData.pageSize = 10;
						$scope.formData.pageIndex = 1;
						$("#anli ul li").removeClass("current");
						$("#anli ul li").eq(0).addClass('current');
						getCaseInfo($scope, accuratevaluationResultServices, $scope.caseinfoType, $layer);
						break;
					case 2:
						$("#wrap0,#wrap1,#wrap3").hide();
						$("#wrap2").show();
						$("#case .f-fl.trend_bor").removeClass("current");
						$("#case .f-fl.trend_bor").eq(0).addClass('current');
						getPriceTrendPic($scope, accuratevaluationResultServices, ec, "lishi");
						break;
					case 3:
						$("#wrap0,#wrap1,#wrap2").hide();
						$("#wrap3").show();
						getresidentialArea($scope, accuratevaluationResultServices, $layer);
						break;
				}

			});

			$("#price").on('keyup paste', function() {
				if ($.trim($(this).val()) != "") {
					$("#totalprice").val((($scope.formData.price * $scope.getResidentialAreaDetai.area) / 10000).toFixed(2));
				} else {
					$scope.formData.totalprice = "0";
				}
			});
			$("#totalprice").on('keyup paste', function() {
				if ($.trim($(this).val()) != "") {
					$("#price").val((($scope.formData.totalprice * 10000) / $scope.getResidentialAreaDetai.area).toFixed(0));
				} else {
					$scope.formData.price = "0";
				}
			});

			$("#caselist").swipe({
				swipe: function(event, direction, distance, duration, fingerCount) {
					if (direction == "left") {
						if ($scope.curPage == $scope.totalPage) {

						} else {
							$scope.curPage = $scope.curPage + 1;
							$scope.formData.pageIndex = $scope.curPage;
							getCaseInfo($scope, accuratevaluationResultServices, $scope.caseinfoType, $layer);
						}
					} else if (direction == "right") {
						if ($scope.curPage == 1) {

						} else {
							$scope.curPage = $scope.curPage - 1;
							$scope.formData.pageIndex = $scope.curPage;
							getCaseInfo($scope, accuratevaluationResultServices, $scope.caseinfoType, $layer);
						}
					}
				}
			});

		})

		$scope.jiagezoushi = function(id) {

			if (id == "lishi") {
				$("#case .f-fl.trend_bor").removeClass("current");
				$("#case .f-fl.trend_bor").eq(0).addClass('current');
			} else {
				$("#case .f-fl.trend_bor").removeClass("current");
				$("#case .f-fl.trend_bor").eq(1).addClass('current');
			}
			getPriceTrendPic($scope, accuratevaluationResultServices, ec, id)
		}

		$scope.piceCkeck = function(flag) {
			if (flag == "true") {
				$("#piceCkeck_true").css("background", "#5F4B19");
			} else {
				$scope.iscommit = true;
			}
		};


		$scope.commit = function() {
			var flag = $("#form").valid();
			if (flag) {
				$scope.type.cityName = window.localStorage.getItem("cityName");

				$scope.type.price = $.trim($("#price").val());
				$scope.type.totalprice = $.trim($("#totalprice").val());

				accuratevaluationResultServices.feekback($scope.type).success(function(data, statue) {
					if (data.code = 200) {
						$scope.iscommit = false;
						$layer.open({
							content: "反馈成功!",
							btn: ['OK']
						});
					} else {

					}

				}).error(function(data, statue) {
					$scope.iscommit = false;
				});
			}
		};
		$scope.map = function() {
			window.location.href = "#/bdmap";
		};

		$scope.getResidentialAreaDetais = function() {
			window.location.href = "#/communityinformation?residentialAreaID=" + $scope.formData.residentialAreaID;
		};


		$scope.getCaseInfo = function(val) {

			if (val == "挂牌") {
				$("#anli ul li").removeClass("current");
				$("#anli ul li").eq(0).addClass('current');
			} else if (val == "成交") {
				$("#anli ul li").removeClass("current");
				$("#anli ul li").eq(1).addClass('current');
			} else {
				$("#anli ul li").removeClass("current");
				$("#anli ul li").eq(2).addClass('current');
			}
			$scope.formData.pageSize = 10;
			$scope.formData.pageIndex = 1;
			$scope.caseinfoType = val;
			getCaseInfo($scope, accuratevaluationResultServices, val, $layer);
		}
		$scope.next = function() {
			window.location.href = "#/delegatedeclaration?residentialAreaID=" + $scope.formData.residentialAreaID + "&residentialAreaName=" + $scope.formData.residentialAreaName + "&area=" + $scope.getResidentialAreaDetai.area + "&address=" + $scope.getResidentialAreaDetai.address;
		}



		function valid() {
			$("#form").validate({
				rules: {
					totalprice: {
						required: true,
						posintdec: true
					},
					price: {
						required: true,
						posint: true
					},

				},
				messages: {
					totalprice: {
						required: "请输入总价!",
						posintdec: "总价保留两位小数"
					},
					price: {
						required: "请输入单价!",
						posint: "单价为正整数"

					},

				},
				success: function(label) {
					label.closest('.form_valid').next(".error").remove();
					$("#" + label[0].control.id).parent().parent().parent().removeClass('error_bor');
				},
				errorPlacement: function(error, element) {
					element.closest('.form_valid').next(".error").remove();
					if (error[0].innerHTML != "") {
						var html = '<div class="weui_cell text-bg-gray error">' + '<label><span class="error_color">错误提示：</span>' + error[0].innerHTML + '</label>' + '</div>';
						element.closest('.form_valid').after(html);
						element.closest('.form_valid').addClass('bor error_bor');
						$("#" + element[0].id).focus();
					}
				}
			})
		};

	}).controller('baiduMapCtrl', function($scope) {

		var _width = $(window).width();
		var _height = $(window).height() - 4;
		$scope.position = $.parseJSON(window.localStorage.getItem("position"));
		var str = "<img src='http://api.map.baidu.com/staticimage?center=" + $scope.position.x + "," + $scope.position.y + "&zoom=18&markers=" + $scope.position.x + "," + $scope.position.y + "&markerStyles=-1,http://api.map.baidu.com/images/marker_red.png,-1' style='width:" + _width + "px;height:" + _height + "px'>";
		$("#allmap").append(str);
		$("body").css({})
			// var map = new BMap.Map("allmap"); // 创建Map实例
			// var marker = new BMap.Marker(new BMap.Point(parseFloat($scope.position.x), parseFloat($scope.position.y))); // 创建点
			// map.centerAndZoom(new BMap.Point(parseFloat($scope.position.x), parseFloat($scope.position.y)), 11); // 初始化地图,设置中心点坐标和地图级别
			// map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
			// map.addOverlay(marker);
			// map.enableScrollWheelZoom(true);
	});

});
//获取URL参数
function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


//案例信息
function getCaseInfo($scope, accuratevaluationResultServices, caseType, $layer) {
	$scope.ngloading = true;
	$scope.formData.timespan = 6;
	$scope.formData.caseType = caseType;
	$scope.caseInfos = {};
	$scope.caseType = {};
	accuratevaluationResultServices.getCaseInfo($scope.formData).success(function(data, statue) {
		$scope.ngloading = false;
		if (data.code == 200) {

			if (data.data.totalPage == 0) {
				$scope.caseType.isCaseType = true;
				if ("挂牌" == caseType)
					$scope.caseType.name = "挂牌";
				if ("成交" == caseType)
					$scope.caseType.name = "成交";
				if ("询价" == caseType)
					$scope.caseType.name = "估价";
			} else {
				$scope.curPage = data.data.curPage;
				$scope.totalPage = data.data.totalPage;
				$("#totalPage").text(data.data.totalPage);
				$scope.caseType.isCaseType = false;
				var caseInfos = data.data.value;
				for (var i = 0; i < caseInfos.length; i++) {
					caseInfos[i].roomNumType = checkRoomNumType(caseInfos[i].roomNumType);

				}
				$scope.caseInfos = caseInfos;

			}
		} else {
			$layer.open({
				content: data.message,
				btn: ['OK']
			})
		}

	}).error(function(data, statue) {
		$scope.ngloading = false;
		$layer.open({
			content: handler.netErrorMsg,
			btn: ['OK']
		});
	});

}

//获取周边小区
function getresidentialArea($scope, accuratevaluationResultServices, $layer) {
	$scope.ngloading = true;
	$scope.formData.radius = 2;
	accuratevaluationResultServices.getAroundResidentialAreaInfo($scope.formData).success(function(data, statue) {
		$scope.ngloading = false;
		if (data.code = 200) {
			$scope.getresidentialArealist = data.data.slice(0, 5);
		} else {
			$layer.open({
				content: data.message,
				btn: ['OK']
			})
		}

	}).error(function(data, statue) {
		$scope.ngloading = false;
		$layer.open({
			content: handler.netErrorMsg,
			btn: ['OK']
		});
	});
}

//获取价格走势
function getPriceTrendPic($scope, accuratevaluationResultServices, ec, type) {
	$scope.getPriceTrendPicStr = "";
	$scope.ngloading = true;
	accuratevaluationResultServices.getPriceTrendPic($scope.formData).success(function(data, statue) {
		$scope.ngloading = false;
		if (data.code = 200) {

			var myChart = ec.init(document.getElementById('chart'));
			var option = {
				tooltip: {
					trigger: 'axis'
				},
				toolbox: {
					show: false
				},
				calculable: true,
				legend: {
					data: ['城市均价', '行政区均价', '小区均价'],
					x: 'center',
					y: 'bottom'
				},
				xAxis: [{
					type: 'category',
					boundaryGap: false
				}],
				yAxis: [{
					type: 'value',
					axisLabel: {
						formatter: '{value} 元/m²'
					}
				}],
				series: [{
					"name": "城市均价",
					"type": "line",
					"markPoint": {
						"data": [{
							"type": "min",
							"name": "最小值"
						}, {
							"type": "max",
							"name": "最大值"
						}]
					}
				}, {
					"name": "行政区均价",
					"type": "line",
					"markPoint": {
						"data": [{
							"type": "min",
							"name": "最小值"
						}, {
							"type": "max",
							"name": "最大值"
						}]
					}
				}, {
					"name": "小区均价",
					"type": "line",
					"markPoint": {
						"data": [{
							"type": "min",
							"name": "最小值"
						}, {
							"type": "max",
							"name": "最大值"
						}]
					}
				}]
			};

			var obj = data.data;
			var _obj = {};
			var ary1 = [];
			option.series[0].data = [];
			option.series[1].data = [];
			option.series[2].data = [];
			if (type == "lishi") {
				$scope.getPriceTrendPicStr = "历史";
				_obj = obj.history;
				if (_obj != null) {
					$scope.isgetPriceTrendPic_history = false;
					if (_obj != null) {
						for (var j = 0; j < _obj.City.length; j++) {
							option.series[0].data[j] = _obj.City[j].Price;
							option.series[1].data[j] = _obj.Region[j].Price;
							option.series[2].data[j] = _obj.Community[j].Price;
							ary1[j] = _obj.City[j].Date;
						}
						option.xAxis[0].data = ary1;
						myChart.setOption(option, true);
						window.onresize = myChart.resize;
					}
				} else {
					if (_obj != null) {
						for (var j = 0; j < _obj.City.length; j++) {
							option.series[0].data[j] = _obj.City[j].Price;
							option.series[1].data[j] = _obj.Region[j].Price;
							option.series[2].data[j] = _obj.Community[j].Price;
							ary1[j] = _obj.City[j].Date;
						}
						option.xAxis[0].data = ary1;
						myChart.setOption(option, true);
						window.onresize = myChart.resize;
					}
					$scope.isgetPriceTrendPic_history = true;
				}
			} else {
				$scope.getPriceTrendPicStr = "未来";
				_obj = obj.next;
				if (_obj != null) {
					$scope.isgetPriceTrendPic_history = false;
					if (_obj != null) {
						for (var j = 0; j < _obj.City.length; j++) {
							option.series[0].data[j] = _obj.City[j].Price;
							option.series[1].data[j] = _obj.Region[j].Price;
							option.series[2].data[j] = _obj.Community[j].Price;
							ary1[j] = _obj.City[j].Date;
						}
					}
					option.xAxis[0].data = ary1;
					myChart.setOption(option, true);
					window.onresize = myChart.resize;

				} else {
					if (_obj != null) {
						for (var j = 0; j < _obj.City.length; j++) {
							option.series[0].data[j] = _obj.City[j].Price;
							option.series[1].data[j] = _obj.Region[j].Price;
							option.series[2].data[j] = _obj.Community[j].Price;
							ary1[j] = _obj.City[j].Date;
						}
						option.xAxis[0].data = ary1;
						myChart.setOption(option, true);
						window.onresize = myChart.resize;
					}
					$scope.isgetPriceTrendPic_history = true;
				}
			}
		} else {
			$layer.open({
				content: data.message,
				btn: ['OK']
			})
		}
	}).error(function(data, statue) {
		$scope.ngloading = false;
		$layer.open({
			content: handler.netErrorMsg,
			btn: ['OK']
		});
	});
}

function checkRoomNumType(val) {
	if ("1" == val) {
		return "一居室"
	}
	if ("2" == val) {
		return "二居室"
	}
	if ("3" == val) {
		return "三居室"
	}
	if ("4" == val) {
		return "四居室"
	}
	if ("5" == val) {
		return "五居室"
	}
	if ("9" == val) {
		return "五居室以上"
	}
}