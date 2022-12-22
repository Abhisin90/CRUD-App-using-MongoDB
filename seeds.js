
// seeds some initital data into database

const mongoose = require('mongoose')

const Product = require('./models/product')

mongoose.connect('mongodb://127.0.0.1:27017/GroceryStore')
  .then(() => {
console.log("Mongo Connection done!!!")
  }) 
  .catch(err => {
    console.log("Error Occured!!!")
    console.log(err)
  })


const seedProducts = [
    {
        name: 'Fairy Eggplant',
        price: 100,
        category: 'vegetables'
    },
    {
        name: 'Organic Goddess Melon',
        price: 499,
        category: 'fruits'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 399,
        category: 'fruits'
    },
    {
        name: 'Organic Celery',
        price: 150,
        category: 'vegetables'
    },
    {
        name: 'Chocolate Whole Milk',
        price: 269,
        category: 'dairy'
    },
]

Product.insertMany(seedProducts)
   .then(res => console.log(res))
   .catch(err => console.log(err))