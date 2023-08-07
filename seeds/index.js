const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')


mongoose.connect('mongodb://localhost:27017/camp-niger')
    .then(() => {
        console.log(" MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log(" MONGO OH AN ERROR")
        console.log(err)
    });

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 500) + 10
        const camp = new Campground({
            author: '64b14f3ff9782cd23b7f4775',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Quaerat dolores facilis tenetur obcaecati sint ex culpa? Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde tempora eligendi odio sequi assumenda consequatur animi impedit repudiandae quod consequuntur, dolor mollitia totam ea, fuga, maiores alias deleniti eveniet repellat.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dswiwf7k7/image/upload/v1690461747/CAMP_NIGER/o1kizoq1z6nlmj3dory3.jpg',
                    filename: 'CAMP_NIGER/o1kizoq1z6nlmj3dory3'
                },
                {
                    url: 'https://res.cloudinary.com/dswiwf7k7/image/upload/v1690461746/CAMP_NIGER/tpqdbknryly9mzxzjggi.jpg',
                    filename: 'CAMP_NIGER/tpqdbknryly9mzxzjggi'
                }
            ]
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});

