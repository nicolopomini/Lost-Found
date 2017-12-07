var colorLost = "#2ECC40"; // green
var colorFound = "#FFDC00"; // yellow
var colorBack = "#FFFFFF"; // silver

//container dimensions
var title = $("#h1lost").outerHeight(true)
// value is already init as window height.
var usable = value - title;
var viewport_form = usable * 80/100;

//handle the click on "LOST" and "FOUND" labels
$("#h1lost").click(function () {
	document.getElementById("form-found").setAttribute("style","transition: all 0.5s;transition-delay:0s;");
	document.getElementById("form-lost").setAttribute("style","height:".concat(viewport_form,"px;"));

	document.getElementById("h1found").removeAttribute("style");
	document.getElementById("h1lost").setAttribute("style","color:".concat(colorLost));

	document.getElementById("lost").removeAttribute("style");
	document.getElementById("lost").setAttribute("style","background-color:".concat(colorBack,";width:65.8%"));

	document.getElementById("found").removeAttribute("style");	
	document.getElementById("found").setAttribute("style","width:33.8%");
})

$("#h1found").click(function () {
	document.getElementById("form-lost").setAttribute("style","transition: all 0.5s;transition-delay:0s;");
	document.getElementById("form-found").setAttribute("style","height:".concat(viewport_form,"px;"));

	document.getElementById("h1lost").removeAttribute("style");
	document.getElementById("h1found").setAttribute("style","color:".concat(colorFound));

	document.getElementById("found").removeAttribute("style");
	document.getElementById("found").setAttribute("style","background-color:".concat(colorBack,";width:65.8%"));

	document.getElementById("lost").removeAttribute("style");
	document.getElementById("lost").setAttribute("style","width:33.8%");
})
