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
exports.ScoreResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const Account_1 = require("../entities/Account");
const Score_1 = require("../entities/Score");
const ScoreInput_1 = require("./types/ScoreInput");
let ScoreResolver = class ScoreResolver {
    scores(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (profile)
                return Score_1.ScoreModel.find({ profile }).populate('profile');
            return Score_1.ScoreModel.find().populate('profile');
        });
    }
    addScore(data, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let profile = null;
            if (ctx.req.token) {
                const user = yield Account_1.AccountModel.findById(ctx.req.token.sub);
                if (!user)
                    throw new Error('Valid JWT, but no account found?!');
                profile = user.profile;
            }
            const score = yield Score_1.ScoreModel.create(Object.assign(Object.assign({}, data), { profile }));
            return score;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Score_1.Score]),
    __param(0, type_graphql_1.Arg('profile', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScoreResolver.prototype, "scores", null);
__decorate([
    type_graphql_1.Mutation(() => Score_1.Score),
    __param(0, type_graphql_1.Arg('data')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ScoreInput_1.ScoreInput, Object]),
    __metadata("design:returntype", Promise)
], ScoreResolver.prototype, "addScore", null);
ScoreResolver = __decorate([
    typedi_1.Service(),
    type_graphql_1.Resolver()
], ScoreResolver);
exports.ScoreResolver = ScoreResolver;
//# sourceMappingURL=Score.js.map