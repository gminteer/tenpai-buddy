"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwt = exports.jwtMiddleware = void 0;
const express_jwt_1 = __importDefault(require("express-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRATION = '2h';
exports.jwtMiddleware = express_jwt_1.default({
    secret: SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
    requestProperty: 'token',
});
function createJwt(account) {
    return jsonwebtoken_1.default.sign({ sub: account._id, profile: account.profile }, SECRET, {
        expiresIn: EXPIRATION,
    });
}
exports.createJwt = createJwt;
//# sourceMappingURL=jwt.js.map