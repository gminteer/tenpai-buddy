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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const typedi_1 = __importDefault(require("typedi"));
const Account_1 = require("./resolvers/Account");
const Profile_1 = require("./resolvers/Profile");
const Score_1 = require("./resolvers/Score");
const jwt_1 = require("./utils/jwt");
const app = (() => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [Account_1.AccountResolver, Profile_1.ProfileResolver, Score_1.ScoreResolver],
            container: typedi_1.default,
        }),
        context: ({ req }) => ({ req }),
    });
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use(jwt_1.jwtMiddleware);
    apolloServer.applyMiddleware({ app });
    if (process.env.NODE_ENV === 'production') {
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client/build')));
        app.get('*', (_req, res) => {
            res.sendFile(path_1.default.join(__dirname, '../client/build/index.html'));
        });
    }
    return app;
}))();
exports.default = app;
//# sourceMappingURL=app.js.map