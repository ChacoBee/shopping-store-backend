    const ProductService = require('../services/ProductService')

    const createProduct = async (req, res) => {
        try{
            const { name, image, type, price, countInStock, rating, description } = req.body;

            if (!name || !image || !type || !price || !countInStock || !rating) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'All fields are required'
                });
            }
            const response = await ProductService.createProduct(req.body);
            return res.status(200).json(response);
        }catch(e){
            return res.status(404).json({
                message: e
            })
        }
    }

    const updateProduct = async (req, res) => {
        try{
            const productId = req.params.id
            const data = req.body
            
            console.log('Update request:', req.body);
            
            if(!productId){
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Product ID is required'
                });
            }
    
            const updatedProduct = await ProductService.updatedProduct(productId, data);
            return res.status(200).json(updatedProduct);

        }catch(e){
            return res.status(404).json({
                status: 'ERR',
                message: 'Server error',
                error: e.message
            });
        }
    }

    const getDetailProduct = async (req, res) => {
        try{
            const productId = req.params.id

            if(!productId){
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The product id is required'
                })
            }
            const response = await ProductService.getDetailsProduct(productId)
            return res.status(200).json(response)
        }catch(e){
            return res.status(404).json({
                message: e
            })
        }
    }

    const deleteProduct = async (req, res) => {
        try{
            const productId = req.params.id
    
            if(!productId){
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The product id is required'
                })
            }
            const response = await ProductService.deleteProduct(productId)
            return res.status(200).json(response)
        }catch(e){
            return res.status(404).json({
                message: e
            })
        }
    }

    const getAllProduct = async (req, res) => {
        try{
            const { limit, page, sortBy, order, filter} = req.query;
            const response = await ProductService.getAllProduct(
                Number(limit) || 5, 
                Number(page) || 0, 
                sortBy || 'name', 
                order || 'asc',
                filter
            )
            return res.status(200).json(response)
        }catch(e){
            return res.status(404).json({
                message: e
            })
        }
    }

    module.exports = {
        createProduct,
        updateProduct,
        getDetailProduct,
        deleteProduct,
        getAllProduct
    }