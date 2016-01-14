/**
 * delegatedeclaration/委托报单
 */
define(['app', 'jquery', 'handler', '_layer', 'jValidate', 'jValidateexpand', 'autocomplete', '../../../services/delegatedeclaration/delegatedeclarationServices'], function(app, $, handler, $layer, delegatedeclarationServices) {
    app.controller('DelegatedeclarationCtrl', function($scope, delegatedeclarationServices) {
        handler.isKeHuID();
        var keHuID = window.localStorage.getItem("keHuId");
        var cityName = window.localStorage.getItem("cityName");
        handler.setTitle("委托报单");
        var rootUrl = handler.rootUrl;
        $scope.daytimes = [];
        $scope.lookday = "";
        $scope.daytimes = dayarry();
        var isCheck = false;
        var residentialAreaList;

        $scope.formData = {}; //表单提交
        $scope.cityData = {}; //城市获取
        $scope.result = {};
        $scope.comData = {};
        $scope.infoData = {}; //个人信息
        $scope.formData.city = cityName;
        //$scope.infoData.keHuId = "fde87e4b9fd142b6b51e382b7700745a"; //个信息，所在城市所以评估公司
        //$scope.formData.keHuId = "fde87e4b9fd142b6b51e382b7700745a";
        $scope.comData.cityName = cityName;
        $scope.infoData.keHuId = keHuID;
        $scope.formData.keHuId = keHuID;
        $scope.disData = {}; //行政区请求
        $scope.district = {}; //行政区结果
        //$scope.formData.city = "beijing";
        //判断是否有值
        if (getParameterByName("residentialAreaName")) {
            $("#houseinfo").slideDown();
            $("#slidup").text("收起");
            $scope.formData.residentialID = getParameterByName("residentialAreaID");
            $scope.formData.community = getParameterByName("residentialAreaName");
            //$("#community").val(getParameterByName("residentialAreaName"));
            $scope.formData.area = getParameterByName("area");
            $scope.formData.street = getParameterByName("address");
        } else {
            $("#houseinfo").slideUp();
            $("#slidup").text("展开");
        }
        //房产信息收起
        $("#slidup").click(function(event) {
            $("#houseinfo").slideToggle("fast");
            if ($(this).text() == "收起") {
                $("#slidup").text("展开");
            } else {
                $("#slidup").text("收起");
            }
            event.stopPropagation();
        });
        $('body').bind('click', function(event) {
            // IE支持 event.srcElement ， FF支持 event.target    
            var evt = event.srcElement ? event.srcElement : event.target;
            if (evt.id == 'slidlist') return; // 如果是元素本身，则返回
            else {
                $('#slidlist').hide(); // 如不是则隐藏元素
            }
            if (evt.id == 'companylist') return; // 如果是元素本身，则返回
            else {
                $('#companylist').hide(); // 如不是则隐藏元素
            }
        });
        $scope.cityData = {};
        //获取城市
        getcity($scope, delegatedeclarationServices);

        //获取个人信息
        getuserinfo($scope, delegatedeclarationServices);

        //获取个人城市所有评估公司
        getcitycompany($scope, delegatedeclarationServices);
        $scope.submit2 = function(event) {
            var flag = $("#formdata").valid();
            if (flag) {
                if ($("#linkperson").val() == "" || $("#linkpersontel").val() == "" || $('#billperson').val() == "" || $('#billpersontel').val() == "" || $('#assesscompany').val() == "") {
                    return;
                } else {
                    if ($("#loanamount").val() != "" && $("#loanratio").text() == "请选择") {
                        $("#slidlisterrorinfo").show();
                    } else {
                        $("#slidlisterrorinfo").hide();
                        if ($("#loanamount").val() != null || $("#loanamount").val() != "") {
                            $scope.formData.expectPrice = parseFloat($("#loanamount").val()) * parseFloat($("#loanrationum").val()); //期贷金额
                        }
                        if ($("#lookday").val() != null || $("#lookday").val() != "") {
                            $scope.formData.appointmentTime = $("#lookday").val() + $("#looktime").val(); //看房时间
                        }
                        $("#loadingToast").show();
                        delegatedeclarationServices.entrustsubmit($scope.formData).success(function(data, statue) {
                            if (data.code == 200) {
                                $scope.result = data.data;
                                $("#loadingToast").hide();
                                var obj = JSON.parse(data.data);
                                window.location.href = "#/delegateresult?reportNum=" + obj.reportNum + "&submittime=" + obj.createdDate;
                            } else {
                                $("#loadingToast").hide();
                                $layer.open({
                                    content: '服务器繁忙，请稍后再试！',
                                    style: 'background-color:#09C1FF; color:#fff; border:none;',
                                    time: 2
                                });
                            }
                        }).error(function(data, statue) {
                            $layer.open({
                                content: '服务器繁忙，请稍后再试！',
                                style: 'background-color:#09C1FF; color:#fff; border:none;',
                                time: 2
                            });
                        });
                    }
                }
            }
        }
        $("#formdata").validate({
            focusout: true,
            onsubmit: false,
            rules: {
                linkperson: { //看房联系人
                    stringCheck: true,
                    required: true,
                    maxlength: 20
                },
                linkpersontel: { //看房联系人电话
                    required: true,
                    isMobile: true
                },
                billperson: { //报单联系人
                    stringCheck: true,
                    required: true,
                    maxlength: 20
                },
                billpersontel: { //报单联系人电话
                    required: true,
                    isMobile: true
                },
                assesscompany: { //评估公司
                    required: true
                },
                loanamount: { //期贷金额
                    posintdec: true,
                    max: 9999,
                    min: 1
                },
                addressee: { //收件联系人
                    stringCheck: true,
                    maxlength: 20
                },
                addresseetel: { //收件联系人电话
                    isMobile: true
                },

                deltaladdress: { //收件联系人地址
                    maxlength: 60
                },
                community: {
                    maxlength: 60
                },
                area: { //面积
                    posintdec: true,
                    max: 9998.99,
                    min: 1
                },
                hourseaddress: { //房本证载地址
                    maxlength: 60
                },
                note: {
                    stringCheck: true
                }
            },
            messages: {
                linkperson: {
                    required: "请输入看房联系人!",
                    stringCheck: "联系人不能输入特殊字符!",
                    maxlength: "请输入最多20个字符!"
                },
                linkpersontel: {
                    required: "请输入看房联系人电话!",
                    isMobile: "请输入正确的11位手机号码!"
                },
                billperson: {
                    required: "请输入报单联系人!",
                    stringCheck: "不能输入特殊字符!",
                    maxlength: "请输入最多20个字符!"
                },
                billpersontel: { //报单联系人电话
                    required: "请输入报单联系人电话!",
                    isMobile: "请输入正确的11位手机号码!"
                },
                assesscompany: { //评估公司
                    required: "请输入评估公司!"
                },
                loanamount: { //报单联系人
                    posintdec: "请输入金额为1~9999，只留两位小数",
                    max: "请输入金额为1~9999，只留两位小数",
                    min:"请输入金额为1~9999，只留两位小数"
                },
                addressee: { //收件联系人
                    stringCheck: "联系人不能输入特殊字符!",
                    maxlength: "请输入最多20个字符!"
                },
                addresseetel: { //收件联系人
                    isMobile: "请输入正确的11位手机号码!"
                },
                deltaladdress: {
                    maxlength: "请输入最多60个字符"
                },
                community: {
                    maxlength: "请输入最多60个字符"
                },
                area: { //面积
                    posintdec: "请输入面积范围为1~9998.99，只留两位小数",
                    max: "请输入面积为1~9998.99，只留两位小数",
                    min: "请输入面积为1~9998.99，只留两位小数"
                },
                hourseaddress: { //房本证载地址
                    maxlength: "请输入最多60个字符!"
                },
                note: {
                    stringCheck: "不能输入特殊字符!"
                }
            },
            success: function(label) {
                label.closest('.form_valid').next(".error").remove();
                $("#" + label[0].control.id).parent().parent().parent().removeClass('error_bor');
            },
            errorPlacement: function(error, element) {
                element.closest('.form_valid').next(".error").remove();
                if (error[0].innerHTML != "") {
                    var html = '<div class="weui_cell text-bg-gray error">' + '<label><span class="error_color">错误提示：</span>' + error[0].innerHTML + '</label>' + '</div>';
                    element.closest('.form_valid').after(html);
                    element.closest('.form_valid').addClass('bor error_bor');
                    $("#" + element[0].id).focus();
                }
            }
        });
        //公司下拉选择
        $("#assesscompany").click(function(event) {
            $("#companylist").show();
            event.stopPropagation();
            $("html,body").css("overflow", "hidden");
        });
        $scope.compnylist = function(val) {
                $scope.formData.estimateCompany = val;
                $("#companylist").hide();
                $("html,body").css("overflow", "auto");
            }
            //贷款成数下拉选择
        $("#loanratio").click(function(event) {
            $("#slidlist").show();
            event.stopPropagation();
            $("html,body").css("overflow", "hidden");
        });

        $("#slidlist li").click(function(event) {
            $("#loanratio").val($(this).text());
            $("#loanrationum").val($(this).attr("data"));
            $("#slidlist").hide();
            $("html,body").css("overflow", "auto");
            event.stopPropagation();
        });
        //地址自动添加
        $("#cityname").change(function(event) {
            //$scope.cityname.cityName = $("#cityname option:selected").text();
            if ($("#cityname option:selected").text() != "请选择") {
                $scope.disData.parentid = $("#cityname option:selected").val();
                $("#deltaladdress").val($("#cityname option:selected").text());
                getdistrict($scope, delegatedeclarationServices);
            } else {
                //$("#district").find("option[0]").attr("selected",true);
                $("#district option:gt(0)").remove();
                $("#deltaladdress").val("");
            }
        });
        $("#district").change(function(event) {
            if ($("#district option:selected").text() != "请选择") {
                $("#deltaladdress").val($("#cityname option:selected").text() + $("#district option:selected").text());
            } else {
                if ($("#cityname option:selected").text() != "请选择") {
                    $("#deltaladdress").val($("#cityname option:selected").text());
                } else {
                    $("#deltaladdress").val();
                }
            }
        });
        //小区模糊匹配
        $("#community").autocomplete(rootUrl + "/webservice/getResidentialAreaByName?", {
            width: $("#community").width(),
            scroll: true,
            matchCase: false,
            scrollHeight: 200,
            autoFill: false, //是否自动把第一行数据填入输入框
            delay: 400, //设置延迟加载,因为是远程端调用数据
            dataType: "json", //数据类型
            extraParams: { //url传入的参数
                cityName: function() {
                    return cityName;
                },
                residentialAreaName: function() {
                    return $("#community").val();
                },
                count: function() {
                    return 6;
                }
            },
            parse: function(data) {
                data = data.data;
                residentialAreaList = data;
                if (data == null && data == "") {
                    return;
                }
                return $.map(data, function(row) {
                    if (row == null) {
                        return;
                    }
                    return {
                        data: row,
                        value: row.SearchFlag == "小区地址" ? row.MatchName : row.matchName, //此处无需把全部列列出来，只是两个关键列
                        result: row.SearchFlag == "小区地址" ? row.MatchName : row.matchName
                    }
                })
            },
            formatItem: function(row, i, max) {
                if (row.SearchFlag == "小区地址") {
                    return row.MatchName;
                }
                return "<span style='float:right;color: #919191;font-family:Microsoft YaHei ! important;'>&nbsp;&nbsp;" + row.districtFullName + "</span>" + row.matchName;
            },
            formatResult: function(row, i, max) {

                if (row.SearchFlag == "小区地址") {
                    return row.MatchName;
                }
                return row.MatchName;
            },
            formatMatch: function(row, i, max) {
                if (row.SearchFlag == "小区地址") {
                    return row.MatchName;
                }
                return row.MatchName;
            }
        }).result(function(event, data, formatted) {
            isCheck = true;
            //选择下拉框
            $("#residentialAreaID").val(data.residentialAreaid);
            //$("#community").val(data.matchName);
            $scope.formData.community = data.matchName;
            $scope.formData.residentialAreaID = data.residentialAreaid;
        });
    });
});

