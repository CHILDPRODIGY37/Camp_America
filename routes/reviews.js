const express = require('express');
const router = express.Router({ mergeParams: true })
const { validateReview, isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const reviews = require('../controllers/reviews')
const Review = require('../models/review')
const Campground = require('../models/campground');


router.post('/', isLoggedIn, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, catchAsync(reviews.deleteReview))

module.exports = router