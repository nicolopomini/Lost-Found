var express = require('express');
var Issue = require('../models/issue.js');

/*
	tag: the tag object which we are looking for inside all issues
	issue: the issue we are examining with an attribute added: score
*/
function searchInIssue(tag, issue) {
	var min = 0;
	var max = issue.content.tags.length;
	var found = false;
	//binary search
	while(!found) {
		var i = (max - min) / 2;
		var current = issue.content.tags[i].parsed;
		var diff = tag.parsed.localeCompare(current);
		if(diff == 0)
			found = true;
		else if(diff > 0) 
			min = i;
		else
			max = i;
	}
	if(found) {
		issue.score += 1.0;
		var dist = Math.abs(tag.relevance - issue.content.tags[i].relevance);
		if(dist == 0)
			issue.score *= 1000;
		else
			issue.score *= (1.0/dist);
	}
}

//function to compare the final score of two issues
function compareFunction(a, b) {
	return a.score - b.score;
}
/*
	issue: the brand new issue just insered
	allIssues: all other issues stored in the db, with correct type and time
	k: numer of issues to return
*/
function matching(issue, allIssues, k) {
	var issuewithcounter = [];
	for(var i = 0; i < allIssues.length; i++) {
		var obj = {
			content: allIssues[i],
			score: 0.0
		};
		issuewithcounter.push(obj);
	}
	for(var i = 0; i < issue.tags.length; i++) {	
		for(var j = 0; j < issuewithcounter.length; j++) {
			searchInIssue(issue.tags[i], issuewithcounter[j]);
		}
	}
	issuewithcounter.sort(compareFunction);
	return issuewithcounter.slice(0,k);
}
express.export = matching;