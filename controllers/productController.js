const router = require('express').Router();
const productModel = require('../models/productModel');
const cloudinary = require('cloudinary');
const authGuard = require('../auth/authGuard');

//create a add prduct route
router.post('/add', authGuard, async (req, res) => {
    console.log(req.body);

    //destructing
    const { productName, productPrice, productCategory, productDescription } = req.body;
    const { productImage } = req.files;

    //validation
    if (!productName || !productPrice || !productCategory || !productDescription || !productImage) {
        return res.status(422).json({ msg: "Please enter all the fields." });
    }

    try {
        //upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            productImage.path,
            {
                folder: "hanger",
                crop: "scale"
            },
        );

        //create a new product
        const newProduct = new productModel({
            name: productName,
            price: productPrice,
            category: productCategory,
            description: productDescription,
            image: uploadedImage.secure_url,
        });
        //save the new product
        await newProduct.save();
        res.status(201).json("Product registered successfully");

    } catch (error) {
        res.json(error);
    }


});

//getall products
router.get('/get_products', async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//get single product
router.get('/get_product/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//updating product
router.put('/update_product/:id', authGuard, async (req, res) => {
    console.log(req.body);

    //destructing
    const { productName, productPrice, productCategory, productDescription } = req.body;
    const { productImage } = req.files;

    //validation
    if (!productName || !productPrice || !productCategory || !productDescription || !productImage) {
        return res.status(422).json({ msg: "Please enter all the fields." });
    }

    try {
      if(productImage){
          //upload image to cloudinary
          const uploadedImage = await cloudinary.v2.uploader.upload(
              productImage.path,
              {
                  folder: "hanger",
                  crop: "scale"
              },
          );

          //update product 
          const product = await productModel.findById(req.params.id);
          product.name = productName;
          product.price = productPrice;
          product.category = productCategory;
          product.description = productDescription;
          product.image = uploadedImage.secure_url;


          //save the new product
          await product.save();
          res.status(201).json("Product updated successfully");
      }
      else{
          //update product 
          const product = await productModel.findById(req.params.id);
          product.name = productName;
          product.price = productPrice;
          product.category = productCategory;
          product.description = productDescription;


          //save the new product
          await product.save();
          res.status(201).json("Product updated successfully");
      }

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//delete the product
router.delete('/delete_product/:id', authGuard, async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });

    }
}
);

module.exports = router;