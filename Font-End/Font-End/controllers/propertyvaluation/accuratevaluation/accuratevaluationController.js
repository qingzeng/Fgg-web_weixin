/**
 * accuratevaluation/精准估价
 */
define(['app', 'jquery', 'handler', '_layer', 'jValidate', 'jValidateexpand', 'autocomplete', '../../../services/propertyvaluation/accuratevaluation/accuratevaluationService'],
    function(app, $, handler, $layer, AccuratevaluationService) {

        app.controller('AccuratevaluationCtrl', function($scope, AccuratevaluationService) {
            handler.isKeHuID();
            handler.setTitle("精准估价");
            var url = handler.rootUrl + "/webservice/getResidentialAreaByName";
            //总楼层
            $scope.form = {};
            $scope.form.cityName = window.localStorage.getItem("cityName");
            $scope.form.residentialAreaID = "";
            //是否显示居室匹配
            $scope.isgetroom = false;
            //获取居室所需参数
            $scope.getroomtype = {};
            //获取居室匹配结果
            $scope.getroomResult = [];

            $scope.flag = true;
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
            }, {
                typeName: "多居多室",
                value: 9
            }, {
                typeName: "其他",
                value: ""
            }];
            $scope.form.houseTypeSelect = "";
            $scope.form.towardNameSelect = "";
            $scope.form.specialFactors = ""; //特殊因素
            $scope.specialFactorsLs = [];
            //朝向
            $scope.towards = [{
                towardName: "不确定",
                value: 99999
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
            }];

            /***
             * 根据朝向名， 获取朝向
             * @param TowardName
             * @returns {*}
             */
            var getItemByTowardName = function(TowardName) {
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
            var getItemByhHouseTypes = function(houseTypes) {
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
            $scope.form.roomtype = ifNull(getParameterByName("roomtype")); // 居室类型
            var toward = getItemByTowardName(ifNull(getParameterByName("toward"))); // 朝向
            if (getParameterByName("toward") != "" && getParameterByName("toward") != null) {
                $("#toward").val(ifNull(getParameterByName("toward") + "朝向"));
                $scope.form.toward = "";
            } else {
                $scope.form.toward = getParameterByName("toward");
            }
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
            $("#specialreson").val(ifNull(getParameterByName("special")));
            getSpecial($scope, AccuratevaluationService, $);
            var isCheck = false;
            var residentialAreaList = [];
            $scope.buildingList = [];
            $scope.unitList = [];
            //门牌号列表
            $scope.houseNameLs = [];
            $scope.isShowBuildLs = false; //是否显示楼栋选择
            $scope.isShowUnitLs = false; //是否显示单元选择
            $scope.isShowHouseLs = false; //是否显示门牌选择
            $scope.just_unit = false;
            $scope.just_building = true;

            $(function() {

                if (getParameterByName("flag") == "true") {
                    var str = window.localStorage.getItem("fggjrrecordsdetial");
                    var _obj={};
                    _obj = $.parseJSON(str);

                    $scope.form.residentialAreaID = ifNull(_obj.residentialAreaID); 
                    $scope.form.residentialAreaName = ifNull(_obj.residentialAreaName);
                    $scope.form.area =ifNull(_obj.area);
                    $scope.form.roomtype=ifNull(_obj.roomtype);
                    $scope.form.totalfloor=ifNull(_obj.totalfloor);
                    $scope.form.floorBuilding = ifNull(_obj.buildingnum);
                    $scope.form.floor = ifNull(_obj.currentfloor);
                    $scope.form.houseNumber = ifNull(_obj.unit);
                    $scope.form.buildingyear = ifNull(_obj.buildyear);
                    //跳转回来获取居室和朝向
                    if (_obj.toward != "" && _obj.roomtype != "" &&_obj.toward != null &&_obj.roomtype != null ) {
                        $("#roomtypetoward").css("width", "0px").attr("flag","false");
                        $("#groups").show();
                        $("#toward").val(_obj.toward + "朝向");     
                    } else {
                        $("#roomtypetoward").css("width", "100%");
                    }

                    if (ifNull($scope.form.unit)) {
                        $("#special").show();
                        $scope.form.specialFactors = ifNull(_obj.unit); // 特殊因素
                    } else {
                        $("#special").hide();
                    }
                    $("#specialreson").val(ifNull(_obj.special));
                }

                $('body').bind('click', function(event) {
                    // IE支持 event.srcElement ， FF支持 event.target
                    var evt = event.srcElement ? event.srcElement : event.target;

                    if (evt.id == 'roomtypelist' || evt.id == 'roomtype' || evt.id == 'roomtypetoward') {
                        //$('#roomtypelist').show(); 
                    } else {
                        //$('#roomtypelist').hide(); 
                    }

                    if (evt.id == 'buildnumber' || evt.id == 'buildingnum') {} // 如果是元素本身，则返回
                    else {
                        $scope.isShowBuildLs = false;
                        $('#buildnumber').hide(); // 如不是则隐藏元素
                    }
                    if (evt.id == 'unitnumber' || evt.id == 'unit') {} // 如果是元素本身，则返回
                    else {
                        $scope.isShowUnitLs = false;
                        $('#unitnumber').hide(); // 如不是则隐藏元素
                    }
                    if (evt.id == 'roomnumber' || evt.id == 'roomnumberList') { //点击门牌号| 门牌号列表

                    } else {
                        //$scope.isShowHouseLs = false;
                    }
                });
                if (getParameterByName("flag") != "true") {
                //跳转回来获取居室和朝向
                if (getParameterByName("roomtype") != null && getParameterByName("toward") != null) {
                    $("#roomtypetoward").css("width", "0");
                } else {
                    $("#roomtypetoward").css("width", "100%");
                }
                }

                //评估对象模糊匹配
                $("#appraisalobject").focus(function() {

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
                            residentialAreaName: function() {
                                return $("#appraisalobject").val(); //encodeURIComponent(
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
                    }).result(function(event, data, formatted) { // 点击后的回调
                        //选择下拉框
                        $scope.form.residentialAreaID = data.residentialAreaid; // 小区ID
                        $scope.form.residentialAreaName = data.matchName; // 小区名称
                        $("#appraisalobject").val($scope.form.residentialAreaName);
                        $scope.form.floorBuilding = "";
                        $scope.form.houseNumber = "";
                        $("#hasorunite").hide();
                        isCheck = true;
                        getSpecial($scope, AccuratevaluationService, $);
                    });

                });
                $("#appraisalobject").blur(function() {
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
                    getSpecial($scope, AccuratevaluationService, $);
                });


                $("#buildingnum").bind({
                    'input propertychange': function() {
                        $scope.isShowBuildLs = false;
                        $("#hasorunite").hide();
                        $scope.form.cellNumber = "";
                        $scope.form.houseNumber = "";

                    },
                    'change': function() {
                        $scope.isShowBuildLs = false;
                        $("#hasorunite").hide();
                        $scope.form.cellNumber = "";
                        $scope.form.houseNumber = "";

                    }
                });

                $("#unit").bind('input propertychange', function() {
                    $scope.isShowUnitLs = false;
                });
                $("#roomnumber").bind('input propertychange', function() {
                    $scope.isShowHouseLs = false;
                });

            });



            $("#areas").blur(function() {
                if ($.trim($("#appraisalobject").val()) != "") {
                    if ($.trim($("#areas").val()) != "") {
                        if (/^[1-9]+\.{0,1}[0-9]{0,2}$/.test($.trim($("#areas").val()))) {
                            $scope.getroomtype.cityName = $scope.form.cityName;
                            $scope.getroomtype.residentialName = $scope.form.residentialAreaName;
                            $scope.getroomtype.area = $.trim($("#areas").val());
                            getRoomTypes($scope, AccuratevaluationService);
                        }
                    }
                }
            });


            //居室类型
            $("#roomtypetoward").click(function() {
                $("#speciallist").hide();
                if ($(this).attr("flag") == "true") {
                    $("html,body").css("overflow", "hidden");
                    $("#roomtypelist").show();
                }
            });

            //居室类型
            $("#roomtype").click(function(event) {
                $("#speciallist").hide();
                $("#roomtypelist").show();
                event.stopPropagation();
                $("html,body").css("overflow", "hidden");
            });
            $("#toward").click(function(event) {
                $("#roomtypelist").css("display", "none");
                $("#towardlist").show();
                event.stopPropagation();
                $("html,body").css("overflow", "hidden");
            });
            $scope.roomtypelist = function(value) {
                $scope.form.roomtype = value;
                $scope.roomType = value;
                $("#roomtypelist").hide();
                if ($scope.flag == true) {
                    $("#towardlist1").css("display", "block");
                }
                $("html,body").css("overflow", "auto");
            }

            $scope.towardlist = function(value) {
                $("#roomtypelist").hide();
                $scope.form.toward = value;
                $("#toward").val(value + "朝向");
                $("#towardlist").hide();
                $("html,body").css("overflow", "auto");
                //$("#special").show();
                //$scope.form.specialFactors = $scope.specialFactorsLs[0].value;//选中第一个
                if ($scope.specialFactorsLs && $scope.specialFactorsLs.length > 0 && $scope.specialFactorsLs[0].value != "") {
                    $("#special").show();
                    $("#speciallist").show();
                } else {
                    $("#special").hide();
                    $("#speciallist").hide();
                }
            }

            $scope.towardlist1 = function(value) {
                $("#roomtypetoward").css("width", "0");
                $("#groups").show();
                $scope.flag = false;
                $scope.form.toward = value;
                $("#toward").val(value + "朝向");
                $("#towardlist1").hide();

                $("html,body").css("overflow", "auto");
                //$("#special").show();
                //$scope.form.specialFactors = $scope.specialFactorsLs[0].value;//选中第一个
                if ($scope.specialFactorsLs && $scope.specialFactorsLs.length > 0 && $scope.specialFactorsLs[0].value != "") {
                    $("#special").show();
                    $("#speciallist").show();
                } else {
                    $("#special").hide();
                    $("#speciallist").hide();
                }
            }

            $scope.clicklist = function() {
                $("#speciallist").show();
                $("html,body").css("overflow", "hidden");
            }

            $scope.hasnone = function(value) {
                $scope.form.specialFactors = "";
                $("#specialreson").val(value);
                $("#speciallist").hide();
            }

            $scope.speciallist = function(value) {
                $("#speciallist").hide();
                $scope.form.specialFactors = value;
                $("#specialreson").val(value);
                $("html,body").css("overflow", "auto");
            }

            //显示楼栋列表
            $scope.selectBuild = function() {
                if (!$scope.form.residentialAreaID || $scope.form.residentialAreaID == null) {
                    $scope.isShowBuildLs = false;
                    return;
                }
                AccuratevaluationService.getBuilding({
                    residentialID: $scope.form.residentialAreaID
                }).success(function(data, statue) {
                    if (data.code == 200) {
                        $scope.buildingList = data.data;
                        if (data.data.length > 0) {
                            if (data.data.length == 1) {

                                if (data.data[0].buildingName == "默认楼幢") {
                                    $("#hasorunite").hide();
                                    $scope.just_unit = true;
                                    $scope.isShowBuildLs = true;
                                    $scope.form.floorBuildingID = data.data[0].buildingid;
                                    $scope.isShowUnitLs = false;
                                    $scope.just_building = false;
                                    getunitnum($scope, AccuratevaluationService);
                                } else {
                                    $("#hasorunite").hide();
                                    $scope.just_unit = true;
                                    $scope.isShowBuildLs = true;
                                    $scope.just_building = true;
                                    $scope.isShowUnitLs = false;
                                }
                            } else if (data.data.length > 1) {
                                var list = new Array();
                                list = data.data;
                                for (var i = 0; i < data.data.length; i++) {
                                    // 如果返回默认楼栋，则过滤楼栋，根据默认楼栋ID 请求单元
                                    if ('默认楼幢' == data.data[i].buildingName) {
                                        $scope.just_unit = true;
                                        $scope.form.floorBuildingID = data.data[i].buildingid;
                                        getunitnum($scope, AccuratevaluationService);
                                    }
                                }
                                $scope.just_building = true;
                                removeByValue(list, "默认楼幢");
                                $scope.buildingList = list.sort(_sory("buildingName"));
                                $scope.isShowBuildLs = true;
                                $scope.isShowUnitLs = false;
                            }
                        } else {
                            $("#hasorunite").hide();
                        }
                    } else {
                        $scope.isShowBuildLs = false;
                    }
                }).error(function(data, statue) {
                    $scope.isShowBuildLs = false;
                });
                // $scope.isShowBuildLs = !$scope.isShowBuildLs;
            };

            //显示单元列表
            $scope.selectUnit = function() {
                if (!$scope.isShowUnitLs && $scope.unitList && $scope.unitList != null && $scope.unitList.length > 0) {

                    // 楼栋ID 存在， 请求单元列表
                    if ($scope.form.floorBuildingID && $scope.form.floorBuildingID != null) {
                        AccuratevaluationService.getUnits({
                            buildingId: $scope.form.floorBuildingID
                        }).success(function(data, statue) {
                            if (data.code == 200) {
                                if (data.data.length > 0) {
                                    for (var i = 0; i < data.data.length; i++) {
                                        if ('默认单元' == data.data[i].unitName) {
                                            $("#hasorunite").hide();
                                            $scope.isShowUnitLs = false;
                                        } else {
                                            $("#hasorunite").show();
                                        }
                                    }
                                    $scope.isShowUnitLs = true;
                                    //$scope.unitList = data.data;
                                    removeByValue(data.data, "默认单元");
                                    //$scope.isShowUnitLs = true;

                                    $scope.unitList = data.data.sort(_sory("unitName")); //.sort(_sory("unitName"));
                                } else {
                                    $scope.isShowUnitLs = true;
                                    $scope.unitList = data.data.sort(_sory("unitName")); //.sort(_sory("unitName"));
                                    //$scope.isShowUnitLs = true;
                                }
                            } else {
                                $scope.isShowUnitLs = false;
                            }
                        }).error(function(data, statue) {
                            $scope.isShowUnitLs = false;
                        });
                    }

                } else {
                    $scope.isShowUnitLs = false;
                    return;
                }
            }

            //点击门牌号ITEM
            $scope.houseClick = function(houseName) {
                $scope.isShowHouseLs = false;
                if (!houseName || houseName == null) {
                    return;
                }
                if (houseName.buildingArea == "") {
                    $scope.form.area = "";
                } else {
                    $scope.form.area = parseFloat(houseName.buildingArea).toFixed(2) + "";
                }

                //跳转回来获取居室和朝向
                if (houseName.rooms != "" && houseName.toward != "") {
                    $("#roomtypetoward").css("width", "0");
                    $("#toward").attr("value", houseName.toward + "朝向");
                    $("#groups").show();
                } else {
                    if (houseName.rooms == "" && houseName.toward == "") {
                        $("#roomtypetoward").css("width", "100%");
                    } else {
                        $("#groups").show();
                        if (houseName.toward != "") {
                            $("#roomtypetoward").css("width", "0");
                            $("#toward").attr("value", houseName.toward + "朝向");

                        }
                        if (houseName.rooms != "") {
                            $("#roomtypetoward").css("width", "0");
                        }
                    }
                }
                $scope.form.houseNumber = houseName.houseName;
                $scope.form.floor = houseName.floor;
                $scope.form.totalfloor = houseName.floorCount;
                $scope.form.roomtype = houseName.rooms;
                $scope.form.toward = houseName.toward;
            };

            $scope.buildClick = function(builder) {
                $scope.form.floorBuilding = builder.buildingName;
                $scope.form.floorBuildingID = builder.buildingid;
                $scope.form.cellNumber = "";
                $scope.form.totalfloor = builder.floorCount;
                //buildingTime: "2002-01-01"
                if (builder.buildingTime && builder.buildingTime != null && builder.buildingTime != "") {
                    $scope.form.buildingyear = builder.buildingTime.substr(0, 4);
                }
                $scope.isShowBuildLs = false;
                AccuratevaluationService.getUnits({
                    buildingId: $scope.form.floorBuildingID
                }).success(function(data, statue) {
                    if (data.code == 200) {
                        if (data.data.length > 0) {
                            $scope.form.totalfloor = data.data[0].floorCount;
                            if (data.data.length == 1) {
                                if (data.data[0].unitName == "默认单元") {
                                    $scope.form.unitId = data.data[0].unitId;
                                    $scope.form.buildingId = $scope.form.floorBuildingID;
                                    AccuratevaluationService.getHouse($scope.form).success(function(data, statue) {
                                        if (data.code == 200) {
                                            $scope.isShowHouseLs = true;
                                            $scope.houseNameLs = data.data.sort(_sory("houseName"));
                                        } else {
                                            $scope.isShowHouseLs = false;
                                        }
                                    }).error(function(data, statue) {
                                        $scope.isShowHouseLs = false;
                                    });
                                    $scope.isShowUnitLs = false;
                                    $("#hasorunite").hide();
                                } else {

                                    $scope.isShowUnitLs = true;
                                    $("#hasorunite").show();
                                }

                            } else {
                                for (var i = 0; i < data.data.length; i++) {
                                    if (data.data[i].unitName == "默认单元") {
                                        data.data.baoremove(i);
                                        break;
                                    }
                                }
                                $scope.unitList = data.data.sort(_sory("unitName"));
                                $scope.isShowUnitLs = true;
                                $("#hasorunite").show();
                            }
                        }
                    } else {
                        $scope.isShowUnitLs = false;
                        $("#hasorunite").hide();
                    }
                }).error(function(data, statue) {
                    $scope.isShowUnitLs = false;
                });
            };

            //单元号ITEM 点击事件
            $scope.unitClick = function(unit) {
                $scope.form.cellNumber = unit.unitName;
                $scope.form.unitId = unit.unitId;
                $scope.isShowUnitLs = false;
                $("#hasorunite").show();
            };

            $scope.hasnobuilding = function(unit) {
                $scope.form.unitId = unit.unitId;
                $scope.isShowUnitLs = false;
                $("#hasorunite").hide();
                $("#buildingnum").val(unit.unitName);
                $scope.isShowBuildLs = false;
            };

            //根据单元ID 获取门牌号
            $scope.selectHouseNum = function() {
                if (!$scope.form.unitId || $scope.form.unitId == null) {
                    // 还没有获取到单元ID
                    return;
                }
                //请求门牌号
                var _type = {};
                _type.unitId = $scope.form.unitId;
                _type.buildingId = $scope.form.floorBuildingID;
                AccuratevaluationService.getHouse(_type).success(function(data, statue) {
                    if (data.code == 200) {
                        $scope.isShowHouseLs = true;
                        $scope.houseNameLs = data.data.sort(_sory("houseName"));
                    } else {
                        $scope.isShowHouseLs = false;
                    }
                }).error(function(data, statue) {
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
                    buildingnum: {
                        maxlength: 30
                    },
                    houseType: {
                        required: true
                    },
                    areas: { //房屋面积
                        required: true,
                        mianji: true,
                        max: 9998.99,
                        min: 1,
                        maxlength: 7,
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
                        posintdec4: true, // 正整数
                        max: 100
                    },
                    totalfloor: {
                        posint: true, // 正整数
                        max: 100,
                        larger: true
                    }
                },
                messages: {
                    appraisalobject: {
                        required: "请输入评估对象!"
                    },
                    buildingnum: {
                        maxlength: "请输入最多30个字符",
                    },
                    areas: { //房屋面积
                        required: "请输入具体的建筑面积!",
                        mianji: "请输入面积为1~9998.99，只留两位小数",
                        max: "请输入面积范围为1~9998.99",
                        min: '请输入面积范围为1~9998.99',
                        maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
                        maxlength: "请输入面积范围为1~9998.99"
                    },
                    houseType: {
                        required: "请选择居室类型"
                    },

                    roomtype: { //评估公司
                        required: "请选择居室类型!"
                    },
                    buildingyear: {
                        maxlength: "请输入年代为1900~" + year + "的四位整数 !",
                        minlength: "请输入年代为1900~" + year + "的四位整数 !",
                        min: "请输入年代为1900~" + year + "的四位整数 !",
                        max: "请输入年代为1900~" + year + "的四位整数 !"
                    },
                    currentfloor: {
                        posintdec4: "请输入所在层为-1或者1~100的整数",
                        max: "请输入所在层为-1或者1~100的整数"

                    },
                    totalfloor: {
                        posint: "请输入总楼层为1~100的整数",
                        max: "请输入总楼层为1~100的整数",
                        larger: "总楼层不能低于所在楼层!"
                    }
                },
                success: function(label) {
                    label.closest('.form_valid').next(".error").remove();
                    if (label[0].control.id == "currentfloor" || label[0].control.id == "totalfloor") {
                        $("#" + label[0].control.id).parent().parent().parent().parent().removeClass('error_bor');
                    } else {
                        $("#" + label[0].control.id).parent().parent().parent().removeClass('error_bor');
                    }
                },
                errorPlacement: function(error, element) {
                    element.closest('.form_valid').next(".error").remove();
                    if (error[0].innerHTML != "") {
                        var html = '<div class="weui_cell text-bg-gray error">' + '<label><span class="error_color">提示：</span>' + error[0].innerHTML + '</label>' + '</div>';
                        element.closest('.form_valid').after(html);
                        element.closest('.form_valid').addClass('bor error_bor');
                        $("#" + element[0].id).focus();
                    }
                }
            });
            //总楼层大于或等于所在楼层
            $.validator.addMethod("larger", function(value, element) {
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

            //提交表单
            $scope.onSubmit = function() {
                debugger;
                if ($("#Assess").valid()) {
                    if ($scope.form.residentialAreaID != "") {
                        if ($("#appraisalobject").val() != "" && $("#areas").val() != "" && $("#roomtype ").val() != "") {
                            $scope.form.isroomtype = checkRoomType($("#roomtype").val());
                            if ($scope.form.toward == "不确定") {
                                $scope.form.toward = "";
                            }
                            $("#loadingToast").show();
                            AccuratevaluationService.getPrecisePrice($scope.form).success(function(data, statue) {

                                if (data.code == 200) {
                                    $("#loadingToast").hide();
                                    var obj = data.data;
                                    if (obj && obj != null) {
                                        obj.residentialAreaName = $scope.form.residentialAreaName;

                                        var _obj = {
                                            x: obj.x,
                                            y: obj.y,
                                            jiLuId: obj.xunjiaID
                                        };
                                        window.localStorage.setItem("obj", JSON.stringify(_obj));
                                        window.open("#/accuratevaluation-results?cellNumber=" + $scope.form.cellNumber);
                                        //window.location.href = "#/accuratevaluation-results?cellNumber=" + $scope.form.cellNumber;
                                    } else {
                                        $layer.open({
                                            content: "估值失败！",
                                            btn: ['OK']
                                        });
                                    }
                                } else {
                                    $("#loadingToast").hide();
                                    $layer.open({
                                        content: "估值失败！",
                                        btn: ['OK']
                                    });
                                }
                            }).error(function(data, statue) {
                                $("#loadingToast").hide();
                                $layer.open({
                                    content: "网络异常，请检查网络！",
                                    btn: ['OK']
                                });
                            });
                        } else {
                            return false;
                        }
                    } else {
                        $layer.open({
                            content: "未匹配到小区，请重新输入",
                            btn: ['OK']
                        });
                    }
                }
            };
        });
    });

//空值过滤
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

//获取特殊因数
function getSpecial($scope, AccuratevaluationService, $) {
    //根据小区名获取特殊因素
    if ($scope.form.residentialAreaName && $scope.form.residentialAreaName != null) {
        AccuratevaluationService.getSpecialFactors({
            residentialAreaName: $scope.form.residentialAreaName
        }).success(function(data, statue) {
            if (data.code == 200) {
                $scope.specialFactorsLs = data.data;
                if ($scope.specialFactorsLs && $scope.specialFactorsLs.length > 0) {
                    if ($scope.specialFactorsLs[0].value && $scope.specialFactorsLs[0].value != null &&
                        $scope.specialFactorsLs[0].value != "") {} else {
                        $("#special").hide();
                        //$("#specialreson").unbind("click");
                    }

                } else {
                    $("#special").hide();
                    //$("#specialreson").unbind("click");
                }
            } else {}
        }).error(function(data, statue) {});
    }

}
//根据小区楼栋id获取单元号
function getunitnum($scope, AccuratevaluationService) {
    AccuratevaluationService.getUnits({
        buildingId: $scope.form.floorBuildingID
    }).success(function(dataresult, statue) {
        if (dataresult.code == 200) {
            if ($scope.buildingList.length == 1) {
                $scope.isShowUnitLs = false;
                $("#hasorunite").hide();
            } else {
                if (dataresult.data.length > 0) {
                    if (dataresult.data.length == 1 && dataresult.data[0].unitName == "默认单元") {
                        $scope.isShowUnitLs = false;
                        $("#hasorunite").show();
                    } else {
                        for (var i = 0; i < dataresult.data.length; i++) {
                            if (dataresult.data[i].unitName == "默认单元") {
                                dataresult.data.baoremove(i);
                                break;
                            }
                        }
                        $scope.isShowUnitLs = true;
                        $("#hasorunite").show();

                    }
                }
            }
            $scope.unitList = dataresult.data.sort(_sory("unitName"));

        } else {
            $scope.isShowUnitLs = false;
            $("#hasorunite").hide();
        }
    }).error(function(data, statue) {
        $scope.isShowUnitLs = false;
    });
}


//根据城市名、小区名、面积获取居室类型
function getRoomTypes($scope, AccuratevaluationService) {
    AccuratevaluationService.getRoomType($scope.getroomtype).success(function(data, statue) {
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
    }).error(function(data, statue) {
        $scope.isgetroom = false;
    });
}

//数组移除某项{id}
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].buildingName == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

//居室类型文字转数字
function checkRoomType(val) {
    if ("一居室" == val) {
        return "1"
    }
    if ("二居室" == val) {
        return "2"
    }
    if ("三居室" == val) {
        return "3"
    }
    if ("四居室" == val) {
        return "4"
    }
    if ("五居室" == val) {
        return "5"
    }
    if ("五居室以上" == val || "多居多室" == val) {
        return "9"
    }
    if ("其他" == val) {
        return "0"
    }
}

//数组排序
function _sory(name, minor) {

    return function(o, p) {

        var a, b;

        if (o && p && typeof o === 'object' && typeof p === 'object') {

            a = o[name];
            b = p[name];

            if (a === b) {
                return typeof minor === 'function' ? minor(o, p) : 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        }
    }
}

//数组移除某项{id}
Array.prototype.baoremove = function(dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    this.splice(dx, 1);
}