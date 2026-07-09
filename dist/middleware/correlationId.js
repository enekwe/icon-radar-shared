"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationId = correlationId;
const helpers_1 = require("../utils/helpers");
function correlationId(req, res, next) {
    const authReq = req;
    const correlationId = req.headers['x-correlation-id'] ||
        req.headers['x-request-id'] ||
        (0, helpers_1.generateUUID)();
    authReq.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    next();
}
exports.default = correlationId;
