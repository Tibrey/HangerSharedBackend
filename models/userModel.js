const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname:{
        type: 'string',
    },

    lname:{
        type: 'string',
    },

    email:{
        type: 'string',
    },

    password:{
        type: 'string',
    },
    isAdmin:{
        type: 'boolean',
        default : false
    }
});

module.exports = mongoose.model('User',userSchema);
