/**
 * valuationdetails/估价记录详情
 */
define(['app', 'jquery', 'handler', '../../../services/myguesses/valuationrecordServices'], function(app, $, handler, valuationrecordServices) {
    app.controller('ValuationdetailsCtrl', function($scope, valuationrecordServices) {
        handler.setTitle("估价详情");
        //服务请求
        $scope.formData = {};
        $scope.recordsdetial = {};
        var keHuId = window.localStorage.getItem("keHuId");
        var cityName = window.localStorage.getItem("cityName");
        $scope.formData.jiLuId = getParameterByName("jiLuId");
        //结果存储
        getdetail($scope, valuationrecordServices);

        //委托报单
        $scope.entrust = function() {
                window.location.href = "#/delegatedeclaration?area=" + $scope.recordsdetial.weituopinggumianji +
                    "&residentialAreaID=" + $scope.recordsdetial.xiaoquid+
                    "&residentialAreaName=" + $scope.recordsdetial.weituopingguxiangmu +
                    "&roomtype=" + $scope.recordsdetial.jushileixing +
                    "&currentfloor=" + $scope.recordsdetial.suozailouceng +
                    "&totalfloor=" + $scope.recordsdetial.zonglouceng +
                    "&address=" + $scope.recordsdetial.xiangxidizhi;
            }
        //重新估价
        $scope.appraisal = function() {
            window.location.href = "#/accuratevaluation?area=" + $scope.recordsdetial.weituopinggumianji +
                "&residentialAreaID=" + $scope.recordsdetial.xiaoquid +
                "&residentialAreaName=" + $scope.recordsdetial.weituopingguxiangmu +
                "&roomtype=" + $scope.recordsdetial.jushileixing +
                "&unit="+$scope.recordsdetial.huhao+
                "&toward="+$scope.recordsdetial.chaoxiang+
                "&special="+$scope.recordsdetial.teshuyinsu+
                "&buildingnum="+$scope.recordsdetial.louzhuanghao+
                "&currentfloor=" + $scope.recordsdetial.suozailouceng +
                "&totalfloor=" + $scope.recordsdetial.zonglouceng+
                "&buildyear="+$scope.recordsdetial.jianchengniandai;
        }
    });
});

//获取估价记录详情
function getdetail($scope, valuationrecordServices) {
    $("#loadingToast").show();
    valuationrecordServices.recorddetails($scope.formData).success(function(data, statue) {
        if (data.code == 200) {
            $scope.recordsdetial = data.data;
        } else {
            $layer.open({
                content: '服务器繁忙，请稍后再试！',
                style: 'background-color:#09C1FF; color:#fff; border:none;',
                time: 2
            });
        }
        $("#loadingToast").hide();
    }).error(function(data, statue) {
        $("#loadingToast").hide();

    });
}
//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
