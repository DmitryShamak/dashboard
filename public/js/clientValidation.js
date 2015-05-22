var errorList = false;

var addToErrorList = function(error) {
	if(!errorList) errorList = {};

	errorList[error.target] = error.message;
};

var isValid = function(key, value) {
	var res = { error: false };
	switch(key) {
		case "name":
			if(!(/^[a-z0-9]*[a-z0-9]$/.test(value))) {
				res = {
					error: {
						target: key,
						message: "Bad name."
					}
				}
			}
			break;
		case "email":
			if(!(/[a-z]*(@)[a-z]*(.)[a-z][a-z]/.test(value))) {
				res = {
					error: {
						target: key,
						message: "Bad email."
					}
				}
			}
			break;
		case "password":
			if(value == "" || !(/[a-z0-9]*/.test(value))) {
				res = {
					error: {
						target: key,
						message: "Password email."
					}
				}
			}
			break;
	}

	return res;
};

var showErrors = function(list) {
	for(var key in list) {
		$('form [name*='+key+']').addClass("error");
	}
};

var clearErrors = function() {
	$("form").find(".error").removeClass("error");
};

var isPassedValidation = function(context) {
	for(var key in context.elements) {
		var elem = context[key];
		if(elem) {
			var res = isValid(elem.name, elem.value);

			if(res.error) {
				addToErrorList(res.error);
			}
		}
	}
	return !errorList;
}

var addValidation = function() {
	$("form").on("submit", function(e) {
		errorList = false;
		clearErrors();
		if(!isPassedValidation($(this).context)) {
			e.preventDefault ? e.preventDefault() : e.returnValue=false;
			showErrors(errorList);
		}
	});
};

var getCollection = function() {
	var collection = "Default";
	var template = window.location.pathname.replace(/[a-z]\/[a-z]*/, "");
	template = template.replace(/^\//, "");
	  
	switch(template) {
		case "user_board":
			collection = "Project";
			break;
		case "user_dashboard":
			collection = "Project";
			break;
		case "user_edit_project":
			collection = "Project";
			break;
		case "user_ticket":
			collection = "Ticket";
			break;
	}
};

var setHistoryLog = function() { //collection, project, user, action
	var data = {
		collection: "",
		project: "",
		user: "",
		action: ""
	};
	/*$.post("/sethistory", data, function(res) {
		console.log(res);
	})*/
};

$(document).ready(addValidation);