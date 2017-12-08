/*var user = null;
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
	if(description == '' || description == null) {
		alert("Error, description needed");
		return;
	}
	var toSend = 'token=' + user._id + '&description=' + description;
	if(time != '' && time != null)
		toSend = toSend.concat('&time=' + time);
	if(room != '' && room != null)
		toSend = toSend.concat('&room=' + room);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//reset forms
			document.getElementById('lost-form').reset();
			document.getElementById('found-form').reset();
			var response = JSON.parse(this.responseText);
			if(response.error == false) {	//nessun errore
				var matchingurl = 'issues/' + response.issue + '?token=' + user._id;
				var matchrequest = new XMLHttpRequest();
				matchrequest.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var secondresponse = JSON.parse(this.responseText);
						console.log(secondresponse);
						if(secondresponse.error == 'false') { //nessun errore
							console.log(secondresponse.issues);	//array di issues
						}
						else
							alert(secondresponse.error);
					}
				}
				matchrequest.open('GET', matchingurl, true);
				matchrequest.send();
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
}*/

function emptyForm($form) {
	$form.find('input').each(function(i){
		console.log($(this));
		//$(this).val('').change();
	});
}

//handles server request
function formHandler(ref, api) {
	//binding event trigger
	var $this = $(ref);
	//retrieving form params
	var params = $this.closest('form').serializeArray();
	$.post('/issues/' + api, params)
		.done(function(res){
			if (!res.error) {
				var token = params[0].value;
				//sending all params even if i need only token
				$.get('/issues/' + res.issue, [{name: 'token', value: token}])
					.done(function(res) {
						if(!res.error) {
							//refresh the form
							emptyForm($this);
							//TODO: fill the result table
						}
					});
			}
		});
}
