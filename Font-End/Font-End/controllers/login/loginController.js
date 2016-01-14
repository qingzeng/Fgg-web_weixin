/**
 * login/登录
 */

//alert("url" + window.location.href);
var WxData;
window.localStorage.setItem("code", getParameterByName("code"));
if (getParameterByName("openid") == "" || getParameterByName("openid") == null || getParameterByName("openid") == "null") {
    //setcode();
    // window.localStorage.setItem("openid", "200616315");

} else {
    window.localStorage.setItem("openid", getParameterByName("openid"));

}
define(['app', 'jquery', 'handler', '_layer', 'jValidate', 'jValidateexpand', '../../services/login/loginServices'], function(app, $, handler, $layer, loginServices) {
    app.controller('LoginCtrl', function($scope, loginServices) {
        handler.setTitle("登录界面");
        $scope.isloading = false;
        GetCode(handler, $layer);

        wxconfig();

        var openid = window.localStorage.getItem("openid");
        // alert("openid=" + openid);
        if (openid == "" || openid == null || openid == "null" || openid == undefined || openid == 'undefined') {
            setcode();
        } else {
            getkeHuIdByOpenId($scope, $layer, $, handler, openid);
        }
        formvalidate();
        $scope.commit = function() {
            var flag = $("#formData").valid();
            if (flag) {
                $scope.formData.openid = window.localStorage.getItem("openid");
                $scope.isloading = true;
                loginServices.login($scope.formData).success(function(data, statue) {
                    $scope.isloading = false;
                    if (data.code == 200) {
                        $scope.formData.keHuId = data.data.id;
                        window.localStorage.setItem("keHuId", $scope.formData.keHuId);
                        //$layer.open({
                        //    content: "登陆成功",
                        //})
                        getKeHuCitylist($scope, $layer, loginServices);
                    } else {
                        $layer.open({
                            content: "用户名或密码错误",
                        })
                    }
                }).error(function(data, statue) {
                    $scope.isloading = false;
                    $layer.open({
                        content: handler.netErrorMsg,
                    })
                });

            }

        };

        function formvalidate() {

            $("#formData").validate({
                focusout: true,
                onsubmit: false,
                rules: {
                    userName: {
                        required: true
                    },
                    password: {
                        required: true
                    },

                },
                messages: {
                    userName: {
                        required: "请输入用户名称!"
                    },
                    password: {
                        required: "请输入密码!",
                        stringCheck: "请输入正确格式的密码!"
                    },

                },
                success: function(label) {
                    label.closest('.form_valid').next(".error").remove();
                    $("#" + label[0].control.id).parent().parent().parent().removeClass('error_bor');
                },
                errorPlacement: function(error, element) {
                    element.closest('.form_valid').next(".error").remove();
                    if (error[0].innerHTML != "") {
                        var html = '<div class="error" style="padding:5px 0">' + '<label><span class="error_color">错误提示：</span>' + error[0].innerHTML + '</label>' + '</div>';
                        element.closest('.form_valid').after(html);
                        element.closest('.form_valid').addClass('bor error_bor');
                        $("#" + element[0].id).focus();
                    }
                }
            });
        }

        //根据code获取客户信息
        function setcode() {
            var timestamp = Math.random();
            var code = window.localStorage.getItem("code");
            var Url = handler.rootUrl + '/webservice/getWechatOpenid?code=' + code + "&radom=" + timestamp;
            $.ajax({
                url: Url,
                async: false,
                dataType: "json",
                success: function(data) {
                    // alert("code=" + JSON.stringify(data));
                    if (data.code == 200 && data.data != null) {
                        var myOpenid = data.data.openid;
                        var myCid = data.data.cid;
                        if (myOpenid != undefined && myOpenid != null && myOpenid != "null") {
                            window.localStorage.setItem("openid", myOpenid);
                        }

                        if (myCid != undefined && myCid != null && myCid != "null") {
                            window.localStorage.setItem("keHuId", myCid);
                        }

                    } else {
                        window.localStorage.setItem("keHuId", null);
                        $layer.open({
                            content: "获取客户信息失败code",
                        })
                    }
                }
            });
        }
    });
});


//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

//获取城市
function getKeHuCitylist($scope, $layer, loginServices) {

    loginServices.getCities($scope.formData).success(function(data, statue) {
        // alert("获取城市=" + JSON.stringify(data));
        if (data.code == 200) {
            if (data.data == null || data.data == undefined || data.data.length == 0) {
                $layer.open({
                    content: "您没有开通城市",
                    btn: ['OK']
                });
                return;
            }
            if (data.data.length == 1) {

                $scope.formData.cityId = data.data[0].id_zd;

                window.localStorage.setItem("cityName", data.data[0].code_zd);
                bindcity($scope, loginServices);
            } else {
                window.location.href = "#/citySelect";
            }

        } else {
            $layer.open({
                content: data.msg,
                btn: ['OK']
            });
        }
    }).error(function(data, statue) {


    });

}

//绑定城市
function bindcity($scope, loginServices) {

    loginServices.bindCity($scope.formData).success(function(data, statue) {
        if (data.code == 200) {
            //  alert("xxx");
            //window.localStorage.setItem("cityName", $scope.formData.cityCode);
            CloseWindow();
        } else {
            // alert("xxx123");
            window.location.href = "#/citySelect";
        }
    }).error(function(data, statue) {});

}

//通过openid获取kehuId
function getkeHuIdByOpenId($scope, $layer, $, handler, openid) {
    var Url = handler.rootUrl + '/webservice/getUserByOpenid';
    var params = {
        openid: openid
    }
    $.ajax({
        url: Url,
        async: false,
        data: params,
        type: "get",
        dataType: "json",
        success: function(data) {
            //alert("openid=" + JSON.stringify(data));
            if (data.code == 200) {
                var myCid = data.data;

                if (myCid != undefined && myCid != null && myCid != "null") {
                    window.localStorage.setItem("keHuId", myCid);
                }
            } else {
                window.localStorage.setItem("keHuId", null);
                $layer.open({
                    content: "获取客户信息失败openid",
                })
            }
        }
    });
}

//通过openid获取kehuId
function getkeHuId($scope, $layer, loginServices, id) {

    loginServices.getkeHuId(id).success(function(data, statue) {

        if (data.code == 200) {
            window.localStorage.setItem("keHuId", data.data);
        } else {
            $layer.open({
                content: "获取客户信息失败openid",
            })
        }
    }).error(function(data, statue) {
        $layer.open({
            content: handler.netErrorMsg,
            btn: ['OK']
        })

    });
}

//获取微信配置信息
function GetCode(handler, $layer) {
    var timestamp = Math.random();
    var lurl = window.location.href;
    var Url = handler.rootUrl + '/webservice/getWechatTicket?url=' + lurl + "&radom=" + timestamp;
    $.ajax({
        url: Url,
        async: false,
        dataType: "json",
        success: function(data) {
            if (data.code == 200) {
                WxData = data.data;
            } else {
                $layer.open({
                    content: handler.netErrorMsg,
                    btn: ['OK']
                })

            }
        }
    });
}

//微信配置
function wxconfig() {
    //alert("xx123");
    wx.config({
        debug: false,
        appId: WxData.appId,
        timestamp: WxData.timesTamp,
        nonceStr: WxData.nonceStr,
        signature: WxData.signaTure,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    });
}

//关闭网页
function CloseWindow() {
    wx.ready(function() {
        wx.closeWindow();
    })
}