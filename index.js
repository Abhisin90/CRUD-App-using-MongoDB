const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Product = require('./models/product')
const AppError = require('./AppError')

mongoose.connect('mongodb://127.0.0.1:27017/GroceryStore')
  .then(() => {
console.log("Mongo Connection done!!!")
  }) 
  .catch(err => {
    console.log("Error Occured!!!")
    console.log(err)
  })

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const categories = ['fruits','vegetables','dairy']

function catchAsync(fn) {                      // async utility helps to duplicate try and catch for async erro handling
  return function (req,res,next) {
    fn(req,res,next).catch(e => next(e))
  }
}

app.get('/products', catchAsync(async (req,res) => {
  const {category} = req.query
  if(category) {
    const products = await Product.find({category})
    res.render('products/index',{products,category})
  }
  else {
    const products = await Product.find({})
    res.render('products/index',{products,category:"All"})
  }  
}))

app.get('/products/new',(req,res) =>{
  res.render('products/new')
})

app.get('/products/:id',catchAsync(async (req,res) => {     // async function ->> next is called automatically when rejected or thrown error,next will call the error handler then
  const {id} = req.params
  const product = await Product.findById(id)
  if(!product) {
    throw new AppError("No such Product",404)      // passing the errot to next
  }
  res.render('products/show',{product})
}))

app.get('/products/:id/edit',catchAsync(async (req,res) => {
  const {id} = req.params
  const product = await Product.findById(id)
  if(!product) {
    throw new AppError("No such Product",404)  // passing the error to next
  }
  res.render('products/edit',{product,categories}) 
}))

app.post('/products', catchAsync(async (req,res) => {
  //  Product.insertMany(req.body)
  const newProduct = new Product(req.body)
  await newProduct.save()
  res.redirect('/products')
}))

app.put('/products/:id',catchAsync(async (req,res) => {
  const {id} = req.params
  await Product.findByIdAndUpdate(id,req.body,{runValidators:true})
  res.redirect(`/products`)
}))
  
app.delete('/products/:id',catchAsync(async (req,res) => {
    const {id} = req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products') 
}))

app.use((err,req,res,next) => {
  const {status=500,message="etege"} = err
  res.status(status).send(message)
})

app.listen(3000, () => {
  console.log("APP running on port 3000!!!")
})