//获取城市列表
function getcity($scope, delegatedeclarationServices) {
    delegatedeclarationServices.getCities($scope.cityData).success(function(data, statue) {
        if (data.code == 200) {
            $scope.citylist = data.data;
        }
    }).error(function(data, statue) {

    });
}

//获取用户个人信息
function getuserinfo($scope, delegatedeclarationServices) {
    delegatedeclarationServices.userInfo($scope.infoData).success(function(data, statue) {
        if (data.code == 200) {
            if (data.data != null && data.data != "") {
                if (data.data.kehudanwei != null || data.data.kehudanwei != "") {
                    $scope.formData.estimateCompany = data.data.kehudanwei; //客户所在评估公司
                } else {
                    $scope.formData.estimateCompany = "";

                }
                if (data.data.kehudengluzhanghao != null || data.data.kehudengluzhanghao != "") {
                    $scope.formData.client = data.data.kehudengluzhanghao; //客户登录账号
                    $scope.formData.receiver = data.data.kehudengluzhanghao;
                } else {
                    $scope.formData.estimateCompany = "";
                }
                if (data.data.kehushouji != null || data.data.kehushouji != "") {
                    //$("#billpersontel").val(data.data.kehushouji); //客户手机
                    $scope.formData.clientPhone = data.data.kehushouji; //客户手机
                    $scope.formData.receiverPhone = data.data.kehushouji; //收件人联系电话
                    $scope.formData.receiveAddress = data.data.kehuxiangxidizhi; //收件人详细地址
                    //$("#cityname")= data.data.kehuchengshi;
                    //$("#district")= data.data.kehuxingzhengqu;
                } else {
                    $scope.formData.estimateCompany = "";

                }
            }
        }
    }).error(function(data, statue) {

    });
}

