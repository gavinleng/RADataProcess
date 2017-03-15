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
	var outPathD = './radistData.json';
	var jsonkeys = '{"data":[\n';
	fs.writeFileSync(outPathD, jsonkeys);
	
	//get RA age mapping data
	var urlMapping = 'https://q.nqminds.com/v1/datasets/S1xUuAfxa/data?opts={"limit":16681440}';
	var raMapping = urlDataGet(urlMapping).data;
	
	var lenraMapping = raMapping.length;
	
	var i, dLine, urlraVpp, dArray, dObjGroups, ddArray;
	
	for (i= 0; i <lenraMapping; i++) {
		console.log(i+1);
		
		dLine = +raMapping[i].Line;
		console.log(dLine);
		urlraVpp = 'https://q.nqminds.com/v1/datasets/SJeZZa2zT/data?opts={"limit":16681440}&filter={"Line":' + dLine + '}';
		dArray = urlDataGet(urlraVpp).data;
		
		if (dArray.length == 0) continue;
		
		ddArray = [];
		
		//get smooth data
		var groupClass = "All";
		var dObj = distData(dArray, groupClass);
		ddArray.push(dObj);
		
		dObjGroups = distGroup(dArray);
		if (dObjGroups.length > 0) ddArray.push.apply(ddArray, dObjGroups);
		
		if (i < lenraMapping - 1) {
			ddArray = JSON.stringify(ddArray).slice(1, -1);
			ddArray = ddArray + ',\n';
			
			fs.appendFileSync(outPathD, ddArray);
			
			ddArray = [];
		} else {
			ddArray = JSON.stringify(ddArray).slice(1, -1);
			ddArray = ddArray + '\n]}\n';
			
			fs.appendFileSync(outPathD, ddArray);
			
			ddArray = [];
		}
	}
	
	return 1;
};
