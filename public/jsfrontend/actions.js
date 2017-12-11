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

	if  (api == 'search')  {
		place = $("#response-container-lost");
	}
	else {
	 	place = $("#response-container-found");
	}

	var inner ='<div class="col s6 offset-s3 center-align">Processing..</div>';
	place.html(inner);

	//retrieving form params
	var params = $this.closest('form').serializeArray();
	if(params[0].value == '') {	//not logged
		var inner ='<div class="col s6 offset-s3"><ul class="collection with-header"><li class="red white-text collection-header center-align"><div><i class="large material-icons">verified_user</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>Only university\'s accounts are allowed to use our service. Would you mind to log in?</li></ul></div>';
			place.html(inner);
		return;
	}
	if(params[3].value == '') {	//empty description
		var inner ='<div class="col s6 offset-s3"><ul class="collection with-header"><li class="red white-text collection-header center-align"><div><i class="large material-icons">close</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>During the insertion of your issue we noticed that your description field were void. Are you sure that you '+(api=='search'?'lost':'found')+' something?</li></ul></div>';
			place.html(inner);
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

							if  (api == 'search')  {	
								if (res.issues.length == 0) {
									var inner ='<div class="col s6 offset-s3"><ul class="collection with-header"><li class="red white-text collection-header center-align"><div><i class="large material-icons">close</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>Actually it seems that nobody found your properties!<br>But don\'t worry, we saved your research, and who finds your properties will be noticed to contact you.</li></ul></div>';
									place.html(inner);
								} else {
									var inner = '<div class="col s10 offset-s1 center-align"><h5>Here is what people found, that might be yours</h5></div><br><br>';
									inner += '<div class="col s10 offset-s1">';
									for (var i = 0; i < res.issues.length; i++) {
										inner+='<div class="card"><div class="card-content"><p>' + res.issues[i].description + '</p></div><div class="row card-action"><div class="col s6">' + res.issues[i].inserted.substring(0, res.issues[i].inserted.indexOf('T')) + '</div><div class="col s6 right-align"><a href="mailto:' + res.issues[i].author.email + '">'+ res.issues[i].author.name + '</a></div></div></div>';
									}
									inner += '</div>';
									place.html(inner);
								}
							}
							else {
							 	
								if (res.issues.length == 0) {
									var inner = '<div class="col s6 offset-s3"><ul class="collection with-header"><li class="green white-text collection-header center-align"><div><i class="large material-icons">check</i></div></li><li class="collection-item"><h3 class="center-align">Thank you!</h3>Actually it seems that the owner didn\'t noticed the disappearance! We saved your finding and the owner will be able to contact you.</li></ul></div>';
									place.html(inner);
								} else {
									var inner = '<div class="col s10 offset-s1">';
									for (var i = 0; i < res.issues.length; i++) {
										inner+='<div class="card"><div class="card-content"><p>' + res.issues[i].description + '</p></div><div class="row card-action"><div class="col s6">' + res.issues[i].inserted.substring(0, res.issues[i].inserted.indexOf('T')) + '</div><div class="col s6 right-align"><a href="mailto:' + res.issues[i].author.email + '">'+ res.issues[i].author.name + '</a></div></div></div>';
									}
									inner += '</div>';
									place.html(inner);
								}
							}
						}
						else {	//error during issue match
							var inner ='<div class="col s6 offset-s3"><ul class="collection with-header"><li class="red white-text collection-header center-align"><div><i class="large material-icons">close</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>Somehow we got errors during the matching of your issue!<br>Could you retry?</li></ul></div>';
							place.html(inner);
						}
					});
			} else {	//error during issue insertion
				var inner ='<div class="col s6 offset-s3"><ul class="collection with-header"><li class="red white-text collection-header center-align"><div><i class="large material-icons">close</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>During the insertion of your issue we got some problems. Check that all fields are correctly filled up and retry.</li></ul></div>';
				place.html(inner);
			}
			
		});
	
}