/*
 *委托报单
 *delegatedeclarationServices
 */
"use strict";
define(['handler'], function(handler) {
    var delegatedeclarationServices = angular.module('delegatedeclarationServices', []);
    delegatedeclarationServices.factory('delegatedeclarationServices',
        function($http, $q, $timeout) {
            var rootUrl = handler.rootUrl;
            /*
             *委托报单提交
             *param{}
             */
            var entrustsubmit = function(from) {
                //noinspection JSDuplicatedDeclaration
                var params = {
                    keHuId: from.keHuId,//客户id
                    city: from.city, //城市名称(必填)
                    estimateCompany: from.estimateCompany, //评估公司(必填)
                    community: from.community, //小区名称
                    region: from.region, //行政区
                    street: from.street, //小区街道地址
                    building: from.building, //小区楼栋号
                    unit: from.unit, //小区单元号
                    houseNum: from.houseNum, //小区户号
                    area: from.area, //面积
                    official: from.official, //是否为正式报告
                    email: from.email, //邮箱地址
                    purpose: from.purpose, //评估目的
                    papers: from.papers, //是否需要纸质报告
                    receiver: from.receiver, //收件人姓名
                    receiveAddress: from.receiveAddress, //报告邮寄地址（收件人地址）
                    receiverPhone: from.receiverPhone, //收件人电话
                    expectPrice: from.expectPrice, //期望价格
                    contact: from.contact, //看房联系人(必填)
                    contactPhone: from.contactPhone, //看房联系人电话(必填)
                    client: from.client, //委托人姓名(必填)
                    clientPhone: from.clientPhone, //委托人电话(必填)
                    emergent: from.emergent, //是否加急
                    note: from.note, //备注信息
                    rooms: from.rooms, //居室类型
                    floor: from.floor, //所在楼层
                    totalfloor: from.totalfloor, //总楼层
                    toward: from.toward, //房屋朝向
                    buildedYear: from.buildedYear, //建成年代
                    presentStatus: from.presentStatus, //使用现状
                    physicalChange: from.physicalChange, //物理结构是否发生变化
                    property: from.property, //产权性质
                    cost: from.cost, //评估费用
                    platformID: from.platformID, //贷款银行
                    appointmentTime: from.appointmentTime, //预约看房时间
                    collectionMethod: from.collectionMethod, //资料收取方式
                    houseType: from.houseType, //物业类型｛住宅、别墅}
                }
                return $http({
                    method: 'post',
                    params: params,
                    url: rootUrl + '/webservice/addcommissionedEvaluation'
                });
            };
            /*
             *获取所在城市的评估公司
             *param{}
             */
            var getcompany = function(from) {
                var params = {
                    cityName: from.cityName
                }
                return $http({
                    method: 'get',
                    params: params,
                    url: rootUrl + '/webservice/getEstimateCompanyByCityName'
                });
            };
            /*
             *获取用户基本信息
             *param{}
             */
            var userInfo = function(from) {
                var params = {
                    keHuId:from.keHuId
                }
                return $http({
                    method: 'get',
                    params: params,
                    url: rootUrl + '/webservice/getUserInfo'
                });
            };
            /*
             *获取城市列表
             *param{}
             */
            var getCities = function(from) {

                var params = {}
                return $http({
                    method: 'get',
                    params: params,
                    url: rootUrl + '/webservice/getCitySystem'
                });
            };
            /*
             *获取城市行政区
             *param{}
             */
            var getcityarea = function(from) {

                var params = {
                    parentid: from.parentid
                }
                return $http({
                    method: 'get',
                    params: params,
                    url: rootUrl + '/webservice/getCitySystem'
                });
            };
            return {
                getcompany:function(from) {
                    return getcompany(from);
                },
                userInfo:function(from) {
                    return userInfo(from);
                },
                entrustsubmit: function(from) {
                    return entrustsubmit(from);
                },
                getCities: function(from) {
                    return getCities(from);
                },
                getcityarea: function(from) {
                    return getcityarea(from);
                }
            }
        })
})
