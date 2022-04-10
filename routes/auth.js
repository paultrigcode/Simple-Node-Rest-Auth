const router = require('express').Router();
const res = require('express/lib/response');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation} = require('../validation')
const bcrypt = require('bcryptjs');
router.post('/register',async (req,res) => {
    //LETS VALIDATE THE DATA BEFORE CREATING A USER
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    //CHECK IF THE USER IS ALREADY IN THE DATABASE
    const emailExist = await User.findOne({'email': req.body.email});
    if (emailExist) return res.status(400).send('Email Already exist');

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt)
    
    const user = await new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try{
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login',async (req,res) =>{
    const{error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //CHECK IF THE Email exist
    const user = await User.findOne({'email': req.body.email});
    if (!user) return res.status(400).send('Email is wrong');

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Passwword is wrong');

    //Create and assign token
    const token =  jwt.sign({_id: user._id}, process.env.TOKEN_SECRET,{expiresIn:'60s'});
    res.header('auth_token',token).send(token);
    
    res.send('Logged In')

});

module.exports = router;