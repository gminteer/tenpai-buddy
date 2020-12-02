"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = void 0;
const mongoose_1 = require("mongoose");
const scoreSchema = new mongoose_1.Schema({
    profile: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    efficiency: {
        type: mongoose_1.Schema.Types.Number,
    },
    ukeire: {
        type: mongoose_1.Schema.Types.Number,
    },
    moveCount: {
        type: mongoose_1.Schema.Types.Number,
    },
});
;
exports.Score = mongoose_1.model('Score', scoreSchema);
