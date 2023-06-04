const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true ,
        ref : 'User'
    }, 
    text : {
        type : 'string',
        required : [true , 'Please add a test value']
    } } , {
    timestamps : true,

})

module.exports = mongoose.model('Goal', goalSchema);