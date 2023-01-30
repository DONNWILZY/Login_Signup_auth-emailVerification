const express = require('express');
const PORT = 3001;
const mongoose = require('mongoose')
app.express();

// //database connection
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true});
const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', ()=>console.log('db connected'));



app.listen(PORT, ()=>{
    console.log(`Conneted to ${PORT} 127.0.0.2:${PORT}`)
})




