import { AwsService } from './aws.service';
export declare class AwsController {
    private readonly service;
    constructor(service: AwsService);
    getUsage(ipAddress: string, interval: string, timePeriod: string): Promise<{
        dataPoints: {
            timestamp: string;
            value: number;
        }[];
    }>;
}
