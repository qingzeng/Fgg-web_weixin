/**
 * personalinformation/完善个人信息
 */
define(['app', 'jquery', 'handler', '_layer', 'jValidate', 'jValidateexpand', '../../services/login/loginServices'], function(app, $, handler, $layer, loginServices) {
    app.controller('PersonalinformationCtrl', function($scope,loginServices) {
        handler.setTitle("登录界面");
        $scope.userinfodetal={};
        $scope.citylist = {};
        $scope.districts = {};
        $scope.user = {}; //发送验证请求
        $scope.areaData={};
        $scope.isinfotrue = {};
        $scope.userinfodetal.gender = "男"; //默认选中的性别

        getcitylist($scope, loginServices);

        //用户信息提交
        $scope.info_submit = function() {
        	alert($("#cityname").val()+":"+$("#districtname").val());
                var flag = $("#userinfo").valid();
                if (flag) {
                    if ($("#usernames").val() == "" || $("#usernames").val() == null ||
                        $("#usertel").val() == "" || $("#usertel").val() == null ||
                        $("#usercode").val() == "" || $("#usercode").val() == null ||
                        $("#userwork").val() == "" || $("#userwork").val() == null ||
                        $("#usercompany").val() == "" || $("#usercompany").val() == null ||
                        $("#cityname").val() == "" || $("#cityname").val() == null||
                        $("#districtname").val() == "" || $("#districtname").val() == null||
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
        	var phonenum = $("#usertel").val();
            if ($("#usertel").val().length == 11&&/(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(phonenum) == true) {
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
                districtname:{
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
                districtname:{
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
