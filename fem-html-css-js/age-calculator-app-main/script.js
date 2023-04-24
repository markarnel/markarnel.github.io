const dayInp = document.getElementById("day");
const monthInp = document.getElementById("month");
const yearInp = document.getElementById("year");


const dayOtp = document.getElementById("dd");
const monthOtp = document.getElementById("mm");
const yearOtp = document.getElementById("yy");

const form = document.querySelector("form");

const date = new Date();
let day = date.getDate();
let month = 1 + date.getMonth();
let year = date.getFullYear();

const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// VALIDATE YEARS MONTHS AND AGE

function validate() {
   const inputs = document.querySelectorAll("input");
   let validator = true;
   inputs.forEach((i) => {
      const parent = i.parentElement;

      if (!i.value) {
         parent.querySelector("label").style.color = "#ff5757";

         i.style.borderColor = "#ff5757";
         parent.querySelector("small").innerText = "this field is required.";
         validator = false;
      }

      else {
         parent.querySelector("label").style.color = "#716f6f";
         i.style.borderColor = "#854dff";
         parent.querySelector("small").innerText = "";
         validator = true;
      }

      if (monthInp.value > 12 || month.value < 1) {

         monthInp.parentElement.querySelector("label").style.color = "#ff5757";

         monthInp.style.borderColor = "#ff5757";
         monthInp.parentElement.querySelector("small").innerText = "must be valid month.";
         validator = false;
      }

      if (dayInp.value > 31 || month.value < 1) {

         dayInp.parentElement.querySelector("label").style.color = "#ff5757";

         dayInp.style.borderColor = "#ff5757";
         dayInp.parentElement.querySelector("small").innerText = "must be valid day.";
         validator = false;
      }


   });
   return validator;
}

// Animate Numbers
function animateNumber(target, element, delay) {
   let current = 0;
   let interval = null;

   setTimeout(() => {
      interval = setInterval(() => {
         if (current >= target) {
            clearInterval(interval);
         } else {
            current += 1;
            element.innerHTML = current;
         }
      }, 20);
   }, delay);
}

function handleSubmit(e) {
   e.preventDefault();
   if (validate()) {
      if (dayInp.value > day) {
         day = day + months[month - 1];
         month = month - 1;
      }
      if (monthInp.value > month) {
         month = month + 12;
         year = year - 1;
      }

      const d = day - dayInp.value;
      const m = month - monthInp.value;
      const y = year - yearInp.value;

      // dayOtp.innerHTML = d;
      // monthOtp.innerHTML = m;
      // yearOtp.innerHTML = y;

      // Call Animate Numbers
      animateNumber(d, dayOtp, 1000);
      animateNumber(m, monthOtp, 1000);
      animateNumber(y, yearOtp, 1000);
   }
}

document.getElementById("submit").addEventListener("click", handleSubmit);
