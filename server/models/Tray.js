const mongoose = require('mongoose');

const TraySchema = new mongoose.Schema({
  door: {
    type: String,
    enum: ['left', 'right'],
    required: true
  },
  row: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  position: {
    type: String,
    enum: ['left', 'right'],
    required: true
  },
  addedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  removed: {
    type: Boolean,
    default: false
  },
  removedDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tray', TraySchema);
