/**
 * valuationrecordController/估价记录列表
 */
define(['app', 'jquery', 'handler', '_swipe', '../../../services/myguesses/valuationrecordServices'], function(app, $, handler, valuationrecordServices) {
    app.controller('ValuationrecordCtrl', function($scope, valuationrecordServices) {
        handler.setTitle("估价记录");
        //判断用户是否登陆
        handler.isKeHuID();
        var keHuId = window.localStorage.getItem("keHuId");
        var cityName = window.localStorage.getItem("cityName");
        $scope.formData = {
            keHuId: keHuId,
            cityName: cityName,
            page: 1,
            pageSize: 7
        };
        $scope.norecord = false;
        $scope.totalPage;
        getrecordlist($scope, valuationrecordServices);
        $(function() {

            $("#ty_list").swipe({
                swipe: function(event, direction, distance, duration, fingerCount) {
                    if (direction == "left") {
                        if ($scope.formData.page >= $scope.totalPage) {
                            $scope.formData.page = $scope.formData.page;

                        } else {
                            $scope.formData.page = $scope.formData.page + 1;
                            $scope.formData.page = $scope.formData.page;
                            getrecordlist($scope, valuationrecordServices);
                        }
                    } else if (direction == "right") {
                        if ($scope.formData.page == 1) {

                        } else {
                            $scope.formData.page = $scope.formData.page - 1;
                            $scope.formData.page = $scope.formData.page;
                            getrecordlist($scope, valuationrecordServices);
                        }
                    }
                }
            });

        });


    });
});

//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getrecordlist($scope, valuationrecordServices) {
    $("#loadingToast").show();
    valuationrecordServices.recordlist($scope.formData).success(function(data, statue) {
        $("#loadingToast").hide();
        if (data.code == 200) {
            if (data.data.pageCount == 0) {
                $scope.norecord = true;
            } else {
                $scope.norecord = false;
                $scope.totalPage = data.data.pageCount;
                $scope.recordlist = data.data.result;
            }

        }

    }).error(function(data, statue) {
        $scope.norecord = true;
        $("#loadingToast").hide();

    });
}