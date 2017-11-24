<<<<<<< HEAD
=======
var express = require('express');
var Issue = require('../models/issue.js');

/*
	tag: the tag object which we are looking for inside all issues
	issue: the issue we are examining with an attribute added: score
*/
function searchInIssue(tag, issue) {
	//DEBUG
	console.log(tag);
	console.log(issue);
	console.log(issue.content.tags);

	//initializing binary search
	var min = 0;
	var max = issue.content.tags.length -1;
	var found = false;

	/*
	//DEBUG
	console.log(Math.round(10.3));
	console.log(Math.round(10.6));
	*/

	//binary search
	while(!found || (min <= max)) {
		//MOTIVO ERRORE
		//parseInt(10.3) = Math.round(10.3) = 10
		//parseInt(10.6) = 10
		//Math.round(10.6) = 11
		var i = Math.round((max + min) / 2);
		console.log(i); //DEBUG

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

		//DEBUG
		console.log("diff = " + diff);
		console.log("i = " + i);
		console.log("max = " + max);
		console.log("min = " + min);
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
function match(issue, allIssues, k) {
	var issueWithCounter = [];

	for(var i = 0; i < allIssues.length; i++) {
		console.log("Loop #" + i);
		var obj = {
			content: allIssues[i],
			score: 0.0
		};
		issueWithCounter.push(obj);
	}

	//console.log(issueWithCounter); return;

	console.log("Issues with counter created");
	for(var i = 0; i < issue.tags.length; i++) {
		for(var j = 0; j < issueWithCounter.length; j++) {
			console.log("[" + i + ", " + j + "]");
			searchInIssue(issue.tags[i], issueWithCounter[j]);
		}
	}

	console.log("Comparison finished");
	issueWithCounter.sort(compareFunction);
	return issueWithCounter.slice(0,k);
}
exports.match = match;
