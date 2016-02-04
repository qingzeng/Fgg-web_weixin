/**
 * communityinformation/小区信息
 */
define(['app', 'jquery', 'handler', '_layer', '../../../services/propertyvaluation/communityinformation/communityinformationServices'], function(app, $, handler, $layer, communityinformationServices) {
	app.controller('CommunityinformationCtrl', function($scope, communityinformationServices) {
		handler.setTitle("小区信息");
		handler.isKeHuID();
		$scope.formData = {};
		$scope.getResidentialAreaDeta = {};
		$scope.formData.keHuId = window.localStorage.getItem("keHuId");
		// if (getParameterByName("cityName") != null) {
		// 	if (window.localStorage.getItem("cityName") != getParameterByName("cityName")) {
		// 		window.localStorage.setItem("cityName", getParameterByName("cityName"));
		// 	}
		// 	$scope.formData.cityName = window.localStorage.getItem("cityName");
		// } else {

		// };
		$scope.ngloading = false;
		$scope.formData.cityName = window.localStorage.getItem("cityName");
		$scope.formData.residentialAreaID = getParameterByName("residentialAreaID");
		getresidentialAreaCount($scope, communityinformationServices, $layer);
		getResidentialAreaDetai($scope, communityinformationServices, $layer);
		$("#wrap1,#wrap2").hide();
		$("#wrap0").show();
		$(".xq_xx ul li").click(function() {
			$(".xq_xx ul li").removeClass('current');
			$(this).addClass('current');
			var i = $(this).index();
			switch (i) {
				case 0:
					$("#wrap1,#wrap2").hide();
					$("#wrap0").show();
					break;
				case 1:
					$("#wrap0,#wrap2").hide();
					$("#wrap1").show();
					break;
				case 2:
					$("#wrap0,#wrap1").hide();
					$("#wrap2").show();
					if ($("#wrap2").attr("flag") == "false") {
						$("#wrap2").attr("flag", "true");
						getResidentialAreaAroundInfo($scope, communityinformationServices, $layer);
					}

					break;
			}

		})


		$scope.next = function() {
			if ($scope.getResidentialAreaDeta.residentialAreaName == null || $scope.getResidentialAreaDeta.residentialAreaName == "" || $scope.getResidentialAreaDeta.residentialAreaName == undefined) {
				return false;
			} else {
				window.location.href = "#/accuratevaluation?residentialAreaID=" + $scope.formData.residentialAreaID + "&residentialAreaName=" + $scope.getResidentialAreaDeta.residentialAreaName;
			}
		}
	}).filter('unsafe', ['$sce', function($sce) {
		return function(val) {
			return $sce.trustAsHtml(val);
		};
	}]);

});

//获取URL参数
function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getResidentialAreaDetai($scope, communityinformationServices, $layer) {
	$scope.ngloading = true;
	communityinformationServices.getResidentialAreaDetai($scope.formData).success(function(data, statue) {
		$scope.ngloading = false;
		if (data.code == 200) {
			$scope.getResidentialAreaDeta = data.data;
			if ($scope.getResidentialAreaDeta.imagesList != null && $scope.getResidentialAreaDeta.imagesList.length > 2) {
				$("#pic").attr("src", $scope.getResidentialAreaDeta.imagesList[1].url);
			} else {
				$("#pic").attr("src", "http://fungugu.com/content/images/untitledBig_d42e273.jpg");
			}

			$scope.getResidentialAreaDeta.unitPrice = upade($scope.getResidentialAreaDeta.unitPrice);

			$scope.getResidentialAreaDeta.xiangbitongyuestr = "";
			$scope.getResidentialAreaDeta.xiangbishangyuestr = "";
			if (parseFloat($scope.getResidentialAreaDeta.ratioByLastYearForPrice) > 0) {
				$scope.getResidentialAreaDeta.xiangbitongyuestr = '<i class="error_color pad_lr_5">' + (parseFloat($scope.getResidentialAreaDeta.ratioByLastYearForPrice) * 100).toFixed(2) + '%</i>';
			} else if ($scope.getResidentialAreaDeta.ratioByLastYearForPrice == 0 || $scope.getResidentialAreaDeta.ratioByLastYearForPrice == "0" || $scope.getResidentialAreaDeta.ratioByLastYearForPrice == "" || $scope.getResidentialAreaDeta.ratioByLastYearForPrice == null || $scope.getResidentialAreaDeta.ratioByLastYearForPrice == undefined || $scope.getResidentialAreaDeta.ratioByLastYearForPrice == 'undefined') {
				$scope.getResidentialAreaDeta.xiangbitongyuestr = '<i class="error_color pad_lr_5">0%</i>';
			} else if (parseFloat($scope.getResidentialAreaDeta.ratioByLastYearForPrice) < 0) {
				$scope.getResidentialAreaDeta.xiangbitongyuestr = '<i class="text_color_gren pad_lr_5">' + (parseFloat($scope.getResidentialAreaDeta.ratioByLastYearForPrice) * 100).toFixed(2) + '%</i>';
			}
			if (parseFloat($scope.getResidentialAreaDeta.ratioByLastMonthForPrice) > 0) {
				$scope.getResidentialAreaDeta.xiangbishangyuestr = '<i class="error_color pad_lr_5">' + (parseFloat($scope.getResidentialAreaDeta.ratioByLastMonthForPrice) * 100).toFixed(2) + '%</i>';
			} else if ($scope.getResidentialAreaDeta.ratioByLastMonthForPrice == 0 || $scope.getResidentialAreaDeta.ratioByLastMonthForPrice == "0" || $scope.getResidentialAreaDeta.ratioByLastMonthForPrice == "" || $scope.getResidentialAreaDeta.ratioByLastMonthForPrice == null || $scope.getResidentialAreaDeta.ratioByLastMonthForPrice == undefined || $scope.getResidentialAreaDeta.ratioByLastMonthForPrice == 'undefined') {
				$scope.getResidentialAreaDeta.xiangbishangyuestr = '<i class="error_color pad_lr_5">0%</i>';
			} else if (parseFloat($scope.getResidentialAreaDeta.ratioByLastMonthForPrice) < 0) {
				$scope.getResidentialAreaDeta.xiangbishangyuestr = '<i class="text_color_gren pad_lr_5">' + (parseFloat($scope.getResidentialAreaDeta.ratioByLastMonthForPrice) * 100).toFixed(2) + '%</i>';
			}

		} else {
			var str = "当前城市暂无此小区信息，请选择切换城市";
			$layer.open({
				content: str,
				btn: ['确定']
			});
		}


	}).error(function(data, statue) {
		$scope.ngloading = false;
		$layer.open({
			content: handler.netErrorMsg,
			btn: ['ok']
		});
	});
}

