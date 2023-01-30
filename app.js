const express = require('express');
require('dotenv').config()
const PORT = 8080;
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
app = express();
app.use(bodyParser);

// //database connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true});
const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', ()=>console.log('db connected'));

//routing
const UserRouter = require('./api/User');


//use routes
app.use('/user', UserRouter);

app.listen(PORT, ()=>{
    console.log(`Conneted to ${PORT} 127.0.0.1:${PORT}`)
});




