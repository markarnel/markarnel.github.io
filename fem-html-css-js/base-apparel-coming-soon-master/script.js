'use strict';

// const form = document.querySelector('.form');

// const btn = document.querySelector('.button');

// const error = document.querySelector('.error');

// const valid = document.querySelector('.valid');


let email = document.querySelector(".email")

const errorMessage = document.querySelector(".error__message")

const invalid = document.querySelector(".invalid")

const btn = document.querySelector(".button")


email.addEventListener("keyup", () => {

   let validation

   let re = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

   validation = re.test(email.value);



   if (validation === true) {
      invalid.classList.add('hidden');
      errorMessage.classList.add('hidden');
      email.setAttribute
         ('style', 'outline: 1px solid #06d6a0;')
      btn.setAttribute('style', 'background-color: #06d6a0;')
    

   } else if (validation === false)  {
      invalid.classList.remove('hidden');
      errorMessage.classList.remove('hidden');
      email.setAttribute
         ('style', 'outline: 1px solid #EE8C8C;')
         btn.setAttribute('style', 'background-color: #EE8C8C;')
   }


});