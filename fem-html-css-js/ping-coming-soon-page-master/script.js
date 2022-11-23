let btn = document.getElementById("button")
let fr = document.querySelector(".flex-row")
let err = document.getElementById("error")

btn.addEventListener('click',
   function validateEmail() {



      let email = document.getElementById("email")

      let validation

      let re = /\S+@\S+\.\S+/;

      validation = re.test(email.value);

      console.log(validation)


      if (validation === true) {

         email.setAttribute('style', 'border: 1px solid #4f7df3;')
         err.setAttribute
            ('style', 'display: none;')

         fr.setAttribute
            ('style', 'margin-bottom: 136px;')

      } else if (validation === false) {

         err.setAttribute
            ('style', 'display: block;')

         email.setAttribute
            ('style', 'margin-bottom: 0px;')

         fr.setAttribute
            ('style', 'margin-bottom: 74px;')


      }

   }


)


