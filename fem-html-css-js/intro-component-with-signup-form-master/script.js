
'use strict';

const form = document.getElementById('form');

const fname = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email-address');
const password = document.getElementById('password');


form.addEventListener('submit', e => {
	e.preventDefault();

	Validate();


});

const sendData = (fnameValue, sRate, Count) => {
	if(sRate === Count){
		 swal("Hello " + fnameValue , "You are Registered", "success");
	}
}

const SuccessMsg = (fnameValue) => {
	let formContr = document.getElementsByClassName('form-control');
	var Count = formContr.length - 1;
	for(var i = 0; i < formContr.length; i++){
		 if(formContr[i].className === "form-control success"){
			  var sRate = 0 + i;
			  console.log(sRate);
			  sendData(fnameValue, sRate, Count);
		 }
		 else{
			  return false;
		 }
	}
}

function Validate() {
	const fnameValue = fname.value.trim();
	const lastNameValue = lastName.value.trim();
	const emailValue = email.value.trim();
	const passwordValue = password.value.trim();

	//first name
	if (fnameValue === "") {
		setErrorFor(fname, 'first name cannot be blank');

	}
	else if (fnameValue.length <= 2) {
		setErrorFor(fname, 'minimum of 3 characters');

	}
	else {
		setSuccessFor(fname);

	}

	//last name
	if (lastNameValue === "") {
		setErrorFor(lastName, 'last name cannot be blank');
	}
	else if (lastNameValue.length <= 2) {
		setErrorFor(lastName, 'minimum of 3 characters');
	}
	else {
		setSuccessFor(lastName);
	}

	//email
	if (emailValue === "") {
		setErrorFor(email, 'email cannot be blank');
	}
	else if (!isEmailValid(emailValue)) {
		setErrorFor(email, 'Looks like this is not an email');
	}
	else {
		setSuccessFor(email);
	}

	//password
	if (passwordValue === "") {
		setErrorFor(password, 'password cannot be blank');
	}
	else if (passwordValue.length <= 7) {
		setErrorFor(password, 'minimum of 8 characaters');
	}
	else {
		setSuccessFor(password);
	}
	SuccessMsg(fnameValue);
}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	const formMargin = document.querySelector('.form-control');
	formControl.className = 'form-control success';
}

function isEmailValid(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}