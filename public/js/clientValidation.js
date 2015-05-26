var errorList = false;

var addToErrorList = function(error) {
	if(!errorList) errorList = {};

	errorList[error.target] = error.message;
};

var isValid = function(elem, value) {
	var res = { error: false };
	switch(elem.name) {
		case "name":
			if(!(/^[a-zA-Z0-9]*\s*\S*$/.test(value)) || value == "") {
				res = {
					error: {
						target: elem.name,
						message: "Bad name."
					}
				}
			}
			break;
		case "email":
			if(!(/[a-z]*@[a-z]*(.)[a-z]*$/.test(value)) || value == "") {
				res = {
					error: {
						target: elem.name,
						message: "Bad email."
					}
				}
			}
			break;
		case "password":
			if(value == "" || !(/[a-z0-9]*/.test(value))) {
				res = {
					error: {
						target: elem.name,
						message: "Bad Password."
					}
				}
			}
			break;
	}

	if(elem.getAttribute('require') != null && (/^ | $/.test(value) || value == "")) {
		res = {
			error: {
				target: elem.name,
				message: "empty field."
			}
		};
	}

	return res;
};

var showErrors = function(list) {
	for(var key in list) {
		if(key != "")$('form #'+key).addClass("error");
	}
};

var clearErrors = function() {
	$("form").find(".error").removeClass("error");
};

var getFormData = function(context) {
	var data = {};
	for(var key in context.elements) {
		var elem = context[key];
		if(elem && elem.nodeName == "INPUT") {
			data[elem.name] = elem.value;
		}
	}
	return data;
};

var isPassedValidation = function(context) {
	for(var key in context.elements) {
		var elem = context[key];
		if(elem && elem.nodeName == "INPUT") {
			var res = isValid(elem, elem.value);

			if(res.error) {
				addToErrorList(res.error);
			}
		}
	}
	return !errorList;
}
var getAction = function(url) {
	var action = false,
		i = 0,
		actions = ["add", "update", "delete", "remove", "get", "set", "signup"];
	while(i < actions.length) {
		if(url.indexOf(actions[i]) != -1) {
			action = actions[i];
			break;
		}
		i++;
	}
	return action;
};
var formAction;
var addValidation = function() {
	$(document).on('click', 'button', function() {
		formAction = false;
		formAction = $(this).attr('formaction');
	});
	$("form").on("submit", function(e) {
		var form = $(this);
		var url = form[0].action;
		url = url && url != "" ? url : formAction;
		var data;
		e.preventDefault ? e.preventDefault() : e.returnValue=false;
		errorList = false;
		clearErrors();
		if(!isPassedValidation(form.context)) {
			return showErrors(errorList);
		}
		data = getFormData(form.context);
		globals.action = getAction(url);
		$.post(url, data, function(res) {
			showNotification(res);
		});
	});
};

$(document).ready(addValidation);