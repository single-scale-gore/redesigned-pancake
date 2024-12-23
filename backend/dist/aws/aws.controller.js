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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsController = void 0;
const common_1 = require("@nestjs/common");
const aws_service_1 = require("./aws.service");
let AwsController = class AwsController {
    constructor(service) {
        this.service = service;
    }
    getUsage(ipAddress, interval, timePeriod) {
        return this.service.getCpuUsage(ipAddress, interval, timePeriod);
    }
};
exports.AwsController = AwsController;
__decorate([
    (0, common_1.Get)('usage'),
    __param(0, (0, common_1.Query)('ipAddress')),
    __param(1, (0, common_1.Query)('interval')),
    __param(2, (0, common_1.Query)('timePeriod')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AwsController.prototype, "getUsage", null);
exports.AwsController = AwsController = __decorate([
    (0, common_1.Controller)('aws'),
    __metadata("design:paramtypes", [aws_service_1.AwsService])
], AwsController);
//# sourceMappingURL=aws.controller.js.map