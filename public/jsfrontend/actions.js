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
							//TODO: fill the result table
							console.log(res.issues);
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
