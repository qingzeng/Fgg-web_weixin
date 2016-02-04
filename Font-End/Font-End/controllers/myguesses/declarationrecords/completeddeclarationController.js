/**
 * completeddeclaration/已完成报单
 */
define(['app', 'jquery', 'handler', '../../../services/myguesses/declarationrecords/declarationServices'],
    function(app, $, handler, declarationServices) {
        app.controller('CompleteddeclarationCtrl', function($scope, declarationServices) {
            handler.isKeHuID();
            handler.setTitle("报单详情");


            $scope.commit = false;
            //显示两个按钮还是一个按钮
            $scope.isShowBut = false;
            //对话框颜色
            $scope.redContext = false;
            //报单号
            $scope.reportNum;
            var reportNum = getParameterByName('reportNum'); //报单号
            var reportStat = getParameterByName('reportStat'); // 报单状态
            switch (reportStat) {
                case '1': //未受理
                    $scope.isModify = true;
                    $scope.isChedan = true;
                    $scope.isCuidan = true;
                    break;
                case '2': //受理中
                    $scope.isModify = true;
                    $scope.isChedan = false;
                    $scope.isCuidan = true;
                    break;
                case '3': //已完成
                    $scope.isModify = true;
                    $scope.isChedan = false;
                    $scope.isCuidan = true;
                    break;
                case '4': //已中止
                    $scope.isModify = false;
                    $scope.isChedan = false;
                    $scope.isCuidan = false;
                    break;
                case '5': //全部
                    $scope.isModify = true;
                    $scope.isChedan = true;
                    $scope.isCuidan = true;
                    break;
                default:
                    $scope.isModify = true;
                    $scope.isChedan = true;
                    $scope.isCuidan = true;
            }

            if (reportNum && reportNum != null) {
                $scope.reportNum = reportNum;
            };


            //报单记录数组
            $scope.reportList = [];

            /***
             * 催单
             * @constructor
             */
            $scope.Cuidan = function() {
                if ($scope.isCuidan) {
                    cunDanCeDan('催单');
                }
            }

            /***
             * 修改
             * @constructor
             */
            $scope.Modify = function() {
                    if ($scope.isModify) {
                        $scope.commit = true;
                        $scope.redContext = false;
                        $scope.title = '';
                        $scope.isShowBut = false;
                        $scope.context = '您好，您的委托报单处于等待受理阶段，如需改动请联系客服：400-017-2707';
                        //TODO 弹出 对话框
                    }
                }
                /***
                 * 撤单
                 * @constructor
                 */
            $scope.Chedan = function() {
                if ($scope.isChedan) {
                    $scope.commit = true;
                    $scope.title = '估宝宝提醒';
                    $scope.redContext = true;
                    $scope.isShowBut = true;
                    $scope.context = '您是否确认撤单？撤单之后， 如想再次委托需重新委托报单。';
                    //
                }
            }


            /***
             * 关闭对话框
             */
            $scope.commitCancel = function() {
                $scope.commit = false;
            };
            /***
             * 撤单点击确定了
             */
            $scope.commitConfirm = function() {
                cunDanCeDan('撤单');
            };

            /***
             * 催单撤单
             * @param type
             */
            var cunDanCeDan = function(type) {
                var from = {
                    type: type,
                    reportNum: $scope.reportNum
                }
                declarationServices.editCommissionedEvaluation(from).success(function(data, dtatue) {
                    if (data.code == 200) {
                        // TODO 催单撤单成功
                        if (type == '催单') {
                            $scope.redContext = false;
                            $scope.title = '';
                            $scope.context = '您已催单成功，估宝宝将催促当地合作房地产评估机构加速作业进度！';
                            $scope.commit = true;
                            $scope.isShowBut = false;
                            $scope.isCuidan = false;
                        } else if (type == '撤单') {
                            $scope.commit = true;
                            $scope.isShowBut = false;
                            $scope.redContext = false;
                            $scope.title = '';
                            $scope.context = '您已提交撤单申请，估宝宝将知会当地合作房地产评估机构停止报告作业！';
                            $scope.isChedan = false;
                            $scope.isModify = false;
                            $scope.isCuidan = false;
                        }
                        //催单撤单后都要重新请求报单详情数据
                        getReportResult();
                    } else {

                    }
                }).error(function(data, statue) {

                });
            }

            /***
             * 获取报告详情
             */
            var getReportResult = function() {
                declarationServices.findCommissionedEvaluation({
                    reportNum: $scope.reportNum
                }).success(function(data, statue) {
                    if (data.code == 200) {
                        $scope.reportList = data.data.result;

                        for (var i = 0; i < $scope.reportList.length; i++) {
                            if ($scope.reportList[i].createdDate.indexOf(".") != -1) {
                                $scope.reportList[i].createdDate = $scope.reportList[i].createdDate.substring(0, $scope.reportList[i].createdDate.indexOf("."));
                            }
                        }
                        /*[
                         {
                         "reportProperty": "等待线下正式受理......",
                         "currentState": "等待受理",
                         "createdDate": "2016-01-07 14:39:57",
                         "projectNo": "538440697949"
                         },
                         {
                         "reportProperty": "等待线下正式受理......",
                         "currentState": "等待受理",
                         "createdDate": "2016-01-07 14:39:57",
                         "projectNo": "538440697949"
                         },
                         {
                         "reportProperty": "等待线下正式受理......",
                         "currentState": "等待受理",
                         "createdDate": "2016-01-07 14:39:57",
                         "projectNo": "538440697949"
                         },
                         {
                         "reportProperty": "等待线下正式受理......",
                         "currentState": "等待受理",
                         "createdDate": "2016-01-07 14:39:57",
                         "projectNo": "538440697949"
                         }
                         ]*/ //data.data;//.result;

                        /***
                         * 催单状态获取
                         */
                        if (data.data.isCuidan && data.data.isCuidan != null && data.data.isCuidan != "") {
                            if (data.data.isCuidan == '1') {
                                $scope.isCuidan = false;
                            } else if (data.data.isCuidan == '0') {
                                $scope.isCuidan = true;
                            }
                        } else {
                            $scope.isCuidan = true;
                        }

                        /**
                         * 撤单状态获取
                         */
                        if (data.data.isChedan && data.data.isChedan != null && data.data.isChedan != "") {
                            if (data.data.isChedan == '1') { // 已经撤单了
                                $scope.isChedan = false;
                                $scope.isModify = false;
                                $scope.isCuidan = false;
                            } else if (data.data.isChedan == '0') {
                                $scope.isChedan = true;
                            }
                        } else {
                            $scope.isChedan = true;
                        }

                    } else {
                        //TODO 获取报告详情失败
                    }

                }).error(function(data, statue) {

                });
            }
            getReportResult();

        });

    });
//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}