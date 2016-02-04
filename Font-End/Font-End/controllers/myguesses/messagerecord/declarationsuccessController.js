/**
 * declarationsuccess/消息正文
 */
define(['app', 'jquery', 'handler', '../../../services/myguesses/messagerecord/selectcaseServices'], function(app, $, handler, selectcaseServices) {
	app.controller('DeclarationsuccessCtrl', function($scope, selectcaseServices) {
		//设置界面标题
		handler.setTitle("消息正文");
		//判断用户是否登陆
		handler.isKeHuID();
		getData($scope, selectcaseServices);

		selectcaseServices.readMessage(getParameterByName("id")).success(function(result, statue) {
			if (result.code == 200) {}
		}).error(function(data, statue) {});
	}).filter('unsafe', ['$sce', function($sce) {
		return function(val) {
			return $sce.trustAsHtml(val);
		};
	}]);

});

//获取显示数据
function getData($scope, selectcaseServices) {
	var id = getParameterByName("id");
	selectcaseServices.getMessage(id).success(function(result, statue) {
		if (result.code == 200) {
			//处理显示信息
			var xiaoXiNeiRong = result.data.xiaoXiNeiRong;
			var keyIndex = xiaoXiNeiRong.indexOf("：") + 1;
			var xiaoXiNeiRongKey = xiaoXiNeiRong.substring(keyIndex, keyIndex + 12);
			var xiaoXiNeiRongSpan = "<span class='text_color_red'>" + xiaoXiNeiRongKey + "</span>";
			$scope.msg = xiaoXiNeiRong.replace(xiaoXiNeiRongKey, xiaoXiNeiRongSpan);
			//处理显示时间
			$scope.date = result.data.xiaoXiFaSongShiJian;
		 
		}
	}).error(function(data, statue) {});
}

//获取URL参数
function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}