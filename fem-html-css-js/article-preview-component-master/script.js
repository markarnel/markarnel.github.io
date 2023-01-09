'use strict';

document.querySelector("button").addEventListener("click", result);

function result() {
   let shareOption = document.querySelector('.share__option');

   let shareBnt = document.querySelector('.share__button');

   let btnImg = document.querySelector('.share__image');
      
   let shareContainer = document.querySelector('.share__container');

   let contentAuthor = document.querySelector('.content__author');

   let contentFooter = document.querySelector('.content__footer');

   
   shareOption.classList.toggle('active');
   shareBnt.classList.toggle('active');
   shareContainer.classList.toggle('active');
   btnImg.classList.toggle('active');
   contentFooter.classList.toggle('active');

   contentAuthor.classList.toggle('hidden');

   

}

