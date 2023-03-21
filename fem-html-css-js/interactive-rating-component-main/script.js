'use strict';

const rating_cards = document.querySelectorAll(".ratings__picked");

const rate_point = document.getElementById("rate");

const submit_btn = document.querySelector(".primary-btn");

const container = document.querySelector(".container");

const modal = document.querySelector(".modal");

const overlay = document.querySelector('.overlay');




let rate = null;

//close modal
const closeModal = function () {
   modal.classList.add('hidden');
   container.classList.remove('hidden');
   overlay.classList.add('hidden');
   
   const active = document.querySelector(".checked");
      
   if (active) {
      active.classList.remove("checked");
   }
};




rating_cards.forEach((rating_card) => {
   rating_card.addEventListener("click", (e) => {     
      const active = document.querySelector(".checked");

      if (active) {
         active.classList.remove("checked");
      }

      const card = e.target;
      card.classList.add("checked");
      rate = e.target.innerText;
      console.log(rate);




   })
})

submit_btn.addEventListener("click", () => {
   if (rate) {
      rate_point.innerText = rate;

      modal.classList.remove("hidden");
      container.classList.add("hidden");

      overlay.classList.remove('hidden');
   }
});


overlay.addEventListener('click', closeModal);


document.addEventListener('keydown', function (e) {
   // console.log(e.key);

   if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();

   }
});

