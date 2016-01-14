/**
 * authenticityresults/查询结果
 */
define(['app', 'jquery', 'handler', '_layer', 'jValidate', 'jValidateexpand', 'autocomplete', '../../../services/reportofauthenticity/authenticitycheckServices'], function (app, $, handler, $layer, authenticitycheckServices) {
    app.controller('AuthenticityresultsCtrl', function ($scope, authenticitycheckServices) {
        handler.setTitle("真伪结果");
        $scope.formData = {};
        $scope.formData.reportNum = getParameterByName("reportNum");
        $scope.formData.client =getParameterByName("client");
        selectReport($scope, $layer, authenticitycheckServices);
    });

});


//真伪查询
function selectReport($scope, $layer, Services) {
    Services.selectReport($scope.formData).success(function (data, statue) {
        $scope.ReportInfo = {};
        if (data.code == 200) {
            if (data.data != null) {
                $scope.ReportInfo = data.data;
            }
            else {
                $layer.open({
                    content: "您输入的报告编号与委托方名称不匹配",
                })
            }
        }
        else {
            $scope.ReportInfo = null;
        }
    }).error(function (data, statue) {

    });
}

//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}