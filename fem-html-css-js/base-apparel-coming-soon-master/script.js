'use strict';

let email = document.querySelector(".email")
const error = document.querySelector(".error__message")
const invalid = document.querySelector(".invalid")
const btn = document.querySelector(".button")


//////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');


// reset email value
const resetInputValue = () => { document.querySelector(".email").value = '' }

// open modal
const openModal = function () {
   modal.classList.remove('hidden');
   overlay.classList.remove('hidden');
};

//close modal
const closeModal = function () {
   modal.classList.add('hidden');
   overlay.classList.add('hidden');
};



// validate email false
function validateEmailFalse() {

   let validation
   let re = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
   validation = re.test(email.value);

   if (validation === false) {
      invalid.classList.remove('hidden');
      error.classList.remove('hidden');

      email.setAttribute
         ('style', 'outline: 1px solid #EE8C8C;')

      btn.setAttribute('style', 'background-color: #EE8C8C;')

   } else {

      invalid.classList.add('hidden');
      error.classList.add('hidden');

      email.setAttribute
         ('style', 'outline: 1px solid #00FF00;')

      btn.setAttribute('style', 'background-color: #00FF00;')
   }

}

// validate email true
function validateEmailTrue() {

   let validation
   let re = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
   validation = re.test(email.value);

   if (validation === true) {
      resetInputValue();
      openModal();

      email.setAttribute
         ('style', 'border: 1px solid #ce9797;')

      btn.setAttribute('style', 'background-color: #ee8c8c;')

   }

}

btn.addEventListener('click', validateEmailTrue);

email.addEventListener('keyup', validateEmailFalse);

// BTN CLOSE MODAL

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
   // console.log(e.key);

   if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
   }
});


