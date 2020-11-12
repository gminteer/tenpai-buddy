const {AuthenticationError} = require('apollo-server-express');

module.exports = ({Account, Profile, Score}, signToken) => ({
  Query: {
    async accounts() {
      return Account.find();
    },

    async myAccount(parent, args, context) {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return Account.findById(context.user._id)
        .select('-__v -password')
        .populate('profile');
    },

    async myProfile(parent, args, context) {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return Profile.findById(context.user.profile);
    },

    async profile(parent, {username}) {
      return Profile.findOne({username});
    },

    async scores(parent, {profile}) {
      if (profile) return Score.find({profile}).populate('profile');
      else return Score.find().populate('profile');
    },

    async newToken() {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const account = await Account.findById(context.user._id);
      const token = signToken(account);
      return {token, account};
    },
  },

  Mutation: {
    // account management
    async login(parent, {email, password}) {
      const account = await Account.findOne({email});
      if (!account) throw new AuthenticationError('Bad credentials');
      const pwIsValid = await account.comparePassword(password);
      if (!pwIsValid) throw new AuthenticationError('Bad credentials');
      const token = signToken(account);
      return {token, account};
    },

    async createAccount(parent, {email, password}) {
      const account = await Account.create({email, password});
      const token = signToken(account);
      return {token, account};
    },

    // profile management
    async updateProfile(parent, {profile: profileData}, context) {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const account = await Account.findById(context.user._id);
      if (account.profile)
        return Profile.findByIdAndUpdate(account.profile, profileData, {
          new: true,
        });
      const profile = await Profile.create({
        ...profileData,
        userId: account._id,
      });
      account.profile = profile._id;
      await account.save();
      return profile;
    },

    async deleteProfile(parent, args, context) {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const account = await Account.findById(context.user._id);
      if (!account.profile) return {ok: true, message: 'No profile'};
      await Profile.findByIdAndDelete(account.profile);
      account.profile = null;
      await account.save();
      return {ok: true, message: 'Profile deleted'};
    },

    async addScore(parent, {score: scoreData}, context) {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const score = await Score.create({
        ...scoreData,
        profile: context.user.profile,
      });
      const profile = await Profile.findById(context.user.profile);
      return {...score, profile};
    },
  },
});
