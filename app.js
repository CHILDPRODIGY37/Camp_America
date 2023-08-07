if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

console.log(process.env.SECRET)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const Joi = require('joi')
const flash = require('connect-flash')
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const Campground = require('./models/campground');
const Review = require('./models/review')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/camp-niger')
    .then(() => {
        console.log(" MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log(" MONGO OH AN ERROR")
        console.log(err)
    });



const app = express();

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 23 * 7,
        maxAge: 1000 * 60 * 60 * 23 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'george@email.com', username: 'george' })
    const newUser = await User.register(user, 'goat')
    res.send(newUser)
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get("/", (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh no Something Went Wrong'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log('LISTENING TO PORT 3000')
})