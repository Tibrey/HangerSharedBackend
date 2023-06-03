// const connectDB = require('../databae/Database');

const router = require('express').Router();
const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//create a test route
router.get('/hello', (req, res) => {
    res.send('Welcome to API controller');
});

//create a route for user registration
router.post('/register', async (req, res) => {
    console.log(req.body);
    // res.send('Welcome to Registration Form');

    //destructing
    const { fname, lname, email, password } = req.body;
    console.log(fname); //check that if the fname is printed or not

    if (!fname || !lname || !email || !password) {
        return res.status(400).json({ msg: "Please enter all the fields." });
    }

    try {
        //check for existing user
        const existingUser = await user.findOne({ fname, lname, email, password });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists." });
        }

        //hash the password
        const salt = await bcrypt.genSaltSync(10);
        const passwordHAsh = await bcrypt.hashSync(password, salt);

        //create a new user
        const newUser = new user({
            fname: fname,
            lname: lname,
            email: email,
            password: passwordHAsh
        })

        //save user
        newUser.save();
        res.json("User registration successful");

    }

    catch (error) {
        res.status(400).json({ msg: "User registration failed." });
    }

});

//LOGIN
//create a route for user login 
router.post("/login", async(req, res) => {
    console.log(req.body)

    //destructing
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields." });
    }

    try {
        const User = await user.findOne({email});

        //chack if user exists
        if (!User) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        //check if the password is correct 
        const isCorrectPassword = await bcrypt.compare(password, User.password);
        if (!isCorrectPassword) {
            await res.status(400).json({ msg: "Invalid credentials" });
        }

        //creating a token and signing it with json web token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 24 * 60 * 60 + 1000)
        });

        //send user data
        res.json({
            token:token,
     
            user:User,
            msg: "User logged in successfully"
        });
        // res.send();

    } catch (error) {
        console.log(error);
    }
});


module.exports = router;