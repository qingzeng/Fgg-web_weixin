/*
 *真伪查询
 *authenticitycheckServices
 */
"use strict";
define(['handler'], function(handler) {
    var authenticitycheckServices = angular.module('authenticitycheckServices', []);

    authenticitycheckServices.factory('authenticitycheckServices',
        function($http, $q, $timeout) {
            var rootUrl = handler.rootUrl;
            /*
             *真伪查询提交
             *param{id 报告编号,token  用户登录凭证,city 城市名称,client 委托人}
             */
            var check = function(from) {
                var params = {
                    id:form.reportNum,
                    token: from.token,
                    city: from.city,
                    client: from.client
                };
                return $http({
                    method: 'post',
                    params: params,
                    url: rootUrl + '/webservice/checkcommissionedEvaluation'
                });
            };

            //获取评估公司信息
            var getCityInfo = function (form) {
                var params = {
                    keHuId: form.keHuId
                };
                return $http({
                    method: 'get',
                    url: rootUrl + '/webservice/getAllEstimateCompany'
                });
            };

            //真伪查询
            var selectReport = function (from) {
                var params =
                    {
                        reportNum: from.reportNum,
                        client: from.client
                    };
                return $http({
                    method: 'get',
                    params: params,
                    url: rootUrl + '/webservice/checkcommissionedEvaluation'
                });
            };

            return {
                check: function(from) {
                    return check(from);
                },
                getCityInfo: function (from)
                {
                    return getCityInfo(from);
                },
                selectReport: function (from)
                {
                    return selectReport(from);
                },
            }
        })
})