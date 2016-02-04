/**
 * searchCtrl/小区模糊查询
 */
define(['app', 'jquery', '_layer', 'handler', 'jValidate', 'jValidateexpand', '../../services/search/searchServices'], function(app, $, $layer, handler, searchServices) {
    app.controller('searchCtrl', function($scope, searchServices) {

        handler.setTitle("小区模糊查询");
        //handler.isKeHuID();
        $("#wrap").css({
            "height": "100%"
        });
        $("#isnull,#notnull,#special").hide();
        $scope.formData = {};
        $scope.result = {};
        $scope.list = [];
        $scope.isBig = false;

        $scope.formData.keHuId = window.localStorage.getItem("keHuId");
        $scope.formData.cityName = window.localStorage.getItem("cityName");
        $scope.selectedRow = 0;

        $scope.result.residentialAreaName = getParameterByName("residentialAreaName")
        if ($scope.result.residentialAreaName == "" || $scope.result.residentialAreaName == undefined || $scope.result.residentialAreaName == 'undefined') {
            $scope.formData.residentialAreaName = "";
        } else {
            $scope.formData.residentialAreaName = $scope.result.residentialAreaName;
        }
        searched($scope, searchServices);


        $("#residentialAreaName").on('keyup paste', function() {
            searchContent($scope, searchServices, $);

        });
        $("#residentialAreaName").blur(function() {
            searchContent($scope, searchServices, $);

        })

        $scope.pressedit = function() {
            searchContent($scope, searchServices, $);
        }

        $scope.select = function(i) {
            $scope.selectedRow = i;
            $scope.formData.residentialAreaID = $scope.list[i].residentialAreaid;
            window.location.href = "#/communityinformation?residentialAreaID=" + $scope.formData.residentialAreaID

        };
    });
});
//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
//模糊匹配
function searchContent($scope, searchServices, $) {
    if ($.trim($(residentialAreaName).val()) == "") {

        $("#isnull").show();
        $("#notnull,#list,#special").hide();
    } else {
        if (/[\^【】\s@*$#~&\\\/]+$/.test($("#residentialAreaName").val())) {
            $("#special").show();
            $("#isnull,#notnull,#list").hide();
        } else {
            $("#isnull,#special").hide();
            $("#list,#notnull").show();
            $scope.formData.residentialAreaName = $.trim($("#residentialAreaName").val());
            searched($scope, searchServices);
        }
    }

}

//模糊匹配结果
function searched($scope, searchServices) {
    searchServices.search($scope.formData).success(function(data, statue) {
        if (data.code == 200) {
            $scope.list = data.data;
            if ($scope.list.length == 0) {
                $scope.isnull = true;
                if ($scope.list.length > 15) {
                    $scope.isBig = false;
                } else {
                    $scope.isBig = true;
                }
            } else {
                $scope.isnull = false;
            }

        } else {

        }

    }).error(function(data, statue) {});
}