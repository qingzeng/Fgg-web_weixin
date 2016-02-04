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
		$scope.ispass = false;
		var _obj = $.parseJSON(window.localStorage.getItem("obj"));
		$scope.type = {};
		$scope.type.xunjiaID = _obj.jiLuId;
		$scope.formData.kehuId = window.localStorage.getItem("keHuID");
		$scope.formData.cityName = window.localStorage.getItem("cityName");
		$scope.getResidentialAreaDetai = {};
		$scope.ispermit = true;
		$scope.isdisallow = true;

		$scope.getResidentialAreaDetai.cellNumber = getParameterByName("cellNumber");
		$scope.formData.pageSize = 10;
		$scope.formData.pageIndex = 1;
		recorddetails($scope, accuratevaluationResultServices, _obj);
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
						getCaseInfo($scope, accuratevaluationResultServices, "挂牌", $layer);
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
						if ($("#wrap3").attr("flag") == "true") {
							$("#wrap3").attr("flag", "false");
							getresidentialArea($scope, accuratevaluationResultServices, $layer);
						}
						break;
				}

			});

			$("#price").on('keyup paste', function() {
				if ($.trim($(this).val()) != "") {
					if (/^[1-9]\d*$/.test($.trim($(this).val()))) {
						$("#totalprice").val((parseInt($("#price").val()) * parseInt($scope.getResidentialAreaDetai.weituopinggumianji) / 10000).toFixed(2));

					} else {
						$(this).val("");
					}
				} else {
					$("#totalprice").val("");
				}
			});
			$("#totalprice").on('keyup paste', function() {
				if ($.trim($(this).val()) != "") {
					if (/^[1-9]+\.{0,1}[0-9]{0,2}$/.test($.trim($(this).val()))) {
						$("#price").val(((parseInt($("#totalprice").val()) * 10000) / parseInt($scope.getResidentialAreaDetai.weituopinggumianji)).toFixed(0));

					} else {
						$(this).val("");
					}
				} else {
					$("#price").val("");
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

			// $("#ispermitclick").click(function(){
			// 	$scope.ispermit = false;
			// 	$("#isallowclick").unbind("click");
			// })

			// $("#isallowclick").click(function(){
			// 	$scope.iscommit = true;
			// })

		})

		var flag = true;
		$scope.permitclick = function() {
			$scope.ispermit = false;
			$("#isallowclick").unbind("click");
			flag=false;
		};
		$scope.allowclick = function() {
			if(flag){
		 	$scope.iscommit = true;
		 	}
		};
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



		$scope.cancel = function() {
			$("#totalprice,#price").val("");

			$scope.iscommit = false;
		};
		$scope.commit = function() {
			var flag = $("#form").valid();
			if (flag) {
				if ($("#totalprice").val() != "" && $("#price").val() != "") {
					$scope.ispass = false;
					$scope.type.cityName_Zh = window.localStorage.getItem("cityName_Zh");
					$scope.type.price = $.trim($("#price").val());
					$scope.type.totalprice = $.trim($("#totalprice").val());

					accuratevaluationResultServices.feekback($scope.type).success(function(data, statue) {
						$("#totalprice,#price").val("");
						$scope.iscommit = false;
						if (data.code = 200) {
							$scope.isdisallow = false;
							$("#ispermitclick,#isallowclick").unbind("click");
							$layer.open({
								content: "反馈成功!",
								btn: ['OK']
							});
						}else{
							$scope.isdisallow = true;
						}
					}).error(function(data, statue) {
						$("#totalprice,#price").val("");
						$scope.iscommit = false;
						$scope.isdisallow = true;

					});
				} else {
					$scope.ispass = true;
				}
			}
		};
		$scope.map = function() {
			window.location.href = handler.bdMapUrl + "?x=" + _obj.x + "&y=" + _obj.y;
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
			window.location.href = "#/delegatedeclaration?residentialAreaID=" + $scope.formData.residentialAreaID + "&residentialAreaName=" + $scope.getResidentialAreaDetai.xiaoquname + "&area=" + $scope.getResidentialAreaDetai.weituopinggumianji + "&address=" + $scope.getResidentialAreaDetai.xiangxidizhi;
		}

		function valid() {
			$("#form").validate({
				rules: {
					totalprice: {
						posintdec: true
					},
					price: {
						posint: true,
					},
				},
				messages: {
					totalprice: {
						posintdec: "总价保留两位小数",
						maxlength: "最大长度为7位"
					},
					price: {

						posint: "单价为正整数",
						maxlength: "最大长度为7位"

					},

				},
				success: function(label) {
					label.closest('.form_valid').next(".error").remove();
					$("#" + label[0].control.id).parent().parent().parent().removeClass('error_bor');
				},
				errorPlacement: function(error, element) {
					element.closest('.form_valid').next(".error").remove();
					if (error[0].innerHTML != "") {
						var html = '<div class="weui_cell text-bg-gray error">' + '<label><span class="error_color">提示：</span>' + error[0].innerHTML + '</label>' + '</div>';
						element.closest('.form_valid').after(html);
						element.closest('.form_valid').addClass('bor error_bor');
						$("#" + element[0].id).focus();
					}
				}
			})
		};

	})
});
//获取URL参数
function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
//
function recorddetails($scope, accuratevaluationResultServices, _obj) {
	$scope.allfrom = {};
	$scope.allfrom.jiLuId = _obj.jiLuId;
	accuratevaluationResultServices.recorddetails($scope.allfrom).success(function(data, statue) {
		if (data.code == 200) {
			if (data.data && data.data != null) {
				$scope.getResidentialAreaDetai = data.data;
				$scope.formData.residentialAreaID = $scope.getResidentialAreaDetai.xiaoquid;
				$scope.formData.residentialAreaName = $scope.getResidentialAreaDetai.weituopingguxiangmu;
				$scope.getResidentialAreaDetai.shichangdanjia = upade($scope.getResidentialAreaDetai.shichangdanjia);
				$scope.getResidentialAreaDetai.roomType = checkRoomNumType($scope.getResidentialAreaDetai.jushileixing);

				if ($scope.getResidentialAreaDetai.chaoxiang == "" || $scope.getResidentialAreaDetai.chaoxiang == null) {
					$scope.getResidentialAreaDetai.chaoxiang = "";
				} else {
					$scope.getResidentialAreaDetai.chaoxiang = "  " + $scope.getResidentialAreaDetai.chaoxiang + "朝向";
				}

				if ($scope.getResidentialAreaDetai.suozailouceng == "" || $scope.getResidentialAreaDetai.suozailouceng == null) {
					$scope.getResidentialAreaDetai.suozailouceng = "";
				} else {
					$scope.getResidentialAreaDetai.suozailouceng = "所在" + $scope.getResidentialAreaDetai.suozailouceng + "层";
				}

				if ($scope.getResidentialAreaDetai.zonglouceng == "" || $scope.getResidentialAreaDetai.zonglouceng == null) {
					$scope.getResidentialAreaDetai.zonglouceng = "";
				} else {
					$scope.getResidentialAreaDetai.zonglouceng = " 共" + $scope.getResidentialAreaDetai.zonglouceng + "层";
				}
				if ($scope.getResidentialAreaDetai.teshuyinsu == "" || $scope.getResidentialAreaDetai.teshuyinsu == null) {
					$scope.getResidentialAreaDetai.teshuyinsu = "";
				} else {
					$scope.getResidentialAreaDetai.teshuyinsu = " " + $scope.getResidentialAreaDetai.teshuyinsu;
				}
				if ($scope.getResidentialAreaDetai.jianchengniandai == "" || $scope.getResidentialAreaDetai.jianchengniandai == null) {
					$scope.getResidentialAreaDetai.jianchengniandai = "";
				} else {
					$scope.getResidentialAreaDetai.jianchengniandai = $scope.getResidentialAreaDetai.jianchengniandai + "年";
				}


			}
		}
	}).error(function(data, statue) {

	})
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



			var obj = data.data;
			var _obj = {};

			if (type == "lishi") {
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
				var ary1 = [];
				option.series[0].data = [];
				option.series[1].data = [];
				option.series[2].data = [];
				$scope.getPriceTrendPicStr = "历史";
				_obj = obj.history;
				if (_obj != null) {
					$scope.isgetPriceTrendPic_history = false;
					if (_obj != null) {
						if (_obj.Community.length < _obj.City.length) {
							var num = _obj.City.length - _obj.Community.length;
							var isnullarry = [];
							for (var i = 0; i < num; i++) {
								var isnullobj = {
									"Price": "-"
								};
								isnullarry[i] = isnullobj;
								_obj.Community.unshift(isnullarry[i]);
							}
						}
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

				var arry = [];
				arry = obj.next;
				if (arry != null && arry.length != 0) {

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
							data: ['小区均价'],
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
					var ary1 = [];
					option.series[0].data = [];
					for (var j = 0; j < arry.length; j++) {
						option.series[0].data[j] = arry[j].Price;

						ary1[j] = arry[j].Data;
					}
					option.xAxis[0].data = ary1;
					myChart.setOption(option, true);
					window.onresize = myChart.resize;
				} else {
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
							data: ['小区均价'],
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
					var ary1 = [];
					option.series[0].data = [];
					for (var j = 0; j < arry.length; j++) {
						option.series[0].data[j] = arry[j].Price;

						ary1[j] = arry[j].Data;
					}
					option.xAxis[0].data = ary1;
					myChart.setOption(option, true);
					window.onresize = myChart.resize;
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
	if ("-1" == val || "0" == val) {
		return "其他"
	}
}



function upade(num) {
	var _num = num + "";
	var str = "";
	if (_num != null && _num.length > 2) {
		str = Math.round(parseInt(num) / 100) * 100 + "";
	} else {
		str = "0";
	}
	return str;
}