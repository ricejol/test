const mongoose = require('mongoose')
const Schema  = mongoose.Schema


const table =  Schema({
    email:{
    type: String,
    
},

password:{
    type: String,
    
}

})

module.exports = mongoose.model('users', table)