export declare class AwsService {
    private cloudWatchClient;
    private ec2Client;
    constructor();
    private _getCpuMetrics;
    getCpuUsage(ipAddress: string, intervalSecondesQuery: string, timePeriodHoursQuery: string): Promise<{
        dataPoints: {
            timestamp: string;
            value: number;
        }[];
    }>;
    private _getInstanceIdFromIp;
}
