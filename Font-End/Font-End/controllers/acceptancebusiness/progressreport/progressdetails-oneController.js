/**
 * progressdetails-oneController/报告详细
 */
var keHuId = window.localStorage.getItem("keHuId");
var cityName = window.localStorage.getItem("cityName");
define(['app', 'jquery', 'handler', '../../../services/acceptancebusiness/progressreport/progressreportServices'], function(app, $, handler, progressreportServices) {
	app.controller('Progressdetails-oneCtrl', function($scope, progressreportServices) {
		$scope.items = {};
		handler.setTitle("报告进度");
		//用户登陆判断
		handler.isKeHuID();
		//initParam();
		//获取报告进度结果
		getData($scope, progressreportServices);
	});
});

function getData($scope, progressreportServices) {
	var weiTuoPingGuNo = getParameterByName("weiTuoPingGuNo");
	progressreportServices.findcommissionedEvaluation(keHuId, cityName, weiTuoPingGuNo).success(function(result, statue) {
		if (result.code == 200) {
			$scope.items = result.data.result;
			for (var i = 0; i < $scope.items.length; i++) {
				if ($scope.items[i].createdDate.indexOf(".") >= 0) {
					var j = $scope.items[i].createdDate.indexOf(".");
					$scope.items[i].createdDate =$scope.items[i].createdDate.substring(0, j);
				}
			}
		}
	}).error(function(data, statue) {});
}

//初始化参数 测试用 发布需要删除掉
function initParam() {
	if (cityName == null || cityName.length <= 0) {
		cityName = 'beijing';
	}
	if (keHuId == null || keHuId.length <= 0) {
		keHuId = '13144541';
	}
}

//获取URL参数
function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}