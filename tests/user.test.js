const User = require("../models/user");

//valid user
var u1 = new User();
u1.name = 'Fausto Giunchiglia';
u1.email = 'fausto.giunchiglia@unitn.it';
//invalid email
var u2 = new User();
u2.name = 'Fausto Giunchiglia';
u2.email = 'babbuiafuttalleba';
//name not setted
var u3 = new User();
u3.email = 'fausto.giunchiglia@unitn.it';

//tests

test("Inserting a valid user", () => {
	var error = u1.validateSync();
	expect(error).toBe(undefined);
});
test("Inserting a not valid user: wrong email format", () => {
	var error = u2.validateSync();
	expect(error).not.toBe(undefined);
});
test("Inserting a not valid user: name not setted", () => {
	var error = u3.validateSync();
	expect(error).not.toBe(undefined);
});