//获取用户所在城市的所有评估公司
function getcitycompany($scope, delegatedeclarationServices) {
    delegatedeclarationServices.getcompany($scope.comData).success(function(data, statue) {
        if (data.code == 200) {
            if (data.data.length > 0) {
                $scope.companys = data.data;
            } else {
                $("#companylist").hide();
            }
        }
    }).error(function(data, statue) {

    });
}

//获取行政区列表 getdistrict
function getdistrict($scope, delegatedeclarationServices) {
    delegatedeclarationServices.getcityarea($scope.disData).success(function(data, statue) {
        if (data.code == 200) {
            $scope.district = data.data;
        }
    }).error(function(data, statue) {

    });
}

//未来七天的时间获取
Date.prototype.DateAdd = function(strInterval, Number) {
        var dtTmp = this;
        switch (strInterval) {
            case 's':
                return new Date(Date.parse(dtTmp) + (1000 * Number));
            case 'n':
                return new Date(Date.parse(dtTmp) + (60000 * Number));
            case 'h':
                return new Date(Date.parse(dtTmp) + (3600000 * Number));
            case 'd':
                return new Date(Date.parse(dtTmp) + (86400000 * Number));
            case 'w':
                return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
            case 'q':
                return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'm':
                return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'y':
                return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        }
    }
    //获取未来七天时间日期
function GetDateStr2(AddDayCount) {
    var dd = new Date();
    ddd = dd.DateAdd('d', AddDayCount);
    var y = ddd.getFullYear();
    var m = ddd.getMonth() + 1; //获取当前月 
    var d = ddd.getDate();
    return y + "-" + m + "-" + d; //时间格式
}

function dayarry() {
    var arry = [];
    for (i = 0; i <= 6; i++) {
        arry[i] = {};
        arry[i].name = GetDateStr2(i + 1);
    }
    return arry;
}
//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
