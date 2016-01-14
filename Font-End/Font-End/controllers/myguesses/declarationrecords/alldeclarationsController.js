/**
 * alldeclarations/全部报单
 */
define(['app', 'jquery', 'handler', '_layer', 'kevin_swipe', '../../../services/myguesses/declarationrecords/declarationServices'],
    function (app, $, handler, $layer, declarationServices) {
        app.controller('AlldeclarationsCtrl', function ($scope, declarationServices) {
            var mySwiper;
            $scope.noData = false;
            handler.setTitle("全部报单");
            //判断客户ID是否存在 微信客户端使用
            handler.isKeHuID();
            var pageSize = 7;// 每页大小
            $scope.pageCount = 0;// 总页数
            /* $scope.currentPage = 0;// 当前页码*/
            $scope.allPageList;// 所有页数据
            //$scope.declarations = [];// 当前页数据
            $scope.remoteDataList = [];// 远程所有数据

            /***
             * 首次进入页面 显示全部，请求接口
             */
            $scope.selectedRow = 5;
            /***
             * 未完成 按钮显示与否
             * @type {boolean}
             */
            $scope.unfinished = true;
            /***
             * 未完成按钮点击下标
             * @type {number}
             */
            $scope.isDeal = 1;

            $scope.isShow = false;


            var setListData = function () {
                $('#slider').html("");
                for (var i = 0; i < $scope.allPageList.length; i++) {
                    var li = "";
                    for (var k = 0; k < $scope.allPageList[i].length; k++) {
                        var reportNn = $scope.allPageList[i][k].weiTuoPingGuNo;
                        var weiTuoXiangMuDiZhi = $scope.projectNameDeal($scope.allPageList[i][k].weiTuoXiangMuDiZhi);
                        var weiTuoPingGuTime = $scope.timeDeal($scope.allPageList[i][k].weiTuoPingGuTime);
                        li = li + "<li><a href='#/completeddeclaration?reportStat=" + $scope.selectedRow + "&reportNum=" + reportNn + "' style='color: #000;'>";
                        li = li + "<dl class='pad_x_8'>";
                        li = li + "<dd class='width_35 f-fl bor_b bor_color_eb' style='height;2.0em'>";
                        li = li + reportNn + "</dd>";
                        li = li + "<dd class='width_35 f-fl ccyc bor_b bor_color_eb'  style='height;2.0em'>";
                        li = li + weiTuoXiangMuDiZhi + "</dd>";
                        li = li + "<dd class='width_300 f-fl bor_b bor_color_eb'  style='height;2.0em'>";
                        li = li + weiTuoPingGuTime + "</dd>";
                        li = li + "<dd class='f-cf' style='height:0'></dd></dl></a></li>";
                    }
                    var pageDiv = "<div class='swiper-slide'><ul>";
                    pageDiv = pageDiv + li;
                    pageDiv = pageDiv + "</ul></div>";
                    $('#slider').append(pageDiv);
                }
                ;
                /* $('#slider').append("<div class='swiper-pagination'></div>");*/
            };


            var setSwiperDom = function () {
                if (!mySwiper || mySwiper == null) {
                    mySwiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        onSlideChangeEnd: function (swiper) {
                            if(swiper.activeIndex + 1>$scope.pageCount){
                                mySwiper.slideTo(swiper.activeIndex-1);
                                return;
                            }
                            swiper.activeIndex + 1;
                            $('#page').text(swiper.activeIndex + 1);
                        }
                    });
                }
                mySwiper.slideTo(0);
            }

            /***
             * 头部 tab 切换 事件
             * @param index
             */
            $scope.selected = function (index) {
                $scope.selectedRow = index;
                if (index == 1) {
                    $scope.unfinished = false;
                } else {
                    $scope.unfinished = true;
                }
                getDeclarationInfo({type: $scope.selectedRow});
            }

            /***
             * 未完成 是否处理按钮点击事件
             * @param index
             */
            $scope.isDealSet = function (index) {
                $scope.isDeal = index;
                $scope.selectedRow = index;
                getDeclarationInfo({type: $scope.selectedRow});
            }
            /***
             * item 点击事件， 跳转
             * @param declaration
             */
            $scope.itemClick = function (declaration) {

            };

            /***
             * 分页获取数据
             * @param index
             * @param remoteDataList
             * @returns {Array}
             */
            var spiceArray = function (currentPage, remoteDataList) {
                var resultArray = new Array();
                $scope.pageCount = Math.floor(remoteDataList.length / pageSize);
                if (remoteDataList.length % pageSize > 0) {
                    $scope.pageCount++;
                }
                for (var c = 0; c < $scope.pageCount; c++) {
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

            /***
             * 时间字符串处理
             * @param timeStr
             * @returns {string}
             */
            $scope.timeDeal = function (timeStr) {
                /*var val = Date.parse(timeStr);
                 var newDate = new Date(val);
                 var years = newDate.getFullYear();
                 var months = newDate.getMonth() + 1;
                 var days = newDate.getDate();
                 var nowtimes = years + "-" + months + "-" + days;//当前的格式时间*/
                return timeStr.substring(0, 10);
            }
            //过滤返回的 null 字符串
            $scope.projectNameDeal = function (weiTuoXiangMuMingCheng) {
                if (!weiTuoXiangMuMingCheng || weiTuoXiangMuMingCheng == null || weiTuoXiangMuMingCheng == 'null' || weiTuoXiangMuMingCheng == 'Null') {
                    return "";
                }
                return weiTuoXiangMuMingCheng;
            }

            /***
             * 获取报单记录数据
             * @param from
             */
            var getDeclarationInfo = function (from) {
                $scope.isShow = true;
                declarationServices.getDeclarationInfo(from).success(function (data, statue) {
                    //返回的数据
                    if (data.code == 200) {
                        $scope.remoteDataList = data.data;
                        //加载完，默认显示第一页
                        $scope.allPageList = spiceArray(1, $scope.remoteDataList);
                        /* $scope.declarations = $scope.allPageList[0];*/
                        debugger;
                        if ($scope.allPageList.length >= 1) {
                            $('#page').text(1);
                            $scope.noData = false;
                            //$scope.currentPage = 1;
                        } else {
                            $('#page').text(0);
                            $scope.noData = true;
                            //$scope.currentPage = 0;
                        }
                        ;
                        setListData();
                        setSwiperDom();
                    } else {
                        /*$layer.open({
                         content: data.message,
                         btn: ['OK']
                         }
                         );*/
                    }
                    $scope.isShow = false;
                }).error(function (data, statue) {
                    $scope.isShow = false;
                });

            }
            /***
             * 页面初始化，默认加载全部报单数据
             */
            getDeclarationInfo({type: 5});
        });

    });

