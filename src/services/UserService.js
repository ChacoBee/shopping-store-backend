const User = require('../models/UserModel')
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefershToken } = require('./JwtService')


const createUser = (newUser) =>{
    return new Promise(async (resolve, reject) => {
        const {name, email, password, confirmPassword, phone} =  newUser
        try{
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser !== null){
                return resolve({
                    status: 'ERR',
                    message: 'The email is already created'
                })
            }
            const hash = bcrypt.hashSync(password, 10);
            console.log('hash', hash)
            const createdUser = await User.create({
                name, 
                email, 
                password: hash, 
                confirmPassword: hash, 
                phone
            })
            if(createdUser){
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
           }
        }catch(e){
            reject(e)
        }
    })
}

const loginUser = (userLogin) =>{
    return new Promise(async (resolve, reject) => {
        const {email, password} =  userLogin
        try{
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser === null){
                resolve({
                    status: 'ERR',
                    message: 'NO USER FOUND'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            console.log('comparePassword', comparePassword)
            if(!comparePassword){
                return resolve({
                    status: 'ERR',
                    message: 'The password is incorrect',
                })
            }
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await generalRefershToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        }catch(e){
            reject(e)
        }
    })
}

const updateUser = (id, data) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const checkUser = await User.findOne({ _id: id });

            console.log('checkUser: ', checkUser)
            if(checkUser === null){
                return resolve({
                    status: 'OK',
                    message: 'NO USER FOUND'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        }catch(e){
            reject(e)
        }
    })
}

const deleteUser = (id) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const checkUser = await User.findOne({ _id: id });

            console.log('checkUser: ', checkUser)
            if(!checkUser){
                return resolve({
                    status: 'OK',
                    message: 'NO USER FOUND'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'DELETE USER SUCCESSFULLY',
            })
        }catch(e){
            reject(e)
        }
    })
}


const deleteManyUser = (ids) =>{
    return new Promise(async (resolve, reject) => {
        try{
            await User.deleteMany({_id: ids})
            resolve({
                status: 'OK',
                message: 'DELETE USERS SUCCESSFULLY',
            })
        }catch(e){
            reject(e)
        }
    })
}
const getAllUser = () =>{
    return new Promise(async (resolve, reject) => {
        try{
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'LIST OF ALL USERS',
                data: allUser
            })
        }catch(e){
            reject(e)
        }
    })
}

const getDetailsUser = (id) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const user = await User.findOne({ _id: id });

            if(!user){
                return resolve({
                    status: 'OK',
                    message: 'NO USER FOUND'
                })
            }

            resolve({
                status: 'OK',
                message: 'USER FOUND',
                data: user
            })
        }catch(e){
            reject(e)
        }
    })
}



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}