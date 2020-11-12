const {Schema, model} = require('mongoose');

const scoreSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  },
  efficiency: {
    type: Schema.Types.Number,
  },
  ukeire: {
    type: Schema.Types.Number,
  },
  moveCount: {
    type: Schema.Types.Number,
  },
});

module.exports = model('Score', scoreSchema);
