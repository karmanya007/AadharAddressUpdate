const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	UID: {
		type: Number,
        unique: true,
        length: 12,
		required: [true, 'UID is required'],
	},
    phoneNumber:{
        type: Number,
        unique: true,
        length: 10,
        required: [true, 'Phone numbwe is required']
    },
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
    targetId:
    {
        type:String,
        unique:true,
        default:'0'
        
    },
    status:
    {
        type:String,
        required:true,
        default:"nil"
    },
    log:{
        type: String,
        default: 'access.log'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;