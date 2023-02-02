const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//user model
const User = require('./../models/User');

//user verification modul
const UserVerification = require('./../models/UserVerification');

//nodemailer email handler
const nodemailer = require('nodemailer');

// unique string verification uuid
const  {v4: uuidv4} = require('uuid');

//dot env
require('dotenv').config();
NODE_TLS_REJECT_UNAUTHORIZED='0'
//node mailer transpoerter
let transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    port: 465,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
    tls: {
        rejectUnauthorized: false
      }
});

// check fr sucess 
transporter.verify((error, success) =>{
    if(error){
        console.log(error)
    }else{
        console.log("ready for messages");
        console.log('Success');
    }
})




//signup route
router.post("/signup", async (req, res) => {
    const { name, email, password, dateOfBirth, phone } = req.body;
    const fields = [name, email, password, dateOfBirth, phone];
    const messages = [
      "Name is required",
      "Email is required",
      "Password is required",
      "Date of birth is required",
      "Phone is required"
    ];
  
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i]) {
        return res.json({
          status: "failed",
          message: messages[i]
        });
      }
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.json({
        status: "failed",
        message: "Invalid email input. Only letters, numbers, and underscores allowed."
      });
    }
  
    if (!/[()a-zA-Z0-9 ?,/.-]/.test(name)) {
      return res.json({
        status: "failed",
        message: "Invalid name. Only letters allowed."
      });
    }
  
    if (!new Date(dateOfBirth).getTime()) {
      return res.json({
        status: "failed",
        message: "Invalid date of birth."
      });
    }
  
    if (phone.length < 11) {
      return res.json({
        status: "failed",
        message: "Invalid phone. Phone number must be at least 11 characters."
      });
    }
  
    if (password.length < 8) {
      return res.json({
        status: "failed",
        message: "Password is too short. Must be at least 8 characters."
      });
    }
  
    const existingUser = await User.findOne({ email });
  
    if (existingUser) {
      return res.json({
        status: "failed",
        message: "User with this email already exists."
      });
    }
  
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    const newUser = new User({
      name,
      email,
      phone,
      dateOfBirth,
      password: hashedPassword
    });
  
    try {
      const savedUser = await newUser.save();
      return res.json({
        status: "success",
        message: "User created successfully",
        data: savedUser
      });
    } catch (error) {
      return res.json({
        status: "failed",
        message: "An error occurred while saving the user to the database."
      });
    }
  });


//sigin route
router.post('/signin', (req, res)=>{
    let {email, password} = req.body;
   email = email.trim();
   password = password.trim()

   if(email==''|| password==''){
    res.json({
        status: "failed",
        message: "fields are empty"
    })
   } else{
        // check if user exist
        User.find({email: email})
        .then (data =>{
            if(data.length){
                // user exist, ttaks hashed password


                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result=>{
                    if(result){
                        res.json({
                            status: "sucess",
                            message: "signin successful",
                            data: data
                        })
                    }else{
                        res.json({
                            status: 'failed',
                            message: 'invalid passsord'
                        })
                    }
                })
                .catch(err=>{
                    res.json({
                        status: 'faild',
                        message: "an error occured while typing password"
                    })
                })
            }else{
                res.json({
                    status: 'failed',
                    message: 'invalid input'
                })
            }
        })
        .catch(err =>{
            res.json({
                status: "failed",
                message: "an error occured while looking up for exisiting user"
            })
        })
   }
})



module.exports = router;