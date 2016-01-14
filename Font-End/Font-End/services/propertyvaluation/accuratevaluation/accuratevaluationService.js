/**
 * Created by Administrator on 2016/1/9.
 *  AccuratevaluationService
 *  精准评估 Service
 */
"use strict";
define(['handler'], function(handler) {
    var AccuratevaluationService = angular.module('AccuratevaluationService', []);

    AccuratevaluationService.factory('AccuratevaluationService', function($http, $q, $timeout) {
        var rootUrl = handler.rootUrl;
        //var rootUrl =handler.rootUrl;
        var cityName=window.localStorage.getItem("cityName");//window.localStorage.getItem("cityName");
        var getBuilding = function(from) {
            var params = {
                residentialID: from.residentialID,
                cityName: cityName//cityName
            }
            return $http({
                method: 'GET',
                params: params,
                url: rootUrl + '/webservice/getBuilding'
            });
        };

        var getUnits = function(from) {
            var params = {
                buildingId: from.buildingId,
                cityName: cityName//cityName
            }
            return $http({
                method: 'GET',
                params: params,
                url: rootUrl + '/webservice/getUnits'
            });
        };

        /***
         * 获取门牌号
         * @param from 单元ID
         * @returns {*}
         */
        var getHouse = function(from) {
            var params = {
                unitId: from.unitId,
                cityName: cityName//cityName
            };

            return $http({
                method: 'GET',
                params: params,
                url: rootUrl + "/webservice/getHourses"
            });
        };
        /***
         * 精准估价
         *
         */
        var getPrecisePrice = function(from) {
            var params = {
                residentialId:from.residentialAreaID,// '10000',//from.residentialAreaID, //小区ID  小区名;字符串，UTF8编码，不进行加密
                cityName: from.cityName, //cityName 城市名称 window.localStorage.getItem(cityName)
                keHuId:window.localStorage.getItem('keHuId'),// 客户IDwindow.localStorage.getItem('keHuId'),//
                area: from.area, // 建筑面积
                houseType: from.roomtype, // 户型
                toward: from.toward, //朝向
                floor: from.floor, //楼层
                totalfloor:from.totalfloor,//总楼层
                floorBuilding: from.floorBuilding, //楼栋
                houseNumber: from.houseNumber, // 房号
                cellNumber: from.cellNumber, //单元号
                specialFactors: from.specialFactors&&from.specialFactors!=null?from.specialFactors.value:"",//特殊因素
                buildingyear: from.buildingyear //建成年代
            };
            return $http({
                method: 'GET',
                params: params,
                url: rootUrl + '/webservice/preciseInquiry'
            });
        };

        /***
         * 获取特殊因素
         * @param from
         */
        var getSpecialFactors = function(from) {
            var params = {
                residentialAreaName: from.residentialAreaName,
                cityName: cityName//cityName
            }
            return $http({
                method: 'GET',
                params: params,
                url: rootUrl+"/webservice/getSpecialFactors"
            });
        };

         /***
         * 匹配居室类型
         * @param from
         */
        var getRoomType = function(from) {
            var params = {
                residentialName:from.residentialName,
                cityName:from.cityName,
                area:from.area
            }
            return $http({
                method: 'GET',
                params: params,
                url: rootUrl+"/webservice/UnitShape"
            });
        };


        return {
            //获取楼栋号
            getBuilding: function(from) {
                return getBuilding(from);
            },
            //获取单元
            getUnits: function(from) {
                return getUnits(from);
            },
            //获取门牌号
            getHouse: function(from) {
                return getHouse(from);
            },
            getSpecialFactors: function(from) {
                return getSpecialFactors(from);
            },
            getPrecisePrice: function(from) {
                return getPrecisePrice(from);
            },
            getRoomType:function(from){
                return getRoomType(from);
            }
        }
    });


})