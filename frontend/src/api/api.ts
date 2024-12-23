import axios from "axios";
import { MetricResponse } from "../types/metrics";

const API_BASE_URL = "http://localhost:3000";

export interface FetchMetricsParams {
  ipAddress: string;
  period: string;
  timePeriod: string;
}

export const API = {
  async fetchMetrics({
    ipAddress,
    period,
    timePeriod,
  }: FetchMetricsParams): Promise<MetricResponse> {
    try {
      const { data } = await axios.get<MetricResponse>(
        `${API_BASE_URL}/aws/usage`,
        {
          params: {
            ipAddress,
            interval: period,
            timePeriod,
          },
        }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message ?? "unknown error");
      }
      throw error;
    }
  },
};
