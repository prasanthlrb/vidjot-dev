const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const passport = require('passport')
//Load Router
const ideas = require('./routes/ideas')
const users = require('./routes/users')
const db = require('./config/database')
const port = process.env.PORT || 5000;

//Passport Config
require('./config/passport')(passport)

//static folder
app.use(express.static(path.join(__dirname,'public')))

//Map Global promise
mongoose.Promise = global.Promise;
//connect to mongoose
mongoose.connect(db.mongoURL,{useNewUrlParser:true})
.then(()=> console.log("Connect to MongoDB"))
.catch(err => console.log(err))

//load Idea Model
require('./models/idea')
const Idea = mongoose.model('ideas')

app.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
app.set('view engine','handlebars')

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended:false}))

// parse application/json
app.use(bodyParser.json())
//method override middleware
app.use(methodOverride('_method'));

//express sission Middleware
app.use(session({
    secret: 'session',
    resave : true,
    saveUninitialized: true
}));

//Passport Middleware 
app.use(passport.initialize());
app.use(passport.session())

app.use(flash());

//Global variables
app.use((req, res, next)=>{
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');
res.locals.user = req.user || null;
next();
})
//Middleware
// app.use((req, res, next)=>{
// req.name = 'prasanth';
// next()
// })
//home
app.get('/',(req,res)=>{
    let title = 'Welcome'
    res.render('index',{title:title})
})
//about
app.get('/about',(req,res)=>{
    res.render('about')
});


//Ideas Router

app.use('/ideas', ideas)

//users Router
app.use('/users', users)

app.listen(port,()=>{
    console.log('Server Started')
})