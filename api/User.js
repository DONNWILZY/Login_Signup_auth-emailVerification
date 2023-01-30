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
    res.json({
        status: "failed",
        message: "invalid input"
    })
   } else if(!/^[a-zA- ]*$/.test(name)){
        res.json({
            status: "failed",
            message: "invalid input"
        })
   } else if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
    res.json({
        status: "failed",
        message: "invalid input"
    })
   } else if(new Date(dateOfBirth).getTime()){
    res.json({
        status: "failed",
        message: "invalid input"
    })
   } else if(phone.isNan(phone)){
    res.json({
        status: "failed",
        message: "invalid input"
    })
   } else if(password.lenth<8){
    res.json({
        status: "failed",
        message: "invalid input"
    })
   }
})


//sigin route
router.post('/sigin', (req, res)=>{
   
})



module.exports = router;