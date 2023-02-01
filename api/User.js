const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//import model

const User = require('./../models/User')


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
   } else if(!/[()a-zA-Z0-9 ?,/.-]/.test(name)){
        res.json({
            status: "failed",
            message: "invalid name.... only Alpha characterer alllowed"
        })
   } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
    res.json({
        status: "failed",
        message: "invalid email input. one numbers, underscore allowed"
    })
   } else if(!new Date(dateOfBirth).getTime()){
    res.json({
        status: "failed",
        message: "invalid DAte of birth"
    })
   } else if(phone.length < 11){
    res.json({
        status: "failed",
        message: "Only Number allowed"
    })
   } else if(password.lenth<8){
    res.json({
        status: "failed",
        message: "password is too short. must not be less than 8"
    })
   } else{
    //clear raod after ditching errors
    // check for user existence

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds).then(hashedPassword=>{
        const newUser = new User({
            name,
            email,
            phone,
            dateOfBirth,
            password
        });

        newUser.save().then(result=>{
           res.json({
            status: 'failed',
            message: "faile to save user to db",
            data: result
           })
        }).catch(err=>{
            res.json({
                status: 'failed',
                message: "user errr"
            })
        })
    }).catch(err=>{
        res.json({
            status: "failed",
            message: "an error occured while fecthign hasged password/password do not match"
        })
    })


    const user = new User({email});
    user.find().then(result =>{
        if(result.length ){
            res.json({
                status: 'failed',
                message: 'user with this email already exist'
            })
        }else{
                    ///// if user doesnt exist, create a user n the data base
                      
        }
    }).catch(err =>{
        console.log(err);
        res.json({
            status: "FAILED",
            message: "an eror occured while checking for this user"
        })
    })
   }
})


//sigin route
router.post('/sigin', (req, res)=>{
   
})



module.exports = router;