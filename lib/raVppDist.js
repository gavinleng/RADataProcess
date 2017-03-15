/*
 * Created by G on 22/09/2016.
 */


"use strict";

var fs = require("fs");
var _ = require("lodash");
var urlDataGet = require('./urlDataGet');
var distData = require('./distData');
var distGroup = require('./distGroup');

module.exports = exports = function () {
	var period = "2015-16";
	
	var outPathV = './ravppData.json';
	var jsonkeys = '{"data":[\n';
	fs.writeFileSync(outPathV, jsonkeys);
	
	var outPathD = './radistData.json';
	fs.writeFileSync(outPathD, jsonkeys);
	
	//get RA data
	var urlRA = 'https://q.nqminds.com/v1/datasets/BJxk1dre2/data?opts={"limit":16681440}&filter={"Period":"' + period + '"}';
	var raData = urlDataGet(urlRA).data;
	
	//get RA age mapping data
	var urlMapping = 'https://q.nqminds.com/v1/datasets/S1xUuAfxa/data?opts={"limit":16681440}';
	var raMapping = urlDataGet(urlMapping).data;
	
	//get MYE2 data
	var urlMYE = 'https://q.nqminds.com/v1/datasets/rJlzxz6A2/data?opts={"limit":16681440}';
	var myeData = urlDataGet(urlMYE).data;
	
	var lenraMapping = raMapping.length;
	
	var i, j, k, _raData, _raDataLen, dArray, _raDatad, _myeData, _myeDatad, _myeDatadLen, tValue, dObj, dObjGroups, ddArray, groupClass;
	
	//console.log(raMapping[16].Line);
	for (i= 0; i <lenraMapping; i++) {
		console.log(i+1);
		
		_raData = _.filter(raData, function (obj) {
			return +obj.Line == +raMapping[i].Line;
		});
		
		_myeData = _.filter(myeData, function (obj) {
			if (raMapping[i].MaxAge != '90+') {
				return ((+obj.age_band >= +raMapping[i].MinAge) && (+obj.age_band <= +raMapping[i].MaxAge));
			} else {
				return (((+obj.age_band >= +raMapping[i].MinAge) && (+obj.age_band <= 89)) || (obj.age_band == raMapping[i].MaxAge));
			}
		});
		
		_raDataLen = _raData.length;
		dArray = [];
		dObjGroups = [];
		
		ddArray = [];
		
		for (j = 0; j < _raDataLen; j++) {
			_raDatad = _raData[j];
			
			_myeDatad = _.filter(_myeData, function (obj) {
				return obj.area_id == _raDatad.ONSCD;
			});
			
			_myeDatadLen = _myeDatad.length;
			tValue = 0;
			for (k = 0; k < _myeDatadLen; k++) {
				tValue += _myeDatad[k].persons;
			}
			
			_raDatad.value = _raDatad.value * 1000;
			
			_raDatad.value_pp = +(+_raDatad.value / tValue).toFixed(2);
			
			dArray.push(_raDatad);
		}
		
		if (dArray.length == 0) continue;
		
		//get smooth data
		groupClass = "All";
		dObj = distData(dArray, groupClass);
		ddArray.push(dObj);
		
		dObjGroups = distGroup(dArray);
		if (dObjGroups.length > 0) ddArray.push.apply(ddArray, dObjGroups);
		
		if (i < lenraMapping - 1) {
			dArray = JSON.stringify(dArray).slice(1, -1);
			dArray = dArray + ',\n';
			 
			fs.appendFileSync(outPathV, dArray);
			
			ddArray = JSON.stringify(ddArray).slice(1, -1);
			ddArray = ddArray + ',\n';
			
			fs.appendFileSync(outPathD, ddArray);
			
			dArray = [];
			dObjGroups = [];
			
			ddArray = [];
		} else {
			dArray = JSON.stringify(dArray).slice(1, -1);
			dArray = dArray + '\n]}\n';
			
			fs.appendFileSync(outPathV, dArray);
			
			ddArray = JSON.stringify(ddArray).slice(1, -1);
			ddArray = ddArray + '\n]}\n';
			
			fs.appendFileSync(outPathD, ddArray);
			
			dArray = [];
			dObjGroups = [];
			
			ddArray = [];
		}
	}
	
	return 1;
};
