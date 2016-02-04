define(['angularAMD', 'angular-route', 'handler', 'jquery'], function(angularAMD) {
    var app = angular.module("webapp", ['ngRoute']);

    app.factory('UserInterceptor', ["$q", "$rootScope", "$location", function($q, $rootScope, $location) {
        return {
            request: function(config) {
                return config;
            },
            responseError: function(response) {
                return $q.reject(response);
            }
        };
    }]);

    app.config(function($httpProvider) {
        $httpProvider.interceptors.push('UserInterceptor');
    });
    //监听路由事件
    app.run(['$rootScope', '$location', function($rootScope, $location) {
        $rootScope.$on('$routeChangeStart', function() {
            if (window.localStorage.getItem("keHuId") == "" || window.localStorage.getItem("keHuId") == null || window.localStorage.getItem("keHuId") == "null" || window.localStorage.getItem("keHuId") == undefined || window.localStorage.getItem("keHuId") == "undefined") {
                if (window.location.href.indexOf('/login') < 0) {
                    if (window.location.href.indexOf('/locate') > -1) {
                        $location.path('/locate');
                    } else if (window.location.href.indexOf('/tochatwith') > -1) {
                        $location.path('/tochatwith');
                    } else if (window.location.href.indexOf('/voice') > -1) {
                        $location.path('/voice');
                    } else {
                        var code = getParameterByName("code");
                        var openid = getParameterByName("openid");
                        if (code != "" && code != null && code != "null" && code != undefined && code != 'undefined') {
                            GetUserInfoByCode(code);
                        } else if (openid != "" && openid != null && openid != "null" && openid != undefined && openid != 'undefined') {
                            getUserInfoByOpenId(openid);
                        }
                        if (handler.KeHuIDIsNull()) {
                            $location.path('/login?openid=' + window.localStorage.getItem("openid"));
                        }
                    }
                }
            }

        });
    }]);


    // 路由规则
    app.config(function($routeProvider) {
        $routeProvider
            .when("/login", angularAMD.route({ //登录
                templateUrl: 'views/login/login.html',
                controller: 'LoginCtrl',
                controllerUrl: '../../controllers/login/loginController'
            }))
            .when("/personalinformation", angularAMD.route({ //完善个人信息
                templateUrl: 'views/login/personalinformation.html',
                controller: 'PersonalinformationCtrl',
                controllerUrl: '../../controllers/login/personalinformationController'
            }))
            .when("/citySelect", angularAMD.route({ //城市切换样式
                templateUrl: 'views/login/citySelect.html',
                controller: 'citySelectCtrl',
                controllerUrl: '../../controllers/login/citySelectController'
            }))
            .when("/search", angularAMD.route({ //小区查询结果
                templateUrl: 'views/search/search.html',
                controller: 'searchCtrl',
                controllerUrl: '../../controllers/search/searchController'
            }))
            .when("/popstyle", angularAMD.route({ //弹窗样式
                templateUrl: 'views/propertyvaluation/popstyle.html',
                controller: 'PopstyleCtrl',
                controllerUrl: '../../controllers/propertyvaluation/popstyleController'
            }))
            .when("/accuratevaluation", angularAMD.route({ //精准估价
                templateUrl: 'views/propertyvaluation/accuratevaluation/accuratevaluation.html',
                controller: 'AccuratevaluationCtrl',
                controllerUrl: '../../controllers/propertyvaluation/accuratevaluation/accuratevaluationController'
            }))
            .when("/accuratevaluation-results", angularAMD.route({ //精准估价结果页
                templateUrl: 'views/propertyvaluation/accuratevaluation/accuratevaluation-results.html',
                controller: 'Accuratevaluation-resultsCtrl',
                controllerUrl: '../../controllers/propertyvaluation/accuratevaluation/accuratevaluation-resultsController'
            }))
            .when("/communityinformation", angularAMD.route({ //小区信息
                templateUrl: 'views/propertyvaluation/communityinformation/communityinformation.html',
                controller: 'CommunityinformationCtrl',
                controllerUrl: '../../controllers/propertyvaluation/communityinformation/communityinformationController'
            }))
            .when("/locate", angularAMD.route({ //定位查询
                templateUrl: 'views/propertyvaluation/intelligentquerytutorials/locate.html',
                controller: 'LocateCtrl',
                controllerUrl: '../../controllers/propertyvaluation/intelligentquerytutorials/locateController'
            }))
            .when("/tochatwith", angularAMD.route({ //文字查询
                templateUrl: 'views/propertyvaluation/intelligentquerytutorials/tochatwith.html',
                controller: 'TochatwithCtrl',
                controllerUrl: '../../controllers/propertyvaluation/intelligentquerytutorials/tochatwithController'
            }))
            .when("/voice", angularAMD.route({ //语音查询
                templateUrl: 'views/propertyvaluation/intelligentquerytutorials/voice.html',
                controller: 'VoiceCtrl',
                controllerUrl: '../../controllers/propertyvaluation/intelligentquerytutorials/voiceController'
            }))
            .when("/delegatedeclaration", angularAMD.route({ //委托报单
                templateUrl: 'views/acceptancebusiness/delegatedeclaration/delegatedeclaration.html',
                controller: 'DelegatedeclarationCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/delegatedeclaration/delegatedeclarationController'
            }))
            .when("/delegateresult", angularAMD.route({ //委托报单结果
                templateUrl: 'views/acceptancebusiness/delegatedeclaration/delegateresult.html',
                controller: 'DelegatedeclarationCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/delegatedeclaration/delegateresultController'
            }))
            .when("/valuationrecord", angularAMD.route({ //估价记录
                templateUrl: 'views/myguesses/valuationrecord/valuationrecord.html',
                controller: 'ValuationrecordCtrl',
                controllerUrl: '../../controllers/myguesses/valuationrecord/valuationrecordController'
            }))
            .when("/valuationdetails", angularAMD.route({ //估价详情
                templateUrl: 'views/myguesses/valuationrecord/valuationdetails.html',
                controller: 'ValuationdetailsCtrl',
                controllerUrl: '../../controllers/myguesses/valuationrecord/valuationdetailsController'
            }))
            .when("/feportofauthenticity", angularAMD.route({ //报告真伪
                templateUrl: 'views/acceptancebusiness/reportofauthenticity/feportofauthenticity.html',
                controller: 'FeportofauthenticityCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/reportofauthenticity/feportofauthenticityController'
            }))
            .when("/authenticitycheck", angularAMD.route({ //真伪查询
                templateUrl: 'views/acceptancebusiness/reportofauthenticity/authenticitycheck.html',
                controller: 'AuthenticitycheckCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/reportofauthenticity/authenticitycheckController'
            }))
            .when("/authenticityresults", angularAMD.route({ //查询结果
                templateUrl: 'views/acceptancebusiness/reportofauthenticity/authenticityresults.html',
                controller: 'AuthenticityresultsCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/reportofauthenticity/authenticityresultsController'
            }))
            .when("/progressreport-one", angularAMD.route({ //报告进度1
                templateUrl: 'views/acceptancebusiness/progressreport/progressreport-one.html',
                controller: 'Progressreport-oneCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/progressreport/progressreport-oneController'
            }))
            .when("/progressreport-two", angularAMD.route({ //报告进度2
                templateUrl: 'views/acceptancebusiness/progressreport/progressreport-two.html',
                controller: 'Progressreport-twoCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/progressreport/progressreport-twoController'
            }))
            .when("/progressdetails-one", angularAMD.route({ //进度详情1
                templateUrl: 'views/acceptancebusiness/progressreport/progressdetails-one.html',
                controller: 'Progressdetails-oneCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/progressreport/progressdetails-oneController'
            }))
            .when("/progressdetails-two", angularAMD.route({ //进度详情2
                templateUrl: 'views/acceptancebusiness/progressreport/progressdetails-two.html',
                controller: 'Progressdetails-twoCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/progressreport/progressdetails-twoController'
            }))
            .when("/progressdetails-three", angularAMD.route({ //进度详情3
                templateUrl: 'views/acceptancebusiness/progressreport/progressdetails-three.html',
                controller: 'Progressdetails-threeCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/progressreport/progressdetails-threeController'
            }))
            .when("/progressdetails-four", angularAMD.route({ //进度详情4
                templateUrl: 'views/acceptancebusiness/progressreport/progressdetails-four.html',
                controller: 'Progressdetails-fourCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/progressreport/progressdetails-fourController'
            }))
            .when("/progressdetails-fives", angularAMD.route({ //进度详情5
                templateUrl: 'views/acceptancebusiness/progressreport/progressdetails-fives.html',
                controller: 'Progressdetails-fivesCtrl',
                controllerUrl: '../../controllers/acceptancebusiness/progressreport/progressdetails-fivesController'
            }))
            .when("/markreadunrecoverable", angularAMD.route({ //标记已读后不可恢复提示
                templateUrl: 'views/myguesses/messagerecord/markreadunrecoverable.html',
                controller: 'MarkreadunrecoverableCtrl',
                controllerUrl: '../../controllers/myguesses/messagerecord/markreadunrecoverableController'
            }))
            .when("/markreadcase", angularAMD.route({ //标记已读情况
                templateUrl: 'views/myguesses/messagerecord/markreadcase.html',
                controller: 'MarkreadcaseCtrl',
                controllerUrl: '../../controllers/myguesses/messagerecord/markreadcaseController'
            }))
            .when("/selectcase1", angularAMD.route({ //消息-全选情况
                templateUrl: 'views/myguesses/messagerecord/selectcase1.html',
                controller: 'Selectcase1Ctrl',
                controllerUrl: '../../controllers/myguesses/messagerecord/selectcase1Controller'
            }))
            .when("/declarationsuccess", angularAMD.route({ //消息正文
                templateUrl: 'views/myguesses/messagerecord/declarationsuccess.html',
                controller: 'DeclarationsuccessCtrl',
                controllerUrl: '../../controllers/myguesses/messagerecord/declarationsuccessController'
            }))
            .when("/cancellationapplication", angularAMD.route({ //撤单申请
                templateUrl: 'views/myguesses/messagerecord/cancellationapplication.html',
                controller: 'CancellationapplicationCtrl',
                controllerUrl: '../../controllers/myguesses/messagerecord/cancellationapplicationController'
            }))
            .when("/aborted", angularAMD.route({ //已中止报单
                templateUrl: 'views/myguesses/declarationrecords/aborted.html',
                controller: 'AbortedCtrl',
                controllerUrl: '../../controllers/myguesses/declarationrecords/abortedController'
            }))
            .when("/alldeclarations", angularAMD.route({ //报单记录列表
                templateUrl: 'views/myguesses/declarationrecords/alldeclarations.html',
                controller: 'AlldeclarationsCtrl',
                controllerUrl: '../../controllers/myguesses/declarationrecords/alldeclarationsController'
            }))
            .when("/completeddeclaration", angularAMD.route({ //报单详情
                templateUrl: 'views/myguesses/declarationrecords/completeddeclaration.html',
                controller: 'CompleteddeclarationCtrl',
                controllerUrl: '../../controllers/myguesses/declarationrecords/completeddeclarationController'
            }))
            .when("/nocallandcallthe", angularAMD.route({ //受理中报单
                templateUrl: 'views/myguesses/declarationrecords/nocallandcallthe.html',
                controller: 'NocallandcalltheCtrl',
                controllerUrl: '../../controllers/myguesses/declarationrecords/nocallandcalltheController'
            }))
            .when("/notaccepted", angularAMD.route({ //未受理报单
                templateUrl: 'views/myguesses/declarationrecords/notaccepted.html',
                controller: 'NotacceptedCtrl',
                controllerUrl: '../../controllers/myguesses/declarationrecords/notacceptedController'
            }))
            .when("/bdmap", angularAMD.route({ //百度地图
                templateUrl: 'views/propertyvaluation/accuratevaluation/bdmap.html',
                controller: 'Accuratevaluation-resultsCtrl',
                controllerUrl: '../../controllers/propertyvaluation/accuratevaluation/accuratevaluation-resultsController'
            }))
            .otherwise({
                redirectTo: "/login"
            });

    });

    return angularAMD.bootstrap(app);
});


//根据code获取客户信息
function GetUserInfoByCode(code) {
    var timestamp = Math.random();
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
            }
        }
    });
}


//通过openid获取kehuId
function getUserInfoByOpenId(openid) {
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
            }
        }
    });
}

//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}