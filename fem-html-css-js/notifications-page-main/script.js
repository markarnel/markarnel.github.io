'use strict';
// PRIVATE MESSAGE TOGGLE
const privateMessage = document.querySelector(".ntf-content__pm");

const pm = document.querySelector(".pm");

// FOR EACH CLICK ON UNREAD MESSAGE
const unreadMessage = document.querySelectorAll(".unread");

const unread = document.getElementById("notification-number");
// IF CLICK MARKALL

const markAll = document.getElementById("markall-asread");

// Icon Notify
const iconNotify = document.querySelectorAll(".icon-notify");

// View Picture
const viewPicture = document.getElementById("view-picture");


unread.innerText = unreadMessage.length;



// EACH CLICK ON UNREAD MESSAGES
unreadMessage.forEach((message) => {
   message.addEventListener("click", () => {

      message.classList.remove("unread");

      const newUnreadMessage = document.querySelectorAll(".unread");

      unread.innerText = newUnreadMessage.length;

      const iconNotify = message.querySelector('.icon-notify');
      
      if(iconNotify) {
         iconNotify.remove();
      }
      
   })
})


// CLICKING MARKALL AS READ
markAll.addEventListener("click", () => {
   unreadMessage.forEach(message => message.classList.remove("unread"));
   const newUnreadMessage = document.querySelectorAll(".unread");
   unread.innerText = newUnreadMessage.length;

   iconNotify.forEach((icon) => {
      icon.remove();
    });
})




// Toggle Private Message
pm.addEventListener("click", () => {
   privateMessage.classList.toggle('hidden');
});



