const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const accountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Invalid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  },
});

accountSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password'))
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

accountSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = model('Account', accountSchema);
