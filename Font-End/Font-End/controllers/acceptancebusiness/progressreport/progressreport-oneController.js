/**
 * progressdetails-oneController/报告详细
 */
define(['app', 'jquery','handler','../../../services/acceptancebusiness/progressreport/progressreportServices'], function(app, $,handler,progressreportServices) {
app.controller('Progressreport-oneCtrl', function ($scope, progressreportServices) {
	$scope.items = {};
	handler.setTitle("报告进度");
	//用户登陆判断
  handler.isKeHuID();
	var keHuId = window.localStorage.getItem("keHuId");
	var cityName = window.localStorage.getItem("cityName");
  //initParam();
	//获取报告进度结果
	getData($scope,progressreportServices);

	var height=$(window).height()-$("#top").height()-$("#fixedbottom").height();
	$("#divCompany").css("height",height-50);

	function getData($scope,progressreportServices) {
		progressreportServices.getEstimateCompanyByKeHuId(keHuId).success(function(result, statue) {
 			if (result.code == 200) {
				var data = result.data;
				if(data != null){
					var CityList = new Array();
					var CityStr = "";
					//获取所有城市
					for (var i = 0; i < data.length; i++) {
						 var obj = {};
						 obj.cityName = data[i].codezd;
						 obj.companyList = {};
						 if (CityStr.indexOf(obj.cityName) < 0) {
								 CityList.push(obj);
								 CityStr += data[i].codezd + ",";
						 }
					}

					//把评估公司加入到城市对象
					for (var j = 0; j < CityList.length; j++) {
						 var cityName = CityList[j].cityName;
						 var companyList =Array();
						 for (var i = 0; i < data.length; i++) {
								 if (cityName == data[i].codezd)
								 {
										 companyList.push(data[i].valuezd);
								 }
						 }
						 CityList[j].companyList = companyList;
					}
					$scope.CityList = CityList;
				}
 			}
 		}).error(function(data, statue) {});
	}

	//初始化参数测试用发布需要删除掉
	function initParam(){
		if(cityName == null || cityName.length <= 0){
			cityName='beijing';
		}
		if(keHuId == null || keHuId == "null" || keHuId.length <= 0){
			keHuId='13144541';
		}
	}
});

});
