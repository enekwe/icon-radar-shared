"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const logger_1 = require("../utils/logger");
function requestLogger(req, res, next) {
    const authReq = req;
    const startTime = Date.now();
    logger_1.logger.logRequest(req.method, req.path, {
        correlationId: authReq.correlationId,
        userId: authReq.user?.userId,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
    });
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - startTime;
        logger_1.logger.logResponse(req.method, req.path, res.statusCode, duration, {
            correlationId: authReq.correlationId,
            userId: authReq.user?.userId,
        });
        return originalSend.call(this, data);
    };
    next();
}
exports.default = requestLogger;
