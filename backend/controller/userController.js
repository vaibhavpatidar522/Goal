const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');


// @desc  Register user 
// @route POST /api/users
//@access Public
const registerUser = asyncHandler( async(req , res ) =>{
    const { name , email , password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Pleas add all fields")
    }

    // check if user is already registered
    const userExists = await User.findOne({ email})

    if (userExists) {
        res.status(400)
        throw new Error("user already registered")
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password , salt) 

    // Create user
    const user = await User.create({
        name,
        email ,
        password : hashPassword

    })

    if (user) {
        res.status(201).json({
            _id : user.id,
            name : user.name,
            email : user.email, 
            token : generateToken(user.id)
        })
    }else {
        res.status(400)
        throw new Error('Invalide user')
    }
})  


// @desc  Authenticate a user
// @route POST /api/user/login
//@access Public
const loginUser = asyncHandler( async(req , res ) =>{
    const {email , password} = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error("Pleas add all fields")
    }

    //check user exist
    const user = await User.findOne({ email})

    if (user && (await bcrypt.compare(password , user.password))) {
        res.status(200).json({
            _id : user.id,
            name : user.name,
            email : user.email,
            token : generateToken(user.id)

        })
    }else {
        res.status(400)
        throw new Error('Invalide credentials')
    }
    res.json({ message : 'Login  user'})
})


// @desc  Get user data 
// @route Get /api/user/me
//@access Private
const getMe = asyncHandler( async(req , res ) =>{
    res.status(200).json(req.user) 
})

// Generate JWT token
const generateToken = (id) =>{
    return jwt.sign({id} , process.env.JWT_SECRET , {
        expiresIn : '30d',
    })
}

module.exports = {
    registerUser,
    loginUser, 
    getMe,
}