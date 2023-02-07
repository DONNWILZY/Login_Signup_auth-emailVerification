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

// import path for static html verification file
const path = require('path');

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
      password: hashedPassword,
      //add verfified
      verified: false,
    });
  
    try {
      const savedUser = await newUser.save(); 
      sendVerificationEmail(savedUser, res);

      /*
      return res.json({
        status: "success",
        message: "User created successfully",
        data: savedUser
      }); 
      */
    } catch (error) {
      return res.json({
        status: "failed",
        message: "An error occurred while saving the user to the database."
      });
    }
  });

//send email verifcation
const sendVerificationEmail = ({_id, email}, res) =>{
  // the url of the email.. if the app is hosted, you prvided the url here, if nt, you use local hist 
const currentUrl = "http://127.0.0.1:8080";

//for the uniquw string, make use of user record in and the UUid value
const uniqueString = uuidv4() + _id;

// add mail option
const mailOption = {
  from: process.env.AUTH_EMAIL,
  to: email,
  // using html properties to for the message
  subject: "veify your email",
  html: `<p> verify your your email Address ${email} to complete sigup and login into your account</p> <p> link <b>expires in 5hrs </b> <p/> <p> press a href=${currentUrl + "user/verify/" + "/" + uniqueString }> here<a/> to proceed </p>` 
};

// hash unique string
const saltRounds = 10;
bcrypt
.hash(uniqueString, saltRounds)
.then((hashedUniqueString)=>{
    // new user verification records

    //making use of user verification model
    const newVerification = new UserVerification ({
      userid: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000,
    })

    newVerification
    .save()
    .then(()=>{
      transporter
      .sendMail(mailOption)
      .then(()=>{
        // email sent and record saved
        res.json({
          status: "pending",
          message: "verifcation token sent "
          })
      })
      .catch((error)=>{
        console.log(error)
        res.json({
        status: "failed",
        message: "cant save hashedverifiction "
        })
      })
    })
    .catch((error)=>{
      console.log(error) 
      res.json({
      status: "failed",
      message: "verification email failed"
      })
    })
})
.catch(()=>{
  res.json({
    status: "failed",
    message: "an eror occured while hashing email data"
  })
})
};

//email verifivation route 

router.get('/verify:userId/:uniqueString', (req,res)=>{
  let {userid, uniqueString} = req.params;
  UserVerification
  .find({userid})
  .then(savedUser =>{
     if(savedUser.length >0){
      // user verification record exist. we can now proceed

      // check  if the record expires or not
      const { expiresAt} = savedUser[0];
      // compare the value of the current time and the expires time
      if (expiresAt < Date.now()){
        // if expires, delete it frm the user verification
        UserVerification.deleteOne({userid})
      }

     }else{
      // user verificaion data does not exist
      let message = "User record does not exist or has been verified. kindly signup or login to access your profile";
      res.redirect(`/user/verified/error=true&message=${message}`);
     }
  })
  .catch((eror)=>{
    console.log(error)
  let message = "an error occured while cheking for the exsiting user verification record"
  //redirect the verified route and attach the messge
  // using redirect bcos it is the the only way to use the route here  and also pass parameters we need to pass
    res.redirect(`/user/verified/error=true&message=${message}`);

    
})
})

// route for verification page
router.get('/verified', (req, res)=>{
  res.sendFile(path.join(__dirname, './../views/verified.html'));
})


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