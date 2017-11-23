var express = require('express');
var Issue = require('../models/issue.js');

/*
	tag: the tag object which we are looking for inside all issues
	issue: the issue we are examining with an attribute added: score
*/
function searchInIssue(tag, issue) {
	console.log(tag);
	console.log(issue);
	console.log(issue.content.tags);
	var min = 0;
	var max = issue.content.tags.length -1;
	var found = false;
	//binary search
	while(!found || (min <= max)) {
		var i = parseInt((max + min) / 2);
		console.log(i);
		var current = issue.content.tags[i].parsed;
		var diff = tag.parsed.localeCompare(current);
		if(diff == 0) {
			found = true;
			issue.score += 1.0;
			var dist = Math.abs(tag.relevance - issue.content.tags[i].relevance);
			if(dist == 0)
				issue.score *= 1000;
			else
				issue.score *= (1.0/dist);
		}
		else if(diff > 0) 
			min = i + 1;
		else
			max = i - 1;
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
	console.log("Entering function");
	for(var i = 0; i < allIssues.length; i++) {
		console.log("Into the first loop");
		var obj = {
			content: allIssues[i],
			score: 0.0
		};
		issuewithcounter.push(obj);
	}
	console.log("Issues with counter created");
	for(var i = 0; i < issue.tags.length; i++) {	
		for(var j = 0; j < issuewithcounter.length; j++) {
			searchInIssue(issue.tags[i], issuewithcounter[j]);
		}
	}
	console.log("Comparison finished");
	issuewithcounter.sort(compareFunction);
	return issuewithcounter.slice(0,k);
}
express.exports = matching;
module.exports = matching;