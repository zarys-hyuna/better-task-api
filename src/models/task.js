const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true

    },
    description: {
        type: String,
        required:true,
        trim: true
    },
    status: {
        type: 'String',
        trim: true,
        default: 'To-Do'
    },
    completedDate: {
        type: Date
    }

}, 
{
    timestamps: true
}
)
const Task = mongoose.model('Tasks', schema)

module.exports = Task