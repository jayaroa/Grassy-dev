const { Schema, model } = require('mongoose');

const pushnotificationSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    to: { type: String, },
    userId: { type: String, required: true }
}, { timestamps: true });

module.exports = model('PushNotification', pushnotificationSchema)