import {
  CloudWatchClient,
  GetMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';
import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsService {
  private cloudWatchClient: CloudWatchClient;
  private ec2Client: EC2Client;

  constructor() {
    const config = {
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    };

    this.cloudWatchClient = new CloudWatchClient(config);
    this.ec2Client = new EC2Client(config);
  }

  private async _getCpuMetrics(
    instanceId: string,
    intervalSeconds: number,
    timePeriodHours: number,
  ) {
    try {
      const command = new GetMetricDataCommand({
        StartTime: new Date(Date.now() - timePeriodHours * 3600000), //hours to milliseconds
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCpuUsage(
    ipAddress: string,
    intervalSecondesQuery: string,
    timePeriodHoursQuery: string,
  ) {
    try {
      const instanceId = await this._getInstanceIdFromIp(ipAddress);
      const intervalSeconds = parseInt(intervalSecondesQuery);
      const timePeriodHours = parseInt(timePeriodHoursQuery);

      const metrics = await this._getCpuMetrics(
        instanceId,
        intervalSeconds,
        timePeriodHours,
      );

      // simplify data for the frontend
      return {
        dataPoints: metrics.timestamps.map((timestamp, index) => ({
          timestamp: new Date(timestamp).toISOString(),
          value: metrics.values[index],
        })),
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async _getInstanceIdFromIp(ip: string): Promise<string> {
    try {
      const command = new DescribeInstancesCommand({
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
