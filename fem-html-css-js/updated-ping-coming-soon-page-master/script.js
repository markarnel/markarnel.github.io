'use strict';

let btn = document.querySelector(".btn");
let form = document.querySelector(".form");
let error = document.querySelector(".error-message");
let email = document.querySelector(".email");

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

const resetInputValue = () => {document.querySelector(".email").value = ''}

const openModal = function () {
   modal.classList.remove('hidden');
   overlay.classList.remove('hidden');
 };
 
 const closeModal = function () {
   modal.classList.add('hidden');
   overlay.classList.add('hidden');
 };


btn.addEventListener('click', function validateEmail() {

   let email = document.querySelector(".email");

   let validation;

   let re = /\S+@\S+\.\S+/;

   validation = re.test(email.value);

   console.log(validation)

   if (validation === true ) {

      error.classList.add('error');
      openModal();
      email.classList.remove('wrong');
      resetInputValue();


   } else if (validation === false) {
      
      error.classList.remove('error');
      closeModal();
      email.classList.add('wrong');
   }

});


btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
   // console.log(e.key);
 
   if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
     closeModal();
   }
 });