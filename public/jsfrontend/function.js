var colorLost = "#2ECC40"; // green
var colorFound = "#FFDC00"; // yellow
var colorBack = "#FFFFFF"; // silver

//container dimensions
var title = $("#h1lost").outerHeight(true)

var usable = $(window).height() - title;
var viewport_form = usable * 90/100;

if (mobile) {
	console.log("mobile")
	//import CSS
	var head  = document.getElementsByTagName('head')[0];
	var link  = document.createElement('link');
	link.rel  = 'stylesheet';
	link.href = '/stylesheets/mobile.css';
	head.appendChild(link);

	//handle the click on "LOST" and "FOUND" labels
	$("#h1lost").click(function () {
		$("#mobile-container").addClass("mobile-opened");

		$("#mobile-lost").addClass("mobilecontainer-opened");
		$("#mobile-found").addClass("mobilecontainer-closed");

		setTimeout(function () {
			$("#mobile-found").removeClass("mobilecontainer-closed");
			$("#mobile-found").removeClass("mobilecontainer-opened");
		},1000)

		document.getElementById("h1found").removeAttribute("style");
		document.getElementById("found").removeAttribute("style");	

		document.getElementById("h1lost").setAttribute("style","color:".concat(colorLost));
		document.getElementById("lost").setAttribute("style","background-color:".concat(colorBack));

	})

	$("#h1found").click(function () {
		$("#mobile-container").addClass("mobile-opened");
		
		$("#mobile-found").addClass("mobilecontainer-opened");
		$("#mobile-lost").addClass("mobilecontainer-closed");
		
		setTimeout(function () {
			$("#mobile-lost").removeClass("mobilecontainer-closed");
			$("#mobile-lost").removeClass("mobilecontainer-opened");
		}, 1000)

		document.getElementById("h1lost").removeAttribute("style");
		document.getElementById("lost").removeAttribute("style");

		document.getElementById("h1found").setAttribute("style","color:".concat(colorFound));
		document.getElementById("found").setAttribute("style","background-color:".concat(colorBack));
	})

} else {
	console.log("desktop")

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
}