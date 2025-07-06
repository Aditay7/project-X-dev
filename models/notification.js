const { Schema, model } = require("mongoose");

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title:{
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['remainder', 'comment', 'update'],
    default: 'remainder',
  },
  
isRead: {
    type: Boolean,
    default: false,
},
}, {timestamps: true});


const Notification = model('notification', notificationSchema);


module.exports = Notification;
