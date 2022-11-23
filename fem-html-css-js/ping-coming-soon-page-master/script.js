let btn = document.querySelector(".button")
let form = document.querySelector(".main__form")
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

         form.setAttribute
            ('style', 'margin-bottom: 136px;')

      } else if (validation === false) {

         err.setAttribute
            ('style', 'display: block;')

         email.setAttribute
            ('style', 'margin-bottom: 0px;')

         form.setAttribute
            ('style', 'margin-bottom: 74px;')


      }

   }


)


