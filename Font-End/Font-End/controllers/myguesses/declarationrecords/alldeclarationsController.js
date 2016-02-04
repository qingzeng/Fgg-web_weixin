/**
 * alldeclarations/全部报单
 */
define(['app', 'jquery', 'handler', '_layer', '_swipe', '../../../services/myguesses/declarationrecords/declarationServices'],
    function(app, $, handler, $layer, declarationServices) {
        app.controller('AlldeclarationsCtrl', function($scope, declarationServices) {
            //var mySwiper;
            $scope.noData = false;
            handler.setTitle("全部报单");
            //判断客户ID是否存在 微信客户端使用
            handler.isKeHuID();
            $scope.formData = {};
            /***
             * 首次进入页面 显示全部，请求接口
             */
            $scope.selectedRow = 5;
            /***
             * 未完成 按钮显示与否
             * @type {boolean}
             */
            $scope.unfinished = true;
            /***
             * 未完成按钮点击下标
             * @type {number}
             */
            $scope.isDeal = 1;
            $("#showlist").show();
            $("#shownull").hide();

            $scope.formData.pageIndex = 1;
            $scope.formData.pageSize = 7;
            $scope.formData.type = $scope.selectedRow;

            getlist($scope, declarationServices)
                /***
                 * 头部 tab 切换 事件
                 * @param index
                 */
            $scope.selected = function(index) {
                $scope.selectedRow = index;
                if (index == 1) {
                    $scope.unfinished = false;
                } else {
                    $scope.unfinished = true;
                }
                $scope.formData.pageIndex = 1;
                $scope.formData.pageSize = 7;
                $scope.formData.type = index;
                getlist($scope, declarationServices);
            }

            /***
             * 未完成 是否处理按钮点击事件
             * @param index
             */
            $scope.isDealSet = function(index) {
                $scope.isDeal = index;
                $scope.selectedRow = index;
                $scope.formData.pageIndex = 1;
                $scope.formData.pageSize = 7;
                $scope.formData.type = index;
                getlist($scope, declarationServices);
            }

            $(function() {

                $("#list").swipe({
                    swipe: function(event, direction, distance, duration, fingerCount) {
                        if (direction == "left") {
                            if ($scope.formData.pageIndex == $scope.Total) {

                            } else {
                                $scope.formData.pageIndex = $scope.formData.pageIndex + 1;

                                getlist($scope, declarationServices);
                            }
                        } else if (direction == "right") {
                            if ($scope.formData.pageIndex == 1) {

                            } else {
                                $scope.formData.pageIndex = $scope.formData.pageIndex - 1;

                                getlist($scope, declarationServices);
                            }
                        }
                    }
                });
            })

        });

    });


function getlist($scope, declarationServices) {
    $("#loadingToast").show();
    declarationServices.getDeclarationInfo($scope.formData).success(function(data, statue) {
        $("#loadingToast").hide();
        if (data.code == 200) {
            if (data.data.count == 0) {
                $("#showlist").hide();
                $("#shownull").show();

            } else {
                $("#showlist").show();
                $("#shownull").hide();
                $scope.norecord = false;
                $scope.formData.pageIndex = data.data.pageIndex;
                $scope.pagetotal = data.data.count;
                $scope.recordlist = data.data.result;

                if ($scope.pagetotal > 0 && $scope.pagetotal <= 7) {
                    $scope.Total = 1;
                } else {

                    if ($scope.pagetotal > 7 && $scope.pagetotal % 7 > 0) {
                        $scope.Total = parseInt(($scope.pagetotal / 7)) + 1;
                    } else {
                        $scope.Total = parseInt(($scope.pagetotal / 7));
                    }
                }

            }

        } else {
            $("#showlist").hide();
            $("#shownull").show();
        }

    }).error(function(data, statue) {
        $("#loadingToast").hide();
        $("#showlist").hide();
        $("#shownull").show();
    });
}