function getResidentialAreaAroundInfo($scope, communityinformationServices, $layer) {
	$scope.ngloading = true;
	communityinformationServices.getResidentialAreaAroundInfo($scope.formData).success(function(data, statue) {
		if (data.code == 200) {
			$scope.getResidentialAreaAroundInfo = data.data;
			$scope.schoolMap = [],
				$scope.hospitalMap = [],
				$scope.supermarketMap = [],
				$scope.bankMap = [],
				$scope.parkMap = [],
				$scope.busStationMap = [],
				$scope.subwayStationMap = [];
			$scope.schoolMap = arryplice($scope.getResidentialAreaAroundInfo.schoolMap);
			$scope.hospitalMap = arryplice($scope.getResidentialAreaAroundInfo.hospitalMap);
			$scope.supermarketMap = arryplice($scope.getResidentialAreaAroundInfo.supermarketMap);
			$scope.bankMap = arryplice($scope.getResidentialAreaAroundInfo.bankMap);
			$scope.parkMap = arryplice($scope.getResidentialAreaAroundInfo.parkMap);
			$scope.busStationMap = arryplice($scope.getResidentialAreaAroundInfo.busStationMap);
			$scope.subwayStationMap = arryplice($scope.getResidentialAreaAroundInfo.subwayStationMap);

		} else {}
		$scope.ngloading = false;

	}).error(function(data, statue) {
		$scope.ngloading = false;
		$layer.open({
			content: handler.netErrorMsg,
			btn: ['ok']
		});
	});
}

//获取浏览次数
function getresidentialAreaCount($scope, communityinformationServices, $layer) {
	communityinformationServices.getresidentialAreaCount($scope.formData).success(function(data, statue) {
		if (data.code = 200) {
			var id = data.data.id;
			$scope.times = data.data.count;
			updataResidentialAreaCount(communityinformationServices, id, $layer);
		} else {

		}
	}).error(function(data, statue) {
		$layer.open({
			content: handler.netErrorMsg,
			btn: ['OK']
		});
	});
}
//更新浏览次数
function updataResidentialAreaCount(communityinformationServices, id, $layer) {
	communityinformationServices.updataResidentialAreaCount(id).success(function(data, statue) {

	}).error(function(data, statue) {
		$layer.open({
			content: handler.netErrorMsg,
			btn: ['OK']
		});
	});
}

function arryplice(arry) {
	var _length = arry.length;
	if (_length > 0) {

		if (_length == 1) {
			for (var i = 0; i < _length; i++) {
				arry[i].name = arry[i].name;
			}
		} else {
			for (var i = 0; i < _length; i++) {
				arry[i].name = arry[i].name + "、";
			}
			arry[_length].name = arry[_length].name.replace("、", "");
		}
		return arry;
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