const express = require('express');
const router = express.Router();


//signup route
router.post('/signup', (req, res)=>{
   let {name, email, password, dateOfBirth, phone} = req.body;
   name = name.trim();
   email = email.trim();
   password = password.trim();
   dateOfBirth = dateOfBirth.trim();
   phone = phone.trim();

   if (name == '' || email == '' || password == '' || dateOfBirth == '' || phone ==''){
        res.status(402).json("invalid credntials");
   }
})


//sigin route
router.post('/sigin', (req, res)=>{
   
})



module.exports = router;