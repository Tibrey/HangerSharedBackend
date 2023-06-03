const express = require('express');  //import express
const connectDB = require('./databae/Database');
const cors = require('cors');
const cloudinary = require('cloudinary');
const multipart = require ('connect-multiparty');

require("dotenv").config();//config dotenv WHICH IS USED TO HIDE THE DATA
const app = express(); //use express using app

//express JSON
app.use(express.json());
app.use(multipart())

//cors config
const corsOptions = {
    origin:true,
    credentials:true,
    optionSuccessStatus:200
};

//cloudinary config
cloudinary.config({
  cloud_name: "dzxf1ji3q",
  api_key: "232168476699984",
  api_secret: "8LvduQdGDpIRHqqqKgUmVMEfeB4"
});

app.use(cors(corsOptions));
// create a route
app.get('/', (req, res) => {
    res.send('Welcome to API');
});

app.use('/api/user',require('./controllers/userControllers'));
//middleware for user controller
app.use('/api/product',require('./controllers/productController'));

//connect to database
connectDB();

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`); //used to send dynamic reponse 
});