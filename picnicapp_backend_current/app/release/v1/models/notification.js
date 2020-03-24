const { model, Schema } = require('mongoose');

const notificationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    sourceId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'update'
    },
    userId: {
        type: String,
        required: true
    },
    viewed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

module.exports = model('Notification', notificationSchema)