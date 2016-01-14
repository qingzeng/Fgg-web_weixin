/**
 * feportofauthenticity/报告真伪
 */
define(['app', 'jquery', 'handler', '../../../services/reportofauthenticity/authenticitycheckServices'], function (app, $, handler, authenticitycheckServices) {
    app.controller('FeportofauthenticityCtrl', function ($scope, authenticitycheckServices) {
        handler.isKeHuID();
        handler.setTitle("报告真伪");
        //查询跳转
        $scope.startSelect = function () {
            window.location.href = "#/authenticitycheck";
        };

        var height = $(window).height() - $("#top").height() - $("#fixedbottom").height();
        $("#divCompany").css("height", height - 50);

        $scope.formData = {};
        $scope.formData.keHuId = window.localStorage.getItem("keHuId");
        getCityInfo($scope, authenticitycheckServices);
        // alert($scope.cityList);


    });
});

//获取城市和评估公司信息
function getCityInfo($scope, Services) {
    Services.getCityInfo($scope.formData).success(function (data, statue) {
        if (data.code == 200) {
            // $scope.cityList = data.data;
            var result = data.data;
            if (result != null) {
                var CityList = new Array();
                var CityStr = "";
                //获取所有城市
                for (var i = 0; i < result.length; i++) {
                    var obj = {};
                    obj.cityName = result[i].codezd;
                    obj.conpanyList = {};
                    if (CityStr.indexOf(obj.cityName) < 0) {
                        CityList.push(obj);
                        CityStr += result[i].codezd + ",";
                    }
                }

                //把评估公司加入到城市对象中
                for (var j = 0; j < CityList.length; j++) {
                    var cityName = CityList[j].cityName;
                    var companyList = Array();
                    for (var i = 0; i < result.length; i++) {
                        if (cityName == result[i].codezd) {
                            companyList.push(result[i].valuezd);
                        }
                    }
                    CityList[j].companyList = companyList;
                }
                $scope.CityList = CityList;
            }
        }
    }).error(function (data, statue) { });
}
