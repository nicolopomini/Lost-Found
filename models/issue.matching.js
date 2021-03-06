var express = require('express');
const Issue = require('../models/issue.js');

/*
	tag: the tag object which we are looking for inside all issues
	issue: the issue we are examining with an attribute added: score
*/
function searchInIssue(tag, issue) {
	//initializing binary search
	var min = 0;
	var max = issue.content.tags.length -1;
	var found = false;

	//binary search
	while(!found && (min <= max)) {
		var i = parseInt((max + min) / 2);
		var current = issue.content.tags[i].parsed;
		var diff = tag.parsed.localeCompare(current);
		if(diff == 0) {
			found = true;
			var score = 1.0;
			var dist = Math.abs(tag.relevance - issue.content.tags[i].relevance);
			if(dist == 0)
				score *= 200;
			else
				score *= (1.0/dist);
			issue.score += score;
		}
		else if(diff > 0)
			min = i + 1;
		else
			max = i - 1;
	}
}
exports.searchInIssue = searchInIssue;

//function to compare the final score of two issues
function compareFunction(a, b) {
	return a.score - b.score;
}
exports.compareFunction = compareFunction;

/*
	issue: the brand new issue just insered
	allIssues: all other issues stored in the db, with correct type and time
	k: number of issues to return
*/
function match(issue, allIssues) {
	//oggetti passati per riferimento
	if(allIssues.length == 0)
		return [];

	//add the field 'score' to each issue
	var issueWithCounter = [];
	for(var i = 0; i < allIssues.length; i++) {
		var obj = {
			content: allIssues[i],
			score: 0.0
		};
		issueWithCounter.push(obj);
	}
	//foreach tag, look for every issue that has that tag
	for(var i = 0; i < issue.tags.length; i++) {
		for(var j = 0; j < issueWithCounter.length; j++) {
			searchInIssue(issue.tags[i], issueWithCounter[j]);
		}
	}
	//computing avg
	var total = 0;
	var count = 0;
	var avg = -1;
	for(var i = 0; i < issueWithCounter.length; i++) {
		if(issueWithCounter[i].score > 0) {
			count++;
			total += issueWithCounter[i].score;
		}
	}
	if(count > 0)
		avg = total / count;
	
	var toReturn = [];
	if(avg >= 0) {
		issueWithCounter.sort(compareFunction);
		for(var i = issueWithCounter.length - 1; i >= 0; i--) {
			if(issueWithCounter[i].score > 0 && issueWithCounter[i].score >= avg) 
				toReturn.push(issueWithCounter[i].content);
		}
	}
	return toReturn;
}
exports.match = match;
