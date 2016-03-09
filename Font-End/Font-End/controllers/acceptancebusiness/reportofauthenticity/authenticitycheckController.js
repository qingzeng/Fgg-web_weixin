/**
 * authenticitycheckController/真伪查询
 */
var WxData;
define(['app', 'jquery', 'handler', '_layer', 'jValidate', 'jValidateexpand', 'autocomplete', '../../../services/reportofauthenticity/authenticitycheckServices'], function (app, $, handler, $layer, authenticitycheckServices) {
    app.controller('AuthenticitycheckCtrl', function ($scope, authenticitycheckServices) {
        handler.setTitle("真伪查询");
        //  $scope.formData = {};
        //ert(wx);
        getWechatPar(handler);//加载微信配置
        //wxConfig();//设置配置

        $scope.truesubmit = function () {
            var flag = $("#authenticitycheck").valid();
            if (flag) {
                selectCheckReport($scope, $scope.formData, $layer, authenticitycheckServices);
            }
        }

        $scope.scanningSweep = function () {
            wxReadyLoading($scope, $layer, authenticitycheckServices);
        }


        $("#authenticitycheck").validate({
            focusout: true,
            onsubmit: false,
            rules: {
                reportunm: { //报告编号
                    required: true,
                    isDigits: true,
                    minlength: 15,
                    maxlength: 15
                },
                entrustname: { //委托方的姓名
                    required: true,
                }
            },
            messages: {
                reportunm: {
                    required: "请输入报告编号!",
                    isDigits: "请输入正确的15位报告编号!",
                    maxlength: "请输入正确的15位报告编号!",
                    minlength: "请输入正确的15位报告编号!"
                },
                entrustname: {
                    required: "请输入委托方的姓名!",
                },
            },
            success: function (label) {
                label.closest('.form_valid').next(".error").remove();
                $("#" + label[0].control.id).parent().removeClass('error_bor');
            },
            errorPlacement: function (error, element) {
                element.closest('.form_valid').next(".error").remove();
                if (error[0].innerHTML != "") {
                    var html = '<div class="weui_cell text-bg-gray error">' + '<label><span class="error_color">提示：</span>' + error[0].innerHTML + '</label>' + '</div>';
                    element.closest('.form_valid').after(html);
                    element.closest('.form_valid').addClass('bor error_bor');
                    $("#" + element[0].id).focus();
                }
            }
        });
    });

});

//真伪查询
function selectCheckReport($scope, Data, $layer, Services) {
    $("#loadingToast").show();
    Services.selectReport(Data).success(function (data, statue) {
        $scope.ReportInfo = {};
        $("#loadingToast").hide();
        $("button").blur();
        if (data.code == 200) {
            if (data.data != null) {
                $scope.ReportInfo = data.data;
                var Url = "#/authenticityresults?reportNum=" + Data.reportNum + "&client=" + Data.client;
                window.location.href = Url;
            }
            else {
                //alert("您输入的报告编号与委托方名称不匹配，请确认");
                $layer.open({
                    content: "您输入的报告编号与委托方名称不匹配",
                })
            }
        }
        else {
            $scope.ReportInfo = null;
            $layer.open({
                content: "您输入的报告编号与委托方名称不匹配",
            })
        }
    }).error(function (data, statue) {
       $("#loadingToast").hide();
        $("button").blur();
    });
}

//获取微信配置参数
function getWechatPar(handler) {
    var timestamp = Math.random();
    var lurl = window.location.href;
    var Url = handler.rootUrl + '/webservice/getWechatTicket?url=' + lurl + "&radom=" + timestamp;
    $.ajax({
        url: Url,
        async: true,
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                //alert(.appId);
                WxData = data.data;
                wxConfig();
            }
            else {
                alert("网络请求异常");
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
          'scanQRCode'
        ]
    });
}


//微信方法执行
function wxReadyLoading($scope, $layer, Services) {
    wx.ready(function () {
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

                var index = result.indexOf('&');
                if (index < 0) {
                    alert("二维码不符合规则");
                    return;
                }
                var reportNo = result.substr(0, index);
                var client = result.substr(index + 1);
                var fData = {};
                fData.reportNum = reportNo;
                fData.client = client;
                selectCheckReport($scope, fData, $layer, Services);
            }
        });
    });
}