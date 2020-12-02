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
exports.AccountResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const Account_1 = require("../entities/Account");
const Auth_1 = require("../entities/Auth");
const AuthInput_1 = require("./types/AuthInput");
const jwt_1 = require("../utils/jwt");
let AccountResolver = class AccountResolver {
    accounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return Account_1.AccountModel.find();
        });
    }
    myAccount(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.req.token)
                return null;
            const account = yield Account_1.AccountModel.findById(ctx.req.token.sub).populate('profile');
            if (!account)
                return null;
            return account;
        });
    }
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield Account_1.AccountModel.findOne({ email });
            if (!account)
                throw new apollo_server_express_1.AuthenticationError('Invalid credentials');
            const pwIsValid = yield account.comparePassword(password);
            if (!pwIsValid)
                throw new apollo_server_express_1.AuthenticationError('Invalid credentials');
            return { token: jwt_1.createJwt(account), account };
        });
    }
    createAccount({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield Account_1.AccountModel.create({ email, password });
            return { token: jwt_1.createJwt(account), account };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Account_1.Account]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "accounts", null);
__decorate([
    type_graphql_1.Query(() => Account_1.Account, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "myAccount", null);
__decorate([
    type_graphql_1.Mutation(() => Auth_1.Auth),
    __param(0, type_graphql_1.Arg('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthInput_1.AuthInput]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Auth_1.Auth),
    __param(0, type_graphql_1.Arg('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthInput_1.AuthInput]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "createAccount", null);
AccountResolver = __decorate([
    typedi_1.Service(),
    type_graphql_1.Resolver()
], AccountResolver);
exports.AccountResolver = AccountResolver;
//# sourceMappingURL=Account.js.map