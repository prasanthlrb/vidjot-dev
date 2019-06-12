const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../models/Users')
const Users = mongoose.model('users')

router.get('/login',(req,res)=>{
    res.render('users/login')
});

router.get('/register',(req,res)=>{
    res.render('users/register')
});

router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next)
})

router.post('/register', (req,res)=>{
    let errors = [];
    if(req.body.password != req.body.password2){
        errors.push({text:"Password and Conform Password Did't Match"})
    }

    if(req.body.password.length < 4){
        errors.push({text:"Password Length at least must be 4 Character "})
    }

    if(errors.length > 0){
        res.render('users/register',{
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        password2 : req.body.password2,
        errors:errors
        });
    }else{
        Users.findOne({email: req.body.email})
        .then(user =>{
            if(user){
                req.flash('error_msg','Email was already registered');
                res.redirect('/users/login');
            }else{
                const newUser = new Users({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg','you are now registered and can log in');
                            res.redirect('login');
                        })
                        .catch(err =>{
                            console.log(err)
                            return;
                        })
                    })
                })
            }
        })
        
    }
   
})

//Logout User 
router.get('/logout',(req, res)=>{
req.logout();
req.flash('success_msg','you are logged out');
res.redirect('/users/login')
})

module.exports = router;
