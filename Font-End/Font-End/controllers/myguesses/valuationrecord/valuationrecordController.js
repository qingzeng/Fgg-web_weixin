/**
 * valuationrecordController/估价记录列表
 */
define(['app', 'jquery', 'handler', 'kevin_swipe', 'swipe', '../../../services/myguesses/valuationrecordServices'], function(app, $, handler, valuationrecordServices) {
    app.controller('ValuationrecordCtrl', function($scope, valuationrecordServices) {
        handler.setTitle("估价记录");
        //判断用户是否登陆
        handler.isKeHuID();
        var keHuId = window.localStorage.getItem("keHuId");
        var cityName = window.localStorage.getItem("cityName");
        $scope.page = {};
        $scope.pagetotal = "";
        $scope.recordlist = {};
        var pageSize = 7; // 每页大小
        $scope.pageCount = 0; // 总页数
        $scope.currentPage = 0; // 当前页码
        $scope.formData = {
            keHuId: keHuId,
            cityName: cityName
        }
        var setListData = function() {
            for (var i = 0; i < $scope.recordlist.length; i++) {
                var li = "";
                for (var k = 0; k < $scope.recordlist[i].length; k++) {
                    var weiTuoXiangjiLuId = $scope.recordlist[i][k].pinggujiluid;
                    var weiTuoXiangMuMingCheng = $scope.recordlist[i][k].weituopingguxiangmu;
                    var weiTuoPingGuzongjia = $scope.recordlist[i][k].zongjia;
                    var weiTuoPingGuTime = $scope.recordlist[i][k].pinggutime;
                    li = li + "<li style='padding:0.4em 0'><a style='color:#000' href='#/valuationdetails?jiLuId=" + weiTuoXiangjiLuId + "'><dl style='padding:2px 0;'>";
                    li = li + "<dd class='width_35 f-fl' style='padding-top:8px'>";
                    li = li + weiTuoXiangMuMingCheng + "</dd>";
                    li = li + "<dd class='width_35 f-fl ccyc' style='padding-top:8px'>";
                    li = li + weiTuoPingGuzongjia + "</dd>";
                    li = li + "<dd class='width_300 f-fl'>";
                    li = li + weiTuoPingGuTime + "</dd>";
                    li = li + "<dd class='f-cf' style='height:0;'></dd></dl></a></li>";
                }
                var pageDiv = "<div class='swiper-slide'><ul>";
                pageDiv = pageDiv + li;
                pageDiv = pageDiv + "</ul></div>";
                $('#slider').append(pageDiv);
            };
        };
        getrecordlist($scope, valuationrecordServices);
        //滑动翻页
        var setSwiperDom = function() {
            setListData();
            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                onSlideChangeEnd: function(swiper) {
                    $scope.currentPage = swiper.activeIndex + 1;
                    $('#page').text($scope.currentPage);
                }
            });
        }

        function getrecordlist($scope, valuationrecordServices) {
            $("#loadingToast").show();
            valuationrecordServices.recordlist($scope.formData).success(function(data, statue) {
                if (data.code == 200) {
                    if (data.data.length <= 0) {
                        $scope.norecord = true;
                        $("#page").text("0");
                        $scope.pagetotal = 0;
                        $scope.pagecontent = false;
                    } else {
                        $scope.norecord = false;
                        $scope.pagecontent = true;
                        if (data.data.length > 0 && data.data.length <= 7) {
                            $scope.pagetotal = 1;
                        } else if (data.data.length > 7 && data.data.length % 7 > 0) {
                            $scope.pagetotal = parseInt(data.data.length / 7) + 1;
                        } else {
                            $scope.pagetotal = parseInt(data.data.length / 7)
                        }
                        $scope.recordlist = spiceArray(1, data.data);
                        setSwiperDom();
                        //$scope.recordlist = data.data;
                        //$scope.recordlist = spiceArray(data.data);
                    }
                    //$scope.recordlist = spiceArray(list);
                }

                $("#loadingToast").hide();
            }).error(function(data, statue) {
                $("#loadingToast").hide();

            });
        }

    });
});

/***
 * 分页获取数据
 * @param index
 * @param remoteDataList
 * @returns {Array}
 */
var spiceArray = function(currentPage, remoteDataList) {
        var resultArray = new Array();
        var pageSize=7;
        var pageCount;
        pageCount = Math.floor(remoteDataList.length / pageSize);
        if (remoteDataList.length % pageSize > 0) {
            pageCount++;
        }
        for (var c = 0; c <pageCount; c++) {
            var array = new Array();
            for (var k = 0; k < pageSize; k++) {
                if (c * pageSize + k >= remoteDataList.length) {
                    break;
                }
                array[k] = remoteDataList[c * pageSize + k];
            }
            resultArray[c] = array;
        }
        return resultArray;
    }
    //获取估计记录列表
    //获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
