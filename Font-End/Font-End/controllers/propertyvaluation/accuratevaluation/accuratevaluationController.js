/**
 * accuratevaluation/精准估价
 */
define(['app', 'jquery', 'handler', '_layer', 'jValidate', 'jValidateexpand', 'autocomplete', '../../../services/propertyvaluation/accuratevaluation/accuratevaluationService'],
    function (app, $, handler, $layer, AccuratevaluationService) {

        app.controller('AccuratevaluationCtrl', function ($scope, AccuratevaluationService) {
            //handler.isKeHuID();
            handler.setTitle("精准估价");
            //总楼层
            $scope.form = {};
            $scope.form.cityName = window.localStorage.getItem("cityName");
            //是否显示居室匹配
            $scope.isgetroom = false;
            //获取居室所需参数
            $scope.getroomtype = {};
            //获取居室匹配结果
            $scope.getroomResult = [];
            $scope.roomtype_toward = "";
            //居室
            $scope.roomType = "";
            //朝向
            $scope.toward = "";

            $scope.houseTypes = [{
                typeName: "一居室",
                value: 1
            }, {
                typeName: "二居室",
                value: 2
            }, {
                typeName: "三居室",
                value: 3
            }, {
                typeName: "四居室",
                value: 4
            }, {
                typeName: "五居室",
                value: 5
            }, {
                typeName: "五居室以上",
                value: 9
            }];
            $scope.form.houseTypeSelect = "";
            $scope.form.towardNameSelect = "";
            $scope.form.specialFactors = ""; //特殊因素
            $scope.specialFactorsLs = [];
            //朝向
            $scope.towards = [{
                towardName: "东",
                value: 1
            }, {
                towardName: "南",
                value: 2
            }, {
                towardName: "西",
                value: 3
            }, {
                towardName: "北",
                value: 4
            }, {
                towardName: "东南",
                value: 5
            }, {
                towardName: "东北",
                value: 6
            }, {
                towardName: "南北",
                value: 7
            }, {
                towardName: "西南",
                value: 8
            }, {
                towardName: "西北",
                value: 9
            }, {
                towardName: "东西",
                value: 10
            }, {
                towardName: "不确定",
                value: 99999
            }];

            $("#areas").blur(function () {
                debugger;
                if ($.trim($("#appraisalobject").val()) != "") {
                    if ($.trim($("#areas").val()) != "") {
                        $scope.getroomtype.cityName = $scope.form.cityName;
                        $scope.getroomtype.residentialName = $scope.form.residentialAreaName;
                        $scope.getroomtype.area = $.trim($("#areas").val());
                        getRoomTypes($scope, AccuratevaluationService);
                    }
                }

            });
            //居室类型
            $("#roomtype").click(function (event) {
                $("#roomtypelist").show();
                event.stopPropagation();
                $("html,body").css("overflow", "hidden");
            });
            $scope.roomtypelist = function (value) {
                $scope.form.roomtype = value;
                $scope.roomType = value;
                $scope.roomtype_toward = $scope.roomType;
                $("#roomtypelist").hide();
                $("#towardlist").show();
                $("html,body").css("overflow", "auto");
            }
            //朝向
            $("#toward").click(function (event) {
                $("#roomtypelist").hide();
                $("#towardlist").show();
                event.stopPropagation();
                $("html,body").css("overflow", "hidden");
            });
            $scope.towardlist = function (value) {
                $("#roomtypelist").hide();
                $scope.form.toward = value;
                $scope.toward = value;
                $scope.roomtype_toward = $scope.roomType + " " + $scope.toward;
                $("#towardlist").hide();
                $("html,body").css("overflow", "auto");
                //$("#special").show();
                //$scope.form.specialFactors = $scope.specialFactorsLs[0].value;//选中第一个
                if ($scope.specialFactorsLs && $scope.specialFactorsLs.length > 0&&$scope.specialFactorsLs[0].value!="") {
                    $("#special").show();
                    $("#speciallist").show();
                }else{
                    $("#special").hide();
                    $("#speciallist").hide();
                }
            }
            //特殊因素
            /*$("#specialreson").click(function(event) {
             $("#speciallist").show();
             event.stopPropagation();
             $("html,body").css("overflow", "hidden");
             });*/
            $scope.clicklist = function () {
                $("#speciallist").show();
                $("html,body").css("overflow", "hidden");
            }
            $scope.hasnone = function (value) {
                $scope.form.specialFactors = "";
                $("#speciallist").hide();
            }
            $scope.speciallist = function (value) {
                $("#speciallist").hide();
                $scope.form.specialFactors = value;
                $("html,body").css("overflow", "auto");
            }
            /*$('body').bind('click', function (event) {
             // IE支持 event.srcElement ， FF支持 event.target
             var evt = event.srcElement ? event.srcElement : event.target;

             if (evt.id == 'roomtypelist' || evt.id == 'roomtype') {

             } // 如果是元素本身，则返回 居室类型
             else {
             $('#roomtypelist').hide(); //
             }
             if (evt.id == 'towardlist' || evt.id == 'toward') {// 朝向

             } else {
             $("#towardlist").hide();
             }
             if (evt.id == 'buildnumber' || evt.id == 'buildingnum') {
             } // 如果是元素本身，则返回
             else {
             $scope.isShowBuildLs = false;
             //$('#buildnumber').hide(); // 如不是则隐藏元素
             }
             if (evt.id == 'unitnumber' || evt.id == 'unit') {
             } // 如果是元素本身，则返回
             else {
             $scope.isShowUnitLs = false;
             //$('#unitnumber').hide(); // 如不是则隐藏元素
             }
             if (evt.id == 'roomnumber' || evt.id == 'roomnumberList') {//点击门牌号| 门牌号列表

             } else {
             $scope.isShowHouseLs = false;
             }
             });*/
            /***
             * 根据朝向名， 获取朝向
             * @param TowardName
             * @returns {*}
             */
            var getItemByTowardName = function (TowardName) {
                for (var i = 0; i > $scope.towards.length; i++) {
                    if (TowardName == $scope.towards.typeName) {
                        return $scope.towards[i];
                    }
                }
                return $scope.towards[0];
            }
            /***
             * 根据居室名， 获取居室类型
             * @param houseTypes
             * @returns {*}
             */
            var getItemByhHouseTypes = function (houseTypes) {
                for (var i = 0; i > $scope.houseTypes.length; i++) {
                    if (houseTypes == $scope.houseTypes.towardName) {
                        return $scope.houseTypes[i];
                    }
                }
                return $scope.houseTypes[0];
            }

            $scope.form.residentialAreaID = ifNull(getParameterByName("residentialAreaID")); // 小区ID
            $scope.form.residentialAreaName = ifNull(getParameterByName("residentialAreaName")); // 小区名称
            $scope.form.area = ifNull(getParameterByName("area")); // 建筑面积
            $scope.form.roomtype = ifNull(getParameterByName("roomtype"));// 居室类型
            var toward = getItemByTowardName(ifNull(getParameterByName("toward"))); // 朝向
            $scope.form.toward = ifNull(getParameterByName("toward"));
            $scope.form.houseNumber = ifNull(getParameterByName("unit")); //单元
            $scope.form.floorBuilding = ifNull(getParameterByName("buildingnum")); //楼栋
            $scope.form.floor = ifNull(getParameterByName("currentfloor")); // 当前楼层
            $scope.form.totalfloor = ifNull(getParameterByName("totalfloor")); //总楼层
            $scope.form.buildingyear = ifNull(getParameterByName("buildyear")); // 建成年代
            if (ifNull(getParameterByName("unit"))) {
                $("#special").show();
                $scope.form.specialFactors = ifNull(getParameterByName("unit")); // 特殊因素
            } else {
                $("#special").hide();
            }

            var isCheck = false;
            var residentialAreaList = [];
            $scope.buildingList = [];
            $scope.unitList = [];
            //门牌号列表
            $scope.houseNameLs = [];
            $scope.isShowBuildLs = false;
            $scope.isShowUnitLs = false;
            $scope.isShowHouseLs = false;
            /*$scope.hasSpecialFactors=false;*/
            $scope.selectBuild = function () {
                if (!$scope.form.residentialAreaID || $scope.form.residentialAreaID == null) {
                    return;
                }
                AccuratevaluationService.getBuilding({
                    residentialID: $scope.form.residentialAreaID
                }).success(function (data, statue) {
                    if (data.code == 200) {
                        for (var i = 0; i < data.data.length; i++) {
                            // 如果返回默认楼栋，则过滤楼栋，根据默认楼栋ID 请求单元
                            if ('默认楼幢' == data.data[i].buildingName) {
                                $scope.buildClick({
                                    buildingName: '',
                                    buildingid: data.data[i].buildingid
                                });
                                $scope.buildingList = [];//数组为空
                                return;
                            }
                        }
                        $scope.buildingList = data.data;
                        $scope.isShowBuildLs = true;
                    } else {
                        $scope.isShowBuildLs = false;
                    }
                }).error(function (data, statue) {
                    $scope.isShowBuildLs = false;
                });
                // $scope.isShowBuildLs = !$scope.isShowBuildLs;
            };
            //显示单元列表
            $scope.selectUnit = function () {
                if (!$scope.isShowUnitLs && $scope.unitList && $scope.unitList != null && $scope.unitList.length > 0) {
                    $scope.isShowUnitLs = true;
                    return;
                } else {
                    $scope.isShowUnitLs = false;
                    return;
                }
                // 楼栋ID 存在， 请求单元列表
                if ($scope.form.floorBuildingID && $scope.form.floorBuildingID != null) {
                    AccuratevaluationService.getUnits({
                        buildingId: $scope.form.floorBuildingID
                    }).success(function (data, statue) {
                        if (data.code == 200) {
                            $scope.unitList = data.data;
                            $scope.isShowUnitLs = true;
                        } else {
                            $scope.isShowUnitLs = false;
                        }
                    }).error(function (data, statue) {
                        $scope.isShowUnitLs = false;
                    });
                }
            }
            /***
             * 点击门牌号ITEM
             */
            $scope.houseClick = function (houseName) {
                $scope.isShowHouseLs = false;
                if (!houseName || houseName == null) {
                    return;
                }
                $scope.form.area = houseName.buildingArea;
                $scope.form.houseNumber = houseName.houseName;
                $scope.form.floor = houseName.floor;
                $scope.form.totalfloor = houseName.floorCount;
                $scope.form.roomtype = houseName.rooms;
                $scope.form.toward = houseName.toward;
            };
            /***
             *  楼栋项点击事件
             * @param builder
             */
            $scope.buildClick = function (builder) {
                $scope.form.floorBuilding = builder.buildingName;
                $scope.form.floorBuildingID = builder.buildingid;
                //buildingTime: "2002-01-01"
                if(builder.buildingTime&&builder.buildingTime!=null&&builder.buildingTime!=""){
                    $scope.form.buildingyear=builder.buildingTime.substr(0,4);
                }

                $scope.isShowBuildLs = false;
                AccuratevaluationService.getUnits({
                    buildingId: $scope.form.floorBuildingID
                }).success(function (data, statue) {
                    if (data.code == 200) {
                        $scope.unitList = data.data;
                        $scope.isShowUnitLs = true;
                    } else {
                        $scope.isShowUnitLs = false;
                    }
                }).error(function (data, statue) {
                    $scope.isShowUnitLs = false;
                });
            };

            /***
             * 单元号ITEM 点击事件
             *
             * @param unit
             */
            $scope.unitClick = function (unit) {
                $scope.form.cellNumber = unit.unitName;
                $scope.form.unitId = unit.unitId;
                $scope.isShowUnitLs = false;
            };
            /***
             * 根据 单元ID
             * 获取门牌号，
             */
            $scope.selectHouseNum = function () {
                if (!$scope.form.unitId || $scope.form.unitId == null) {
                    // 还没有获取到单元ID
                    return;
                }
                //请求 门牌号
                AccuratevaluationService.getHouse({
                    unitId: $scope.form.unitId
                }).success(function (data, statue) {
                    if (data.code == 200) {
                        $scope.isShowHouseLs = true;
                        $scope.houseNameLs = data.data;
                    } else {
                        $scope.isShowHouseLs = false;
                    }
                }).error(function (data, statue) {
                    $scope.isShowHouseLs = false;
                });
            }
            var myDate = new Date();
            var year = myDate.getFullYear();
            $("#Assess").validate({
                focusout: true,
                onsubmit: false,
                rules: {
                    appraisalobject: { //评估对象
                        required: true
                    },
                    houseType: {
                        required: true
                    },
                    toward: {
                        required: true
                    },
                    areas: { //房屋面积
                        required: true,
                        posintdec: true,
                        max: 9998.99,
                        min: 1
                    },
                    roomtype: { //房屋类型
                        required: true,
                        maxlength: 20
                    },
                    buildingyear: { //建成年代
                        min: 1900, //1900~2016
                        max: parseInt(year)
                    },
                    currentfloor: {
                        posint: true, // 正整数
                        max: 999
                    },
                    totalfloor: {
                        posint: true, // 正整数
                        max: 999,
                        larger: true
                    }
                },
                messages: {
                    appraisalobject: {
                        required: "请输入评估对象!"
                    },
                    areas: { //房屋面积
                        required: "请输入具体的建筑面积!",
                        posintdec: "请输入面积为1~9998.99，只留两位小数",
                        max: "请输入面积范围为1~9998.99",
                        min: '请输入面积范围为1~9998.99'
                    },
                    houseType: {
                        required: "请选择居室类型"
                    },
                    toward: {
                        required: "请选择朝向"
                    },
                    roomtype: { //评估公司
                        required: "请选择居室类型!"
                    },
                    buildingyear: {
                        min: "请输入正确的建成年代 ! 1900~" + year,
                        max: "请输入正确的建成年代 ! 1900~" + parseInt(year)
                    },
                    currentfloor: {
                        posint: "楼层需要为整数",
                        max: "楼层不超过999"

                    },
                    totalfloor: {
                        posint: "楼层需要为整数",
                        max: "楼层不超过999",
                        larger: "总楼层不能低于所在楼层!"
                    }
                },
                success: function (label) {
                    label.closest('.form_valid').next(".error").remove();
                    $("#" + label[0].control.id).parent().parent().parent().removeClass('error_bor');
                },
                errorPlacement: function (error, element) {
                    element.closest('.form_valid').next(".error").remove();
                    if (error[0].innerHTML != "") {
                        var html = '<div class="weui_cell text-bg-gray error">' + '<label><span class="error_color">错误提示：</span>' + error[0].innerHTML + '</label>' + '</div>';
                        element.closest('.form_valid').after(html);
                        element.closest('.form_valid').addClass('bor error_bor');
                        $("#" + element[0].id).focus();
                    }
                }
            });
            //总楼层大于或等于所在楼层
            $.validator.addMethod("larger", function (value, element) {
                var sumreward = $("#currentfloor").val();
                var flag = false;
                if (sumreward == null || sumreward == "" || value == null || value == "") {
                    flag = true;
                } else {
                    if (parseInt(value) >= parseInt(sumreward)) {
                        flag = true;
                    } else {
                        flag = false
                    }
                }
                return flag;
            }, $.validator.format("总楼层不能低于所在楼层!"));
            var url = handler.rootUrl + "/webservice/getResidentialAreaByName";
            //rootUrl + "/webservice/res/getResidentialArea?"
            //评估对象模糊匹配
            $("#appraisalobject").focus(function () {

                $(this).autocomplete(url, {
                    width: $("#appraisalobject").width(),
                    scroll: true,
                    matchCase: false,
                    scrollHeight: 200,
                    autoFill: false, //是否自动把第一行数据填入输入框
                    delay: 400, //设置延迟加载,因为是远程端调用数据
                    dataType: "json", //数据类型
                    extraParams: { //url传入的参数
                        cityName: $scope.form.cityName,
                        residentialAreaName: function () {
                            return $("#appraisalobject").val();//encodeURIComponent(
                        },
                        count: function () {
                            return 6;
                        }
                    },
                    parse: function (data) {
                        data = data.data;
                        residentialAreaList = data;
                        if (data == null && data == "") {
                            return;
                        }
                        return $.map(data, function (row) {
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
                    formatItem: function (row, i, max) {
                        if (row.SearchFlag == "小区地址") {
                            return row.MatchName;
                        }
                        return "<span style='float:right;color: #919191;font-family:Microsoft YaHei ! important;'>&nbsp;&nbsp;" + row.districtFullName + "</span>" + row.matchName;
                    },
                    formatResult: function (row, i, max) {

                        if (row.SearchFlag == "小区地址") {
                            return row.MatchName;
                        }
                        return row.MatchName;
                    },
                    formatMatch: function (row, i, max) {
                        if (row.SearchFlag == "小区地址") {
                            return row.MatchName;
                        }
                        return row.MatchName;
                    }
                }).result(function (event, data, formatted) { // 点击后的回调
                    //选择下拉框
                    $scope.form.residentialAreaID = data.residentialAreaid; // 小区ID
                    $scope.form.residentialAreaName = data.matchName; // 小区名称
                    $("#appraisalobject").val($scope.form.residentialAreaName);
                    isCheck = true;
                });

            });
            $("#appraisalobject").blur(function () {
                //选择下拉框
                if (isCheck) {
                    isCheck = false;
                    return;
                }
                if (residentialAreaList && residentialAreaList.length > 0) {
                    $scope.form.residentialAreaID = residentialAreaList[0].residentialAreaid;
                    $scope.form.residentialAreaName = residentialAreaList[0].matchName; // 小区名称
                }
                $("#appraisalobject").val($scope.form.residentialAreaName);
                //根据小区名获取特殊因素
                if ($scope.form.residentialAreaName && $scope.form.residentialAreaName != null) {
                    AccuratevaluationService.getSpecialFactors({
                        residentialAreaName: $scope.form.residentialAreaName
                    }).success(function (data, statue) {
                        if (data.code == 200) {
                            $scope.specialFactorsLs = data.data;
                            if ($scope.specialFactorsLs && $scope.specialFactorsLs.length > 0) {
                                if ($scope.specialFactorsLs[0].value && $scope.specialFactorsLs[0].value != null &&
                                    $scope.specialFactorsLs[0].value != "") {
                                } else {
                                    debugger;
                                    $("#special").hide();
                                    $("#specialreson").unbind("click");
                                }

                            } else {
                                $("#special").hide();
                                $("#specialreson").unbind("click");
                            }
                        } else {

                        }
                    }).error(function (data, statue) {
                        debugger;
                        // $layer.open({
                        //     content: "估值失败！",
                        //     btn: ['OK']
                        // });
                    });
                }

            });

            /***
             * 提交表单，进行精准估值
             */
            $scope.onSubmit = function () {
                if ($("#Assess").valid()) {
                    $("#loadingToast").show();
                    AccuratevaluationService.getPrecisePrice($scope.form).success(function (data, statue) {
                        if (data.code == 200) {
                            $("#loadingToast").hide();
                            if (data.data && data.data != null) {
                                data.data.residentialAreaName = $scope.form.residentialAreaName
                                var str = JSON.stringify(data.data);
                                window.location.href = "#/accuratevaluation-results?resultStr=" + str;
                            } else {
                                $layer.open({
                                    content: "估值失败！",
                                    btn: ['OK']
                                });
                            }
                        } else {
                            $layer.open({
                                content: "估值失败！",
                                btn: ['OK']
                            });
                            $("#loadingToast").hide();
                        }
                    }).error(function (data, statue) {
                        $("#loadingToast").show();
                        $layer.open({
                            content: "估值失败！",
                            btn: ['OK']
                        });
                    });
                }

            };
        });
    });

/***
 * 空值过滤
 * @param obj
 * @returns {*}
 */
function ifNull(obj) {
    if (!obj || obj == null || obj == 'null') {
        return "";
    }
    return obj;
}
//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


//根据城市名、小区名、面积获取居室类型
function getRoomTypes($scope, AccuratevaluationService) {
    AccuratevaluationService.getRoomType($scope.getroomtype).success(function (data, statue) {
        if (data.code == 200) {
            if (data.data && data.data != null) {
                $scope.isgetroom = true;
                $scope.getroomResult = data.data.result;
            } else {
                $scope.isgetroom = false;
            }
        } else {
            $scope.isgetroom = false;
        }
    }).error(function (data, statue) {
        $scope.isgetroom = false;
    });
}
