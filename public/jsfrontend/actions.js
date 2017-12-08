var user = null;
//id, displayName, email
document.getElementById('loginbtn').setAttribute('href', 'auth/login');;
var sessionrequest = new XMLHttpRequest();
sessionrequest.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var content = JSON.parse(this.responseText);
		var logged = content != 'false'; //|| altra condizione
		if(logged)
			user = content;
		else
			user = null;
		document.getElementById('loginbtn').setAttribute('href', logged ? 'auth/logout' : 'auth/login');
		
	}
};
sessionrequest.open('POST','session',false);
sessionrequest.send();

function formHandler(type) {
	console.log(type);
	if(user == null)
	{
		alert("You must be signed in.");
		return;
	}
	var description = null;
	var time = null;
	var room = null;
	if(type == 'lost') {
		description = document.getElementById('lost-description').value;
		time = document.getElementById('lost-time').value;
		room = document.getElementById('lost-room').value;
	}
	else if(type == 'found') {
		description = document.getElementById('found-description').value;
		time = document.getElementById('found-time').value;
		room = document.getElementById('found-room').value;
	} else {
		alert("Error");
		return;
	}
	var toSend = {};
	if(description == '' || description == null) {
		alert("Error, description needed");
		return;
	}
	if(time != '' && time != null)
		toSend.time = time;
	if(room != '' && room != null)
		toSend.room = room;
	toSend.description = description;
	toSend.token = user._id;
	console.log(toSend);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//reset forms
			document.getElementById('lost-form').reset();
			document.getElementById('found-form').reset();
			var response = JSON.parse(this.responseText);
			if(response.error == false) {	//nessun errore
				var url = 'issues/'.concat(response.issue); //issueid
				var matchrequest = new XMLHttpRequest();
				matchrequest.onreadystatechange = function() {
					//Gestire i dati di ritorno
					alert(JSON.stringify(this.responseText));
				};
				matchrequest.open('GET', url, true);
				matchrequest.send('token=' + user._id);
			} else
				alert(response.error);
		}
	};
	var url = 'issues/';
	if(type == 'lost')
		url = url.concat('search');
	else
		url = url.concat('found');
	request.open('POST', url, true);
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify(toSend));
}