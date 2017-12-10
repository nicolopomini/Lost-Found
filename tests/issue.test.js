//const mongoose = require('mongoose');
const Issue = require('../models/issue');
const User = require('../models/user');

var u = new User();
u.name = 'Fausto Giunchiglia';
u.email = 'fausto.giunchiglia@unitn.it';
//valid tag
var tag1 = {
	original: "Prova",
	parsed: "prova",
	relevance: 0.34
};
//invalid tag: .original too short
var tag2 = {
	original: "",
	parsed: "",
	relevance: 0.34
};
//invalid tag: .relevance too big
var tag3 = {
	original: "Prova",
	parsed: "prova",
	relevance: 1.4
};
//valid issue
var issue1 = new Issue();
issue1.description = "Issue di prova";
issue1.type = "found";
issue1.tags = [tag1];
issue1.author = u;
//invalid issue: tag2 not valid
var issue2 = new Issue();
issue2.description = "Issue di prova";
issue2.type = "found";
issue2.tags = [tag1, tag2];
issue2.author = u;
//invalid issue: .type not valid
var issue3 = new Issue();
issue3.description = "Issue di prova";
issue3.type = "prova";
issue3.tags = [tag1];
issue3.author = u;
//invalid issue: .description is missing
var issue4 = new Issue();
issue4.type = "found";
issue4.tags = [tag1];
issue4.author = u;
//invalid issue: author is missing
var issue5 = new Issue();
issue5.description = "Issue di prova";
issue5.type = "found";
issue5.tags = [tag1];

//tests
test("Inserting a valid issue", () => {
	var error = issue1.validateSync();
	expect(error).toBe(undefined);
});
test("Inserting an invalid issue: invalid tag", () => {
	var error = issue2.validateSync();
	expect(error).not.toBe(undefined);
});
test("Inserting an invalid issue: invalid type", () => {
	var error = issue3.validateSync();
	expect(error).not.toBe(undefined);
});
test("Inserting an invalid issue: invalid description", () => {
	var error = issue4.validateSync();
	expect(error).not.toBe(undefined);
});
test("Inserting an invalid issue: author is missing", () => {
	var error = issue5.validateSync();
	expect(error).not.toBe(undefined);
});
