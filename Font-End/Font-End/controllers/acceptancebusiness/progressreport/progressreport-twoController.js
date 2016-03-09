/**
 * progressreport-two/报告进度2
 */
define(['app', 'jquery', 'handler', '_layer', '../../../services/acceptancebusiness/progressreport/progressreportServices'], function(app, $, handler, $layer, progressreportServices) {
	app.controller('Progressreport-twoCtrl', function($scope, progressreportServices) {
		var keHuId = window.localStorage.getItem("keHuId");
		var itype = 5;
		var cityName = window.localStorage.getItem("cityName");
		$scope.items = {};
		handler.setTitle("报告进度");
		//用户登陆判断
		handler.isKeHuID();
		//初始化参数 测试用 发布需要删除掉
		//initParam();
		$scope.isNull = false;

		getCommissionedEvaluationByType($scope, progressreportServices);

		//获取报告
		function getCommissionedEvaluationByType($scope, progressreportServices) {
			progressreportServices.getCommissionedEvaluationByType(keHuId, itype, cityName).success(function(result, statue) {
				if (result.code == 200) {
					if (result.data.result.length > 0) {
						$scope.isNull = true;
						$scope.items = result.data.result.slice(0, 6);
					} else {
						$scope.isNull = false;
					}
				} else {
					$scope.isNull = false;
				}
			}).error(function(data, statue) {
				$scope.isNull = false;
			});

		}

		//跳转到报告进度详细界面
		$scope.gotoDetails = function(weiTuoPingGuNo) {
			if (weiTuoPingGuNo.length > 0) {
				window.location.href = "#/progressdetails-one?weiTuoPingGuNo=" + weiTuoPingGuNo;
			} else {
				var tempWeiTuoPingGuNo = $("#weiTuoPingGuNo").val();
				var re = /^[0-9]*[1-9][0-9]*$/;
				var msg = "请输入正确的12位订单号";
				if (tempWeiTuoPingGuNo.length <= 0 || tempWeiTuoPingGuNo.length > 12 || !re.test(tempWeiTuoPingGuNo)) {
					message($layer, msg);
				} else {
					$("#loadingToast").show();
					progressreportServices.findcommissionedEvaluation(keHuId, cityName, tempWeiTuoPingGuNo).success(function(result, statue) {
						$("#loadingToast").hide();
						$("button").blur();
						if (result.code == 200) {
							if (result.data != null && result.data.result.length > 0) {
								window.location.href = "#/progressdetails-one?weiTuoPingGuNo=" + tempWeiTuoPingGuNo;
							} else {
								message($layer, msg);
							}
						} else {
							message($layer, msg);
						}
					}).error(function(data, statue) {
						$("#loadingToast").hide();
						$("button").blur();
					});
				}
			}
		}

		//格式化空字符
		$scope.formatNull = function(concent) {
			if (concent === "null" || concent === "Null" || concent == null || concent == undefined) {
				return "";
			}
			return concent;
		}

		//格式化日期
		$scope.formatDate = function(concent) {
			var i = concent.indexOf(' ');
			return concent.substring(0, i);
		}

		//显示提示信息
		function message($layer, msg) {
			$layer.open({
				content: msg,
				time: 2
			});
		}

		//初始化参数 测试用 发布需要删除掉
		function initParam() {
			if (cityName == null || cityName.length <= 0) {
				cityName = 'beijing';
			}
			if (keHuId == null || keHuId.length <= 0) {
				keHuId = '11';
			}
		}

	});

});