const {Schema, model} = require('mongoose');

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  roundsPlayed: {
    type: Schema.Types.Number,
  },
});

module.exports = model('Profile', profileSchema);
