const mongoose = require('mongoose')

async function connectDB(){
    try{
        mongoose.connect(process.env.MONGODB_URI)
        console.log('connected to db')
    }catch(err){
    }
}

module.exports = connectDB