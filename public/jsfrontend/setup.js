//this is the setup script, it contains all the code which must be executed while loading the page

//set the height of the page as the full viewport
var value = $(window).height();
var height = "height:";
height = height.concat(value,"px");

document.getElementById("lost").setAttribute("style",height);
document.getElementById("line").setAttribute("style",height);
document.getElementById("found").setAttribute("style",height);

//center the &
var pos = 50 - $("#line").width()/2
document.getElementById("and").setAttribute("style","left:".concat(-pos,"px"));

//enable many materializecss function
$(document).ready(function() {
	$('select').material_select();
});

//enable the datepicker
$('.datepicker').pickadate({
	selectMonths: true, // Creates a dropdown to control month
	selectYears: 15, // Creates a dropdown of 15 years to control year,
	today: 'Today',
	clear: 'Clear',
	close: 'Ok',
	closeOnSelect: false // Close upon selecting a date,
});

//textarea
$('#textarea1').val('New Text');
$('#textarea1').trigger('autoresize');