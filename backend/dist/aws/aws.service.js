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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsService = void 0;
const client_cloudwatch_1 = require("@aws-sdk/client-cloudwatch");
const client_ec2_1 = require("@aws-sdk/client-ec2");
const common_1 = require("@nestjs/common");
let AwsService = class AwsService {
    constructor() {
        const config = {
            region: process.env.REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
        };
        this.cloudWatchClient = new client_cloudwatch_1.CloudWatchClient(config);
        this.ec2Client = new client_ec2_1.EC2Client(config);
    }
    async _getCpuMetrics(instanceId, intervalSeconds, timePeriodHours) {
        try {
            const command = new client_cloudwatch_1.GetMetricDataCommand({
                StartTime: new Date(Date.now() - timePeriodHours * 3600000),
                EndTime: new Date(),
                MetricDataQueries: [
                    {
                        Id: 'id',
                        MetricStat: {
                            Metric: {
                                Namespace: 'AWS/EC2',
                                MetricName: 'CPUUtilization',
                                Dimensions: [
                                    {
                                        Name: 'InstanceId',
                                        Value: instanceId,
                                    },
                                ],
                            },
                            Period: intervalSeconds,
                            Stat: 'Average',
                        },
                        ReturnData: true,
                    },
                ],
            });
            const response = await this.cloudWatchClient.send(command);
            if (response.MetricDataResults[0].StatusCode !== 'Complete') {
                throw new Error('Failed to get CPU metrics');
            }
            return {
                timestamps: response.MetricDataResults[0].Timestamps || [],
                values: response.MetricDataResults[0].Values || [],
            };
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getCpuUsage(ipAddress, intervalSecondesQuery, timePeriodHoursQuery) {
        try {
            const instanceId = await this._getInstanceIdFromIp(ipAddress);
            const intervalSeconds = parseInt(intervalSecondesQuery);
            const timePeriodHours = parseInt(timePeriodHoursQuery);
            const metrics = await this._getCpuMetrics(instanceId, intervalSeconds, timePeriodHours);
            return {
                dataPoints: metrics.timestamps.map((timestamp, index) => ({
                    timestamp: new Date(timestamp).toISOString(),
                    value: metrics.values[index],
                })),
            };
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async _getInstanceIdFromIp(ip) {
        try {
            const command = new client_ec2_1.DescribeInstancesCommand({
                Filters: [
                    {
                        Name: 'private-ip-address',
                        Values: [ip],
                    },
                ],
            });
            const response = await this.ec2Client.send(command);
            if (!response.Reservations?.[0]?.Instances?.[0]) {
                throw new Error(`There is no instance found with IP: ${ip}`);
            }
            return response.Reservations[0].Instances[0].InstanceId;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
exports.AwsService = AwsService;
exports.AwsService = AwsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsService);
//# sourceMappingURL=aws.service.js.map