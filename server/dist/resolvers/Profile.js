"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ProfileResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Account_1 = require("../entities/Account");
const GenericResponse_1 = require("../entities/GenericResponse");
const Profile_1 = require("../entities/Profile");
const ProfileInput_1 = require("./types/ProfileInput");
class ProfileResolver {
    myProfile(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.req.token)
                return null;
            const profile = yield Profile_1.ProfileModel.findById(ctx.req.token.profile);
            if (!profile)
                return null;
            return profile;
        });
    }
    profile(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield Profile_1.ProfileModel.findOne({ username });
            return profile ? profile : null;
        });
    }
    updateProfile(data, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.req.token)
                return null;
            const account = yield Account_1.AccountModel.findById(ctx.req.token.sub);
            if (!account)
                throw new Error('Valid JWT, but no account found?!');
            if (account.profile)
                return Profile_1.ProfileModel.findByIdAndUpdate(account.profile, data, { new: true });
            const profile = yield Profile_1.ProfileModel.create(Object.assign(Object.assign({}, data), { account: account._id }));
            account.profile = profile._id;
            yield account.save();
            return profile;
        });
    }
    deleteProfile(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.req.token)
                return null;
            const account = yield Account_1.AccountModel.findById(ctx.req.token.sub);
            if (!account)
                throw new Error('Valid JWT, but no account found?!');
            if (!account.profile)
                return { ok: true, message: 'No profile to delete' };
            yield Profile_1.ProfileModel.findByIdAndDelete(account.profile);
            account.profile = undefined;
            yield account.save();
            return { ok: true, message: 'Profile deleted' };
        });
    }
}
__decorate([
    type_graphql_1.Query(() => Profile_1.Profile, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "myProfile", null);
__decorate([
    type_graphql_1.Query(() => Profile_1.Profile, { nullable: true }),
    __param(0, type_graphql_1.Arg('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "profile", null);
__decorate([
    type_graphql_1.Mutation(() => Profile_1.Profile, { nullable: true }),
    __param(0, type_graphql_1.Arg('data')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProfileInput_1.ProfileInput, Object]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "updateProfile", null);
__decorate([
    type_graphql_1.Mutation(() => GenericResponse_1.GenericResponse),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "deleteProfile", null);
exports.ProfileResolver = ProfileResolver;
//# sourceMappingURL=Profile.js.map