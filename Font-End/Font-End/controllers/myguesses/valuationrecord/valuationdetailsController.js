/**
 * valuationdetails/估价记录详情
 */
define(['app', 'jquery', 'handler', '../../../services/myguesses/valuationrecordServices'], function(app, $, handler, valuationrecordServices) {
    app.controller('ValuationdetailsCtrl', function($scope, valuationrecordServices) {
        handler.setTitle("估价详情");
        //服务请求
        $scope.formData = {};
        $scope.recordsdetial = {};
        $scope.xx ={};
        var keHuId = window.localStorage.getItem("keHuId");
        var cityName = window.localStorage.getItem("cityName");
        $scope.formData.jiLuId = getParameterByName("jiLuId");
        //结果存储
        getdetail($scope, valuationrecordServices);

        //委托报单
        $scope.entrust = function() {
                window.location.href = "#/delegatedeclaration?area=" + ifNull($scope.recordsdetial.weituopinggumianji) +
                    "&residentialAreaID=" + ifNull($scope.recordsdetial.xiaoquid) +
                    "&residentialAreaName=" + ifNull($scope.recordsdetial.weituopingguxiangmu) +
                    "&roomtype=" + ifNull($scope.recordsdetial.jushileixing) +
                    "&currentfloor=" + ifNull($scope.recordsdetial.suozailouceng) +
                    "&totalfloor=" + ifNull($scope.recordsdetial.zonglouceng) +
                    "&address=" + ifNull($scope.recordsdetial.xiangxidizhi);
            }
            //重新估价
        $scope.appraisal = function() {
                var obj={};
                obj.area = ifNull($scope.recordsdetial.weituopinggumianji);
                obj.residentialAreaID=ifNull($scope.recordsdetial.xiaoquid) ;
                obj.residentialAreaName=ifNull($scope.recordsdetial.weituopingguxiangmu);
                obj.roomtype=ifNull($scope.recordsdetial.jushileixing) ;
                obj.houseNumber=ifNull($scope.recordsdetial.huhao) ;
                obj.toward=ifNull($scope.recordsdetial.chaoxiang) ;
                obj.special=ifNull($scope.recordsdetial.teshuyinsu) ;
                obj.floorBuilding=ifNull($scope.recordsdetial.louzhuanghao) ;
                obj.floor=ifNull($scope.recordsdetial.suozailouceng) ;
                obj.totalfloor=ifNull($scope.recordsdetial.zonglouceng) ;
                obj.buildingyear=ifNull($scope.recordsdetial.jianchengniandai);
                obj.cellNumber=ifNull($scope.recordsdetial.cellNumber);
                var str=JSON.stringify(obj);
                window.localStorage.setItem("fggjrrecordsdetial",str);
                window.location.href = "#/accuratevaluation?flag=true&tempid="+Math.random();
        }
    });
});

//获取估价记录详情
function getdetail($scope, valuationrecordServices) {
    $("#loadingToast").show();
    valuationrecordServices.recorddetails($scope.formData).success(function(data, statue) {
        $("#loadingToast").hide();
        if (data.code == 200) {
            $scope.recordsdetial = data.data;
            
            $scope.recordsdetial.jushileixing = checkRoomNumType($scope.recordsdetial.jushileixing);
            $scope.recordsdetial.shichangdanjia = upade($scope.recordsdetial.shichangdanjia);


            if ($scope.recordsdetial.chaoxiang == "" || $scope.recordsdetial.chaoxiang == null) {
                $scope.xx.chaoxiang = "";
            } else {
                $scope.xx.chaoxiang = "  " + $scope.recordsdetial.chaoxiang + "朝向";
            }

            if ($scope.recordsdetial.suozailouceng == "" || $scope.recordsdetial.suozailouceng == null) {
                $scope.xx.suozailouceng = "";
            } else {
                $scope.xx.suozailouceng = "所在" + $scope.recordsdetial.suozailouceng + "层";
            }

            if ($scope.recordsdetial.zonglouceng == "" || $scope.recordsdetial.zonglouceng == null) {
                $scope.xx.zonglouceng = "";
            } else {
                $scope.xx.zonglouceng = " 共" + $scope.recordsdetial.zonglouceng + "层";
            }
            if ($scope.recordsdetial.teshuyinsu == "" || $scope.recordsdetial.teshuyinsu == null) {
                $scope.xx.teshuyinsu = "";
            } else {
                $scope.xx.teshuyinsu = " " + $scope.recordsdetial.teshuyinsu;
            }
            if ($scope.recordsdetial.jianchengniandai == "" || $scope.recordsdetial.jianchengniandai == null) {
                $scope.xx.jianchengniandai = "";
            } else {
                $scope.xx.jianchengniandai = $scope.recordsdetial.jianchengniandai + "年";
            }
        } else {
            $layer.open({
                content: '服务器繁忙，请稍后再试！',
                style: 'background-color:#09C1FF; color:#fff; border:none;',
                time: 2
            });
        }

    }).error(function(data, statue) {
        $("#loadingToast").hide();

    });
}
//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


function checkRoomNumType(val) {
    if ("1" == val) {
        return "一居室"
    }
    if ("2" == val) {
        return "二居室"
    }
    if ("3" == val) {
        return "三居室"
    }
    if ("4" == val) {
        return "四居室"
    }
    if ("5" == val) {
        return "五居室"
    }
    if ("9" == val) {
        return "五居室以上"
    }
    if ("-1" == val || "0" == val) {
        return "其他"
    }
}

function ifNull(obj) {
    if (!obj || obj == null || obj == 'null' || obj == undefined) {
        return "";
    }
    return obj;
}


function upade(num) {
    var _num = num + "";
    var str = "";
    if (_num != null && _num.length > 2) {
        str = Math.round(parseInt(num) / 100) * 100 + "";
    } else {
        str = "0";
    }
    return str;
}