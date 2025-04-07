const Product = require('../models/ProductModel')

const createProduct = (newProduct) =>{
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct;
        try{
            const checkProduct = await Product.findOne({
                name: name
            })
            if(checkProduct !== null){
                return resolve({
                    status: 'ERR',
                    message: 'Product with this name already exists'
                })
            }
            const createdProduct = await Product.create({
                name, 
                image, 
                type, 
                price, 
                countInStock, 
                rating, 
                description
            })
            if(createdProduct){
                return resolve({
                    status: 'OK',
                    message: 'Product created successfully',
                    data: createdProduct
                })
            }

        }catch(e){
            reject(e)
        }
    })
}
const updatedProduct = (productId, data) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const checkProduct = await Product.findById({ _id: productId });

            console.log('checkProduct: ', checkProduct)
            if(checkProduct === null){
                return resolve({
                    status: 'OK',
                    message: 'NO PRODUCT FOUND'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(productId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })
        }catch(e){
            reject(e)
        }
    })
}

const getDetailsProduct = (productId) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const product = await Product.findById({ _id: productId });

            if(!product){
                return resolve({
                    status: 'OK',
                    message: 'NO PRODUCT FOUND'
                })
            }

            resolve({
                status: 'OK',
                message: 'PRODUCT FOUND',
                data: product
            })
        }catch(e){
            reject(e)
        }
    })
}

const deleteProduct = (productId) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const checkProduct = await Product.findOne({ _id: productId });


            if(!checkProduct){
                return resolve({
                    status: 'OK',
                    message: 'NO PRODUCT FOUND'
                })
            }

            await Product.findByIdAndDelete(productId)
            resolve({
                status: 'OK',
                message: 'DELETE PRODUCT SUCCESSFULLY',
            })
        }catch(e){
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sortBy, order, filter) =>{

    return new Promise(async (resolve, reject) => {
        try{
            const totalProduct = await Product.countDocuments();
            const totalPage = Math.ceil(totalProduct / limit);

            if(filter){
                const label = filter[0];
                const allObjectFilter = await Product.find({
                    [label]: { '$regex': filter[1]}
                })
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    totalProduct: totalProduct,
                    currentPage: Number(page) + 1,
                    totalPage: totalPage
                })
            }

            const sortOption = {};
            sortOption[sortBy] = order === 'asc' ? 1 : -1;


            const allProduct = await Product.find().limit(limit).skip(page * limit).sort(sortOption);

            resolve({
                status: 'OK',
                message: 'LIST OF ALL PRODUCTS',
                data: allProduct,
                totalProduct: totalProduct,
                currentPage: Number(page) + 1,
                totalPage: totalPage
            })
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updatedProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
}