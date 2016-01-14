/**
 * login/城市切换
 */
var WxData;
define(['app', 'jquery', 'handler', '_layer', '../../services/login/loginServices'], function(app, $, handler, $layer, loginServices) {
	app.controller('citySelectCtrl', function($scope, loginServices) {
		handler.setTitle("城市切换");
		$scope.formData = {};
		$scope.result = {};
		handler.isKeHuID();



		$scope.formData.keHuId = window.localStorage.getItem("keHuId");
		$scope.cityList = [];
		getcitylist($scope, loginServices, $layer);
		$scope.selected = function (i) {
		   // alert("$scope=" + $scope + "--$layer=" + $layer + "--loginServices=" + loginServices + "--i=" + i);
			bindMyCity($scope, $layer, loginServices, i);
		}

	});
});


//获取城市
function getcitylist($scope, loginServices, $layer) {

	loginServices.getCities($scope.formData).success(function(data, statue) {
	   // alert("获取城市:" + JSON.stringify(data));
		if (data.code == 200) {
			$scope.cityList = data.data;
			getbindCity($scope, loginServices, $layer);
		}
	}).error(function(data, statue) {

		$layer.open({
			content: handler.netErrorMsg,
			btn: ['OK']
		})
	});

}

//绑定城市
function bindMyCity($scope, $layer, loginServices, i) {
   // alert("城市选择");
	$scope.formData.cityId = $scope.cityList[i].id_zd;
	loginServices.bindCity($scope.formData).success(function(data, statue) {
	  //  alert("绑定城市:" + JSON.stringify(data));
		if (data.code == 200) {
			$scope.selectedRow = i;
			$("#text").text($scope.cityList[i].value_zd);
			window.localStorage.setItem("cityName", $scope.cityList[i].code_zd);
			CloseWindow();
		} else {

		}
	}).error(function(data, statue) {
		$layer.open({
			content: handler.netErrorMsg,
			btn: ['OK']
		})

	});
}

//获取绑定
function getbindCity($scope, loginServices, $layer) {
    loginServices.getbindCity($scope.formData).success(function (data, statue) {
       // alert("获取绑定城市:" + JSON.stringify(data));
		if (data.code == 200) {
			for (var i = 0; i < $scope.cityList.length; i++) {
				if (data.data.cityId === $scope.cityList[i].id_zd) {
					$scope.selectedRow = i;
					$("#text").text($scope.cityList[i].value_zd);
					window.localStorage.setItem("cityName", $scope.cityList[i].code_zd);
					getWechatPar(handler);
					break;
				}
			}

		} else {

		}
	}).error(function(data, statue) {
		$layer.open({
			content: handler.netErrorMsg,
			btn: ['OK']
		})

	});

}


//获取微信配置参数
function getWechatPar(handler, $layer) {
	var timestamp = Math.random();
	var lurl = window.location.href;
	var Url = handler.rootUrl + '/webservice/getWechatTicket?url=' + lurl + "&radom=" + timestamp;
	$.ajax({
		url: Url,
		async: false,
		dataType: "json",
		success: function (data) {
		  //  alert("微信参数:" + JSON.stringify(data));
			if (data.code == 200) {
				WxData = data.data;
				wxConfig();
			} else {
				$layer.open({
					content: handler.netErrorMsg,
					btn: ['OK']
				})

			}
		}
	});
}

//微信配置
function wxConfig() {
	wx.config({
		debug: false,
		appId: WxData.appId,
		timestamp: WxData.timesTamp,
		nonceStr: WxData.nonceStr,
		signature: WxData.signaTure,
		jsApiList: [
			'closeWindow'
		]
	});
}

//关闭网页
function CloseWindow() {
	wx.ready(function() {
		wx.closeWindow();
	})
}