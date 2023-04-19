'use strict';

let x;
let a;
let b;
let c;
let d;

var randNum;



document.querySelector(".btn").onclick = function () {


   randNum = getRandomNum(1, 99);
   a = randNum;
   randNum = getRandomNum(1, 99);
   b = randNum;
   randNum = getRandomNum(1, 99);
   c = randNum;
   randNum = getRandomNum(1, 99);
   d = randNum;


   document.getElementById("visual").innerHTML = a;

   document.getElementById("verbal").innerHTML = b;

   document.getElementById("memory").innerHTML = c;

   document.getElementById("reaction").innerHTML = d;

   let sum = [a, b, c, d].reduce((partialSum, a) => partialSum + a, 0);
   console.log(sum)

   var x = sum / 400 * 100;


   document.querySelector(".result__score-num").innerHTML = x.toFixed();

    if(x < 60) {
      document.querySelector(".rank__result").textContent = 'Insignificant';
      document.querySelector(".rank__text-scored").textContent = 'LOWER';
      document.querySelector(".rank__text-scored").style.color = '#ff5757';
    } else {
      document.querySelector(".rank__result").textContent = 'Great';
      document.querySelector(".rank__text-scored").textContent = 'HIGHER';
      document.querySelector(".rank__text-scored").style.color = '#00bd91';
    }

}

function getRandomNum(min, max) {
   return Math.floor(Math.random() * (max - min + 1) + min)
}



