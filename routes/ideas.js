const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const { ensureAuthenticated} = require('../helpers/auth')
require('../models/idea')
const Idea = mongoose.model('ideas')


//Idea Page
router.get('/', ensureAuthenticated,(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas =>{
        res.render('ideas/index',{ideas:ideas})
    })
})
//ideas add
router.get('/add', ensureAuthenticated,(req,res)=>{
    res.render('ideas/add')
});

//edit Ideas
router.get('/edit/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    }).then(idea =>{
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized')
            res.redirect('/ideas')
        }else{
            res.render('ideas/edit',{
                idea:idea
            })
        }
        
    })
   
})

router.put('/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video idea Updated')
            res.redirect('/ideas');
        })
    });
});

router.delete('/:id', (req, res)=> {
    Idea.remove({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg', 'video idea removed'); 
        res.redirect('/ideas')
    })
})
//process form
router.post('/',(req,res)=>{
    let errors = [];

    if(!req.body.title){
        errors.push({text:'please add a Title'});
    }
    if(!req.body.details){
        errors.push({text:'please add a Details'});
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user:req.user.id
        }
      new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea Added')
          res.redirect('/ideas')
      })
    }
    // console.log(req.body)
    // res.render('ideas/add')
})

module.exports = router;