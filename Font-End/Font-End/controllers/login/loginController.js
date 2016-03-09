/**
 * login/登录
 */

//alert("url" + window.location.href);
var WxData;
window.localStorage.setItem("code", getParameterByName("code"));
var myopenid = getParameterByName("openid");
if (myopenid == "" || myopenid == null || myopenid == "null") {
    //setcode();
    // window.localStorage.setItem("openid", "200616315");

} else {
    window.localStorage.setItem("openid", myopenid);

}
define(['app', 'jquery', 'handler', '_layer', 'jValidate', 'jValidateexpand', '../../services/login/loginServices'], function(app, $, handler, $layer, loginServices) {
    app.controller('LoginCtrl', function($scope, loginServices) {
        handler.setTitle("登录界面");
        $scope.user_info = true;
        $scope.isloading = false;
        GetCode(handler, $layer);
        $scope.commit = true;
        //用户个人提交
        $scope.userinfodetal = {};
        $scope.cityData = {};
        $scope.areaData = {};
        $scope.citylist = {}; //城市列表
        $scope.districts = {}; //区域列表
        $scope.user = {}; //发送验证请求
        $scope.isinfotrue = {};
        $scope.userinfodetal.gender = "男"; //默认选中的性别

        wxconfig();

        var openid = window.localStorage.getItem("openid");
        // alert("openid=" + openid);
        if (openid == "" || openid == null || openid == "null" || openid == undefined || openid == 'undefined') {
            setcode();
        } else {
            getkeHuIdByOpenId($scope, $layer, $, handler, openid);
        }
        var ih = window.innerHeight;
        $(window).resize(function(event) {
            if (window.innerHeight < ih) {
                $('.weui_dialogs').css({
                    'bottom': '55px'
                });
            } else {
                $('.weui_dialogs').css({
                    'top': '0'
                });
            };
        });
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
                        //$layer.open({
                        //    content: "登陆成功",
                        //})
                        $scope.userinfodetal.keHuId = data.data.id; //用于完善个人信息
                        $scope.isinfotrue.keHuId = data.data.id;
                        isinfoall($scope, $layer, loginServices);
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

        //用户信息提交
        $scope.info_submit = function() {
                var flag = $("#userinfo").valid();
                if (flag) {
                    if ($("#usernames").val() == "" || $("#usernames").val() == null ||
                        $("#usertel").val() == "" || $("#usertel").val() == null ||
                        $("#usercode").val() == "" || $("#usercode").val() == null ||
                        $("#userwork").val() == "" || $("#userwork").val() == null ||
                        $("#usercompany").val() == "" || $("#usercompany").val() == null ||
                        $("#cityname").val() == "" || $("#cityname").val() == null ||
                        $("#districtname").val() == "" || $("#districtname").val() == null ||
                        $("#deltaladdress").val() == "" || $("#deltaladdress").val() == null) {
                        $layer.open({
                            content: "请选择城市和区域！",
                            time: 2
                        });
                    } else {
                        loginServices.saveUserMessage($scope.userinfodetal).success(function(data, statue) {
                            if (data.code == 200) {
                                $layer.open({
                                    content: "提交成功！2秒后离开此页面",
                                    style: 'background-color:#09C1FF; color:#fff; border:none;',
                                    time: 2
                                });
                                $scope.user_info = true;
                                window.localStorage.setItem("keHuId", $scope.formData.keHuId);
                                getKeHuCitylist($scope, $layer, loginServices);
                            } else {
                                $layer.open({
                                    content: "验证码过期，请重试",
                                    time: 2
                                })
                            }
                        }).error(function(data, statue) {
                            $scope.isloading = false;
                            $layer.open({
                                content: "网络异常，请稍后再试",
                            })
                        });

                    }

                }
            }
            //验证码发送
        $scope.sendcodes = function() {
            if ($("#usertel").val().length == 11) {
                $scope.user.phone = $("#usertel").val();
                time();
                getmesscode($scope, $layer, loginServices);
            } else {
                $layer.open({
                    content: "请输入正确格式的手机号码",
                    time: 1.2
                })
            }

        }

        //个人信息获取性别
        $("#gender ul li").click(function(event) {
            $(this).addClass('one').siblings('li').removeClass('one');
            if ($(this).text() == "男") {
                $scope.userinfodetal.gender = "男";
            } else {
                $scope.userinfodetal.gender = "女";
            }
            event.stopPropagation();
        });
        //地址自动添加
        $("#cityname").change(function(event) {
            //$scope.cityname.cityName = $("#cityname option:selected").text();
            if ($("#cityname option:selected").text() != "城市选择") {
                $scope.areaData.parentid = $("#cityname option:selected").attr("data");
                //$("#deltaladdress").val($("#cityname option:selected").text());
                $scope.userinfodetal.address = $("#cityname option:selected").text();
                getarealist($scope, loginServices);
            } else {
                //$("#district").find("option[0]").attr("selected",true);
                $("#districtname option:gt(0)").remove();
                $("#deltaladdress").val("");
                $scope.userinfodetal.address = "";
            }
        });
        $("#districtname").change(function(event) {
            if ($("#districtname option:selected").text() != "区域选择") {
                //$("#deltaladdress").val($("#cityname option:selected").text() + $("#districtname option:selected").text());
                $scope.userinfodetal.address = $("#cityname option:selected").text() + $("#districtname option:selected").text();
            } else {
                if ($("#cityname option:selected").text() != "区域选择") {
                    $scope.userinfodetal.address = $("#cityname option:selected").text();
                    //$("#deltaladdress").val($("#cityname option:selected").text());
                } else {
                    $scope.userinfodetal.address = "";
                }
            }
        });
        $("#userinfo").validate({
            focusout: true,
            onsubmit: false,
            rules: {
                usernames: { //用户姓名
                    required: true,
                    stringCheck: true
                },
                usertel: { //电话
                    required: true,
                    isMobile: true
                },
                usercode: { //验证码
                    required: true,
                    isDigits: true
                },
                userwork: { //用户职业
                    required: true
                },
                usercompany: {
                    required: true
                },
                cityname: {
                    required: true
                },
                districtname: {
                    required: true
                },
                deltaladdress: {
                    required: true
                }

            },
            messages: {
                usernames: {
                    required: "请输入用户姓名!",
                    stringCheck: "请输入正确格式的用户名称(不能有特殊字符)!"
                },
                usertel: {
                    required: "请输入电话!",
                    isMobile: "请输入正确格式的电话!"
                },
                usercode: {
                    required: "请输入验证码!",
                    isDigits: "请输入正确的数字验证码!"

                },
                userwork: {
                    required: "请输入您的职业!"
                },
                usercompany: {
                    required: "请输入您所在的公司或机构!"
                },
                cityname: {
                    required: "请输入您所在城市!"
                },
                districtname: {
                    required: "请输入您所在的城市区域!"
                },
                deltaladdress: {
                    required: "请输入联系人地址"
                }

            },
            success: function(label) {
                label.closest('.form_valid').next(".error").remove();
                $("#" + label[0].control.id).parent().parent().parent().removeClass('error_bor');
            },
            errorPlacement: function(error, element) {
                element.closest('.form_valid').next(".error").remove();
                if (error[0].innerHTML != "") {
                    var html = '<div class="error" style="padding:5px 0">' + '<label><span class="error_color">提示：</span>' + error[0].innerHTML + '</label>' + '</div>';
                    element.closest('.form_valid').after(html);
                    element.closest('.form_valid').addClass('bor error_bor');
                    // $("#" + element[0].id).focus();
                }
            }
        });

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
                        var html = '<div class="error" style="padding:5px 0">' + '<label><span class="error_color">提示：</span>' + error[0].innerHTML + '</label>' + '</div>';
                        element.closest('.form_valid').after(html);
                        element.closest('.form_valid').addClass('bor error_bor');
                        // $("#" + element[0].id).focus();
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
        //验证码倒计时
        function time() {
            var wait = 60;
            var t = setInterval(function() {
                wait--;
                $("#sendcode").val(wait + "秒重发验证码");
                $("#sendcode").addClass("codebtnback");
                $("#sendcode").attr("disabled", true);
                if (wait == 0) {
                    clearInterval(t);
                    $("#sendcode").val("重新获取验证码");
                    $("#sendcode").attr("disabled", false);
                    $("#sendcode").removeClass("codebtnback");
                    wait = 60;
                }
            }, 1000)
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
                window.localStorage.setItem("cityName_Zh", data.data[0].value_zd);
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
                //$layer.open({
                //    content: "获取客户信息失败openid",
                //})
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

//获取全部城市列表
function getcitylist($scope, loginServices) {
    loginServices.getallCities($scope.cityData).success(function(data, statue) {
        if (data.code == 200) {
            $scope.citylist = data.data;
        } else {
            $layer.open({
                content: "获取城市列表失败！",
            });
        }
    }).error(function(data, statue) {
        $layer.open({
            content: "网络异常！",
        });
    });
}
//获取全部城市行政区列表
function getarealist($scope, loginServices) {
    loginServices.getcityarea($scope.areaData).success(function(data, statue) {
        if (data.code == 200) {
            $scope.districts = data.data;
        } else {
            $layer.open({
                content: "获取行政区列表失败！",
            });
        }
    }).error(function(data, statue) {
        $layer.open({
            content: "网络异常！",
        });
    });
}

//发送验证码
function getmesscode($scope, $layer, loginServices) {
    loginServices.getverificationcode($scope.user).success(function(data, statue) {
        if (data.code == 200) {
            $layer.open({
                content: "发送成功！填入相应的输入框内",
                style: 'background-color:#09C1FF; color:#fff; border:none;',
                time: 1.5
            });
        } else {
            $layer.open({
                content: "获取验证码失败！",
            });
        }
    }).error(function(data, statue) {
        $layer.open({
            content: "网络异常！",
        });
    });
}

//判断用户是否已完善个人信息
function isinfoall($scope, $layer, loginServices) {
    loginServices.getUser($scope.isinfotrue).success(function(data, statue) {
        if (data.data.flag == true) {
            window.localStorage.setItem("keHuId", $scope.formData.keHuId);
            getKeHuCitylist($scope, $layer, loginServices);
            $scope.user_info = true;
        } else if (data.data.flag == false) {
            //获取城市
            getcitylist($scope, loginServices);
            $scope.user_info = false;
        }
    }).error(function(data, statue) {
        $layer.open({
            content: "网络异常！",
        });
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
