if(process.env.NODE_ENV !== 'production'){
   require('dotenv').config();
}


//require('dotenv').config();


const express =require('express');
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const session= require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy= require('passport-local');
const User=require('./models/user');
// const helmet=require('helmet');

const userRoutes=require('./routes/users');
const campgroundsRoutes=require('./routes/campgrounds');
const reviewsRoutes=require('./routes/reviews');

const mongoSanitize = require('express-mongo-sanitize');



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
   // useCreateIndex:true,
    useUnifiedTopology:true,
   // useFindAndModify:false
});


// connecting mongoDB
const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});



const app=express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}))


// function of session i.e just like cookies
const sessionConfig ={
    name:'session',
    secret: 'this is gone went',
    resave:false,
    saveUninitialized:true,
    cookie: {
        httpOnly:true,
        //secure:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    } 
}
app.use(session(sessionConfig));   // just like a cookies middleware 
app.use(flash());



app.use(passport.initialize());   // for authencation middleware for nodejs
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req, res, next) => {
   // console.log(req.session);
   //console.log(req.query);
    res.locals.currentUser= req.user;
    res.locals.success = req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home')
   
});

// app.get('/hello_world', (req, res) =>{

//     res.send('hello world');
// })


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
     const { statusCode=500 }=err;
     if(!err.message) err.message='Oh No, Something Went Wrong!!'
     res.status(statusCode).render('error', {err});
    
})

app.listen(3000, () => {
    console.log('Serving on port 3000')  
})
