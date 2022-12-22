const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Product = require('./models/product')

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

app.get('/products',async (req,res) => {
  const {category} = req.query
  if(category) {
    const products = await Product.find({category})
    res.render('products/index',{products,category})
  }
  else {
    const products = await Product.find({})
    res.render('products/index',{products,category:"All"})
  }  
})

app.get('/products/new',(req,res) =>{
  res.render('products/new')
})

app.get('/products/:id',async (req,res) => {
  const {id} = req.params
  const product = await Product.findById(id)
  res.render('products/show',{product})
})

app.get('/products/:id/edit',async (req,res) => {
  const {id} = req.params
  const product = await Product.findById(id)
  res.render('products/edit',{product,categories})
})

app.post('/products', async (req,res) => {
  //  Product.insertMany(req.body)
  const newProduct = new Product(req.body)
  await newProduct.save()
  res.redirect('/products')
})

app.put('/products/:id',async (req,res) => {
  const {id} = req.params
  await Product.findByIdAndUpdate(id,req.body,{runValidators:true})
  res.redirect(`/products`)
})

app.delete('/products/:id',async (req,res) => {
  const {id} = req.params
  await Product.findByIdAndDelete(id)
  res.redirect('/products')
})

app.listen(3000, () => {
  console.log("APP running on port 3000!!!")
})