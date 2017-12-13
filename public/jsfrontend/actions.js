function emptyForm($form) {
	$form.find('input:not([name="token"])').each(function(i){
		console.log($(this));
		$(this).val('');
	});
	//updating text fields using materialize
	//Materialize.updateTextFields();
}

//handles server request
function formHandler(ref, api) {
	//binding event trigger
	var $this = $(ref);
	var $place = null;
	if  (api == 'search')  {
		if (!mobile) {
			$place = $("#response-container-lost");
		} else {
	 		$place = $("#response-container-lost-mobile");
		}
	}
	else {
		if (!mobile) {
	 		$place = $("#response-container-found");
		} else {
	 		$place = $("#response-container-found-mobile");
		}
	}
	//processing message
	$place.html($('<div/>', {
		class: 'col s6 offset-s3 center-align',
		text: 'Processing..'
	}));

	//retrieving form params
	var $form = $this.closest('form');
	var params = $form.serializeArray();
	//checking errors
	var error = '';
	if(params[0].value == '') {	//not logged
		error = '<li class="red white-text collection-header center-align"><div><i class="large material-icons">verified_user</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>Only university\'s accounts are allowed to use our service. Would you mind to log in?</li>';
	}
	if(params[3].value == '') {	//empty description
		error = '<li class="red white-text collection-header center-align"><div><i class="large material-icons">close</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>During the insertion of your issue we noticed that your description field were void. Are you sure that you '+(api=='search'?'lost':'found')+' something?</li>';
	}
	//handling errors
	if(error != '') {
		var $errdiv = $('<div/>', {
			class: 'col s6 offset-s3'
		});
		var $errul = $('<ul/>', {
			class: 'collection with-header',
			html: error
		});
		$errul.appendTo($errdiv);
		$place.html($errdiv);
		return;
	}

	$.post('/issues/' + api, params)
		.done(function(res){
			var $content = $('<div/>');
			if (!res.error) {
				var token = params[0].value;
				//sending all params even if i need only token
				$.get('/issues/' + res.issue, [{name: 'token', value: token}])
					.done(function(res) {
						if(!res.error) {
							//refresh the form
							emptyForm($form);
							if  (api == 'search')  {
								if (res.issues.length == 0) {
									$content.addClass('col s6 offset-s3');
									$content.html('<ul class="collection with-header"><li class="red white-text collection-header center-align"><div><i class="large material-icons">close</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>Actually it seems that nobody found your properties!<br>But don\'t worry, we saved your research, and who finds your properties will be noticed to contact you.</li></ul>');
								} else {
									$content.addClass('col s10 offset-s1');
									$content.html('<h5>Here is what people found, that might be yours</h5>');
									var $cardWrapper = $('<div/>', {
										class: 'col s10 offset-s1'
									});
									for (var i = 0; i < res.issues.length; i++) {
										$('<div/>', {
											class: 'card',
											html: '<div class="card-content"><p>' + res.issues[i].description + '</p></div><div class="row card-action"><div class="col s6">' + res.issues[i].inserted.substring(0, res.issues[i].inserted.indexOf('T')) + '</div><div class="col s6 right-align"><a href="mailto:' + res.issues[i].author.email + '">'+ res.issues[i].author.name + '</a></div></div>'
										}).appendTo($cardWrapper);
									}
									$cardWrapper.appendTo($content);
								}
							}
							else {

								if (res.issues.length == 0) {
									$content.addClass('col s6 offset-s3');
									$content.html('<ul class="collection with-header"><li class="green white-text collection-header center-align"><div><i class="large material-icons">check</i></div></li><li class="collection-item"><h3 class="center-align">Thank you!</h3>Actually it seems that the owner didn\'t noticed the disappearance! We saved your finding and the owner will be able to contact you.</li></ul>');
								} else {
									$content.addClass('col s10 offset-s1');
									for (var i = 0; i < res.issues.length; i++) {
										$('<div/>', {
											class: 'card',
											html: '<div class="card-content"><p>' + res.issues[i].description + '</p></div><div class="row card-action"><div class="col s6">' + res.issues[i].inserted.substring(0, res.issues[i].inserted.indexOf('T')) + '</div><div class="col s6 right-align"><a href="mailto:' + res.issues[i].author.email + '">'+ res.issues[i].author.name + '</a></div></div>'
										}).appendTo($content);
									}
								}
							}
						}
						else {	//error during issue match
							$content.addClass('col s6 offset-s3');
							$content.html('<ul class="collection with-header"><li class="red white-text collection-header center-align"><div><i class="large material-icons">close</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>Somehow we got errors during the matching of your issue!<br>Could you retry?</li></ul>');
						}
						$content.appendTo($place);
					});
			} else {	//error during issue insertion
				$content.addClass('col s6 offset-s3');
				$content.html('<ul class="collection with-header"><li class="red white-text collection-header center-align"><div><i class="large material-icons">close</i></div></li><li class="collection-item"><h3 class="center-align">Oh no!</h3>During the insertion of your issue we got some problems. Try to be as precise as possible with your description and retry.</li></ul>');
			}
			$place.html($content);

		});

}
