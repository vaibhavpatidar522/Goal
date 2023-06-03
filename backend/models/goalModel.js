const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    text : {
        type : 'string',
        required : [true , 'Please add a test value']

    }
    
} , {
    timestamps : true,

})

module.exports = mongoose.model('GoalSchema', goalSchema);