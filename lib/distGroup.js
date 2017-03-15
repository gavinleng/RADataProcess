/*
 * Created by G on 22/09/2016.
 */


"use strict";

var _ = require("lodash");
var distData = require('./distData');

//get config file
var cfg = require('./groupConfig');

module.exports = exports = function (objArray) {
	var i, j, _lenV, _gData, _gd, groupClass, dObj;
	var group = cfg.group;
	var lengroup = group.length;
	var allG = [];
	
	for (i = 0; i < lengroup; i++) {
		_lenV = group[i].value.length;
		
		_gData = [];
		for (j = 0; j < _lenV; j++) {
			_gd = _.filter(objArray, function (obj) {
				return obj.ONSCD.slice(0, 3) == group[i].value[j];
			});
			
			if (_gd.length == 0) continue;
			
			_gData.push.apply(_gData, _gd);
		}
		
		if (_gData.length == 0) continue;
		
		groupClass = group[i].groupClass;
		dObj = distData(_gData, groupClass);
		
		allG.push(dObj);
	}
	
	return allG;
};
