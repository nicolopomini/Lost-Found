function emptyForm($form) {
	$form.find('input').each(function(i){
		console.log($(this));
		$(this).val('')
	});
}

//handles server request
function formHandler(ref, api) {
	//binding event trigger
	var $this = $(ref);
	//retrieving form params
	var params = $this.closest('form').serializeArray();
	if(params[0].value == '') {	//not logged
		alert("Please sign in with an university account");
		return;
	}
	if(params[3].value == '') {	//empty description
		alert("Your issue cannot be empty");
		return;
	}

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
							console.log(res.issues)
							var place = ""

							if  (api == 'search')  {
								place = $("#response-container-lost")
								if (res.issues.length == 0) {
									var inner ='<div class="col s6 offset-s3"><ul class="collection with-header"><li class="red white-text collection-header center-align"><div><i class="large material-icons">close</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3> Actually it seems that nobody found your properties!<br>But don\'t worry, we saved your research, and who finds your properties will be noticed to contact you.</li></ul></div>'
								} else {
									var inner = '<div class="col s10 offset-s1 center-align"><h5>Here is what people found, that might be yours</h5></div><br><br>'
									inner += '<div class="col s10 offset-s1">'
									for (var i = 0; i < res.issues.length; i++) {
										inner+='<div class="card"><div class="card-content"><p>' + res.issues[i].description + '</p></div><div class="card-action right-align">'+ res.issues[i].author.name + '  ('+ res.issues[i].author.email + ')</div></div>'
									}
									inner += '</div>'
								}
							}
							else {
							 	place = $("#response-container-found")
								if (res.issues.length == 0) {
									console.log(place)
									var inner = '<div class="col s6 offset-s3"><ul class="collection with-header"><li class="green white-text collection-header center-align"><div><i class="large material-icons">check</i></div></li><li class="collection-item"><h3 class="center-align">Thank you!</h3> Actually it seems that the owner didn\'t noticed the disappearance! We saved your finding and the owner will be able to contact you.</li></ul></div>'
								} else {
									var inner = '<div class="col s10 offset-s1">'
									for (var i = 0; i < res.issues.length; i++) {
										inner+='<div class="card"><div class="card-content"><p>' + res.issues[i].description + '</p></div><div class="card-action right-align">'+ res.issues[i].author.name + '  ('+ res.issues[i].author.email + ')</div></div>'
									}
									inner += '</div>'
								}
							}

							place.html(inner);
						}
						else {	//error during issue match
							alert(res.error);
						}
					});
			} else {	//error during issue insertion
				alert(res.error);
			}
		});
}