"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const models_1 = require("models");
exports.Query = {
    accounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Account.find();
        });
    },
    myAccount(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            return models_1.Account.findById(context.user._id)
                .select('-__v -password')
                .populate('profile');
        });
    },
    myProfile(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            return models_1.Profile.findById(context.user.profile);
        });
    },
    profile(parent, { username }) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Profile.findOne({ username });
        });
    },
    scores(parent, { profile }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (profile)
                return models_1.Score.find({ profile }).populate('profile');
            else
                return models_1.Score.find().populate('profile');
        });
    },
    newToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            const account = yield models_1.Account.findById(context.user._id);
            const token = signToken(account);
            return { token, account };
        });
    },
};
exports.Mutation = {
    // account management
    login(parent, { email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield models_1.Account.findOne({ email });
            if (!account)
                throw new apollo_server_express_1.AuthenticationError('Bad credentials');
            const pwIsValid = yield account.comparePassword(password);
            if (!pwIsValid)
                throw new apollo_server_express_1.AuthenticationError('Bad credentials');
            const token = signToken(account);
            return { token, account };
        });
    },
    createAccount(parent, { email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield models_1.Account.create({ email, password });
            const token = signToken(account);
            return { token, account };
        });
    },
    // profile management
    updateProfile(parent, { profile: profileData }, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            const account = yield models_1.Account.findById(context.user._id);
            if (account.profile)
                return models_1.Profile.findByIdAndUpdate(account.profile, profileData, {
                    new: true,
                });
            const profile = yield models_1.Profile.create(Object.assign(Object.assign({}, profileData), { userId: account._id }));
            account.profile = profile._id;
            yield account.save();
            return profile;
        });
    },
    deleteProfile(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            const account = yield models_1.Account.findById(context.user._id);
            if (!account.profile)
                return { ok: true, message: 'No profile' };
            yield models_1.Profile.findByIdAndDelete(account.profile);
            account.profile = null;
            yield account.save();
            return { ok: true, message: 'Profile deleted' };
        });
    },
    addScore(parent, { score: scoreData }, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            const profile = yield models_1.Profile.findOne({ userId: context.user._id });
            const score = yield models_1.Score.create(Object.assign(Object.assign({}, scoreData), { profile: profile._id }));
            console.log(score);
            return score;
        });
    },
